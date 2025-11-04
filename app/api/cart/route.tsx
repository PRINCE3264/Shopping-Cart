
// app/api/cart/route.ts (POST - robust add-to-cart)
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Cart, { ICartItem } from "../../../models/Cart";
import Product, { IProduct } from "../../../models/Product";
import mongoose from "mongoose";

type AddToCartBodyRaw = {
  userId?: string;
  user?: string;
  sessionId?: string;
  productId?: string;
  product?: string;
  qty?: number | string;
  quantity?: number | string;
};

export async function POST(req: Request) {
  await connectDB();

  // 1) safe parse JSON (handles empty body / invalid JSON)
  let rawBodyText: string;
  try {
    rawBodyText = await req.text();
  } catch (e) {
    console.error("Failed to read request body:", e);
    return NextResponse.json({ error: "Failed to read request body" }, { status: 400 });
  }

  if (!rawBodyText) {
    return NextResponse.json({ error: "Missing request body" }, { status: 400 });
  }

  let bodyParsed: AddToCartBodyRaw;
  try {
    bodyParsed = JSON.parse(rawBodyText) as AddToCartBodyRaw;
  } catch (e) {
    console.error("Invalid JSON body:", e);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Helpful debug log — remove or comment out in production
  console.log("POST /api/cart body:", bodyParsed);

  // 2) Normalize accepted keys (support different client names)
  const userId = (bodyParsed.userId ?? bodyParsed.user) as string | undefined;
  const sessionId = bodyParsed.sessionId as string | undefined;
  const productId = (bodyParsed.productId ?? bodyParsed.product) as string | undefined;
  const qtyRaw = (bodyParsed.qty ?? bodyParsed.quantity) as number | string | undefined;

  // 3) Validate fields with descriptive messages
  const errors: Record<string, string> = {};
  if (!productId || typeof productId !== "string" || productId.trim() === "") {
    errors.productId = "productId (or product) is required and must be a non-empty string.";
  }

  // ensure either userId or sessionId exists
  if ((!userId || userId.trim() === "") && (!sessionId || sessionId.trim() === "")) {
    errors.user = "Either userId (or user) or sessionId is required.";
  }

  // qty validation: allow numeric string or number
  let qty: number | null = null;
  if (qtyRaw === undefined || qtyRaw === null || qtyRaw === "") {
    errors.qty = "qty (or quantity) is required.";
  } else {
    // convert if string
    if (typeof qtyRaw === "string") {
      const parsed = Number(qtyRaw);
      if (Number.isNaN(parsed)) {
        errors.qty = "qty must be a number or numeric string.";
      } else {
        qty = Math.floor(parsed);
      }
    } else if (typeof qtyRaw === "number") {
      qty = Math.floor(qtyRaw);
    } else {
      errors.qty = "qty must be a number.";
    }

    if (qty !== null && qty <= 0) {
      errors.qty = "qty must be greater than 0.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Missing or invalid fields", details: errors }, { status: 400 });
  }

  // at this point productId, qty (number) and either userId or sessionId exist
  try {
    // 4) fetch product (typed) — use exec() to get doc with fields like price
    const product = (await Product.findById(productId).exec()) as IProduct | null;
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const identifier = userId ? { user: userId } : { sessionId };

    // 5) find or create cart
    let cart = await Cart.findOne(identifier).exec();
    if (!cart) {
      cart = new Cart({ ...identifier, items: [] });
    }

    // 6) find existing item (typed)
    const existingItem = cart.items.find((item: ICartItem) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.qty = existingItem.qty + (qty as number);
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        qty: qty as number,
        priceSnapshot: product.price,
      });
    }

    await cart.save();

    // 7) populate product info for frontend (name, images, price)
    const populated = await cart.populate({
      path: "items.product",
      select: "name images price slug",
    });

    return NextResponse.json(populated, { status: 200 });
  } catch (error: unknown) {
    const e = error as { message?: string; code?: number; keyValue?: unknown };
    console.error("POST /api/cart error:", e?.message ?? error);
    // if duplicate-key, return 409 with details
    if (e?.code === 11000) {
      return NextResponse.json({ error: "Duplicate key error", details: e.keyValue }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}
