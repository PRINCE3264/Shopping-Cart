import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/products
 * Fetch all products from MySQL
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Create a new product in MySQL
 */
export async function POST(req: Request) {
  try {
    interface ProductBody {
      name: string;
      price: number;
      stock: number;
      description?: string;
      images?: string[];
      category?: string;
    }

    const body: ProductBody = await req.json();

    if (!body.name || typeof body.price !== "number" || typeof body.stock !== "number") {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    const slug = body.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        price: body.price,
        stock: body.stock,
        description: body.description ?? "",
        category: body.category ?? "General",
        images: body.images ? body.images : [],
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
