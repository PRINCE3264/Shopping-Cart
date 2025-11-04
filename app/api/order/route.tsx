

// app/api/order/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { getUserFromRequest, IUserShape } from "../../../lib/requestHelpers";
import Cart from "../../../models/Cart";
import Product from "../../../models/Product";
import Order from "../../../models/Order";

/**
 * Local typings to avoid using `any`.
 * These mirror the shapes we expect from Mongoose documents (lean/plain objects).
 */
type CartProductRef = string | { _id: string } | { _id: { toString: () => string } };

type CartItemShape = {
  product: CartProductRef;
  qty: number;
  priceSnapshot: number;
};

type CartDocShape = {
  items: CartItemShape[];
  save: () => Promise<void>;
  // other fields ignored
};

type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

function getIdFromRef(ref: CartProductRef): string | null {
  if (typeof ref === "string") return ref;
  if (ref && typeof (ref as { _id: unknown })._id === "string") return (ref as { _id: { toString: () => string } })._id as string;
  if (ref && typeof (ref as { _id: { toString?: unknown } })._id === "object" && typeof (ref as { _id: { toString: unknown } })._id.toString === "function") {
    return (ref as { _id: { toString: () => string } })._id.toString();
  }
  return null;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    // get authenticated user (or null)
    const user: IUserShape | null = await getUserFromRequest(req);

    // parse body safely
    const rawBody = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const sessionId = typeof rawBody.sessionId === "string" ? rawBody.sessionId : undefined;

    const filter = user ? { user: user._id } : { sessionId };

    // find cart and populate product references (may return mongoose docs)
    const cartDocRaw = await Cart.findOne(filter).populate("items.product");
    if (!cartDocRaw) {
      return NextResponse.json({ error: "Cart not found" }, { status: 400 });
    }

    // cast to safe shape by reading fields we need
    const itemsRaw = (Array.isArray((cartDocRaw as unknown as { items?: unknown }).items) ? (cartDocRaw as unknown as { items: unknown }).items : []) as unknown[];

    if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
      return NextResponse.json({ error: "Cart empty" }, { status: 400 });
    }

    // map and validate each cart item shape
    const items: CartItemShape[] = [];
    for (const it of itemsRaw) {
      if (it && typeof it === "object") {
        const possibly = it as Record<string, unknown>;
        const qty = typeof possibly.qty === "number" ? possibly.qty : NaN;
        const priceSnapshot = typeof possibly.priceSnapshot === "number" ? possibly.priceSnapshot : NaN;
        const product = possibly.product as CartProductRef | undefined;

        if (!product || Number.isNaN(qty) || Number.isNaN(priceSnapshot)) {
          return NextResponse.json({ error: "Invalid cart item data" }, { status: 400 });
        }
        items.push({ product, qty, priceSnapshot });
      } else {
        return NextResponse.json({ error: "Invalid cart item format" }, { status: 400 });
      }
    }

    let total = 0;
    const itemsForOrder: OrderItem[] = [];

   
    for (const it of items) {
      const prodId = getIdFromRef(it.product);
      if (!prodId) {
        return NextResponse.json({ error: "Invalid product reference in cart" }, { status: 400 });
      }

      const prod = await Product.findById(prodId).exec();
      if (!prod) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      if (prod.stock < it.qty) {
        return NextResponse.json({ error: `Not enough stock for ${prod.name}` }, { status: 400 });
      }

      total += it.qty * it.priceSnapshot;
      itemsForOrder.push({
        productId: prod._id.toString(),
        name: prod.name,
        qty: it.qty,
        price: it.priceSnapshot,
      });
    }

    // create order
    const order = await Order.create({
      user: user ? user._id : undefined,
      items: itemsForOrder,
      total,
      status: "pending",
    });

    // reduce stock
    for (const it of items) {
      const prodId = getIdFromRef(it.product);
      if (prodId) {
        await Product.findByIdAndUpdate(prodId, { $inc: { stock: -it.qty } }).exec();
      }
    }

    // clear cart: update the original cart doc and save
    // cartDocRaw may be a Mongoose doc; set items to empty and save
    if (typeof (cartDocRaw).items !== "undefined") {
      (cartDocRaw ).items = [];
    }
    if (typeof (cartDocRaw ).save === "function") {
      await (cartDocRaw).save();
    }

    return NextResponse.json({ ok: true, orderId: order._id, order }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Order creation error:", err.message);
    } else {
      console.error("Order creation unknown error:", String(err));
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

