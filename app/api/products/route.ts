


import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Product, { IProduct } from "../../../models/Product";

/**
 * GET /api/product
 */
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().lean();
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("GET /api/product error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

/**
 * POST /api/product
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ Define a strong type for request body
    interface ProductBody {
      name: string;
      price: number;
      stock: number;
      description?: string;
      images?: string[];
    }

    const body: ProductBody = await req.json();

    // ✅ Validation
    if (!body.name || typeof body.price !== "number" || typeof body.stock !== "number") {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    // ✅ Auto-generate slug
    const slug = body.name.toLowerCase().replace(/\s+/g, "-");

    // ✅ Create product
    const newProduct: IProduct = await Product.create({
      name: body.name,
      slug,
      price: body.price,
      stock: body.stock,
      description: body.description ?? "",
      images: body.images ?? [],
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("POST /api/product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
