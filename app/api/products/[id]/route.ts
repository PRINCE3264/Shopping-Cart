
// // app/api/product/[id]/route.ts
// import { NextResponse } from "next/server";
// import { connectDB } from "../../../../lib/db";
// import Product from "../../../../models/Product";

// export async function GET(
//   _req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const product = await Product.findById(params.id).lean();
//     if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     return NextResponse.json(product, { status: 200 });
//   } catch (err) {
//     console.error("GET /api/product/[id] error:", err);
//     return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
//   }
// }

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const body = (await req.json()) as {
//       name?: string;
//       price?: number;
//       stock?: number;
//       description?: string;
//       images?: string[];
//       slug?: string;
//     };

//     // Basic validation: at least one updatable field must be present
//     const allowedUpdates: Partial<typeof body> = {};
//     if (typeof body.name === "string") allowedUpdates.name = body.name;
//     if (typeof body.price === "number") allowedUpdates.price = body.price;
//     if (typeof body.stock === "number") allowedUpdates.stock = body.stock;
//     if (typeof body.description === "string") allowedUpdates.description = body.description;
//     if (Array.isArray(body.images)) allowedUpdates.images = body.images;
//     if (typeof body.slug === "string") allowedUpdates.slug = body.slug;

//     if (Object.keys(allowedUpdates).length === 0) {
//       return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
//     }

//     const updated = await Product.findByIdAndUpdate(
//       params.id,
//       { $set: allowedUpdates },
//       { new: true, runValidators: true }
//     );

//     if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });

//     return NextResponse.json(updated, { status: 200 });
//   } catch (err) {
//     console.error("PUT /api/product/[id] error:", err);
//     return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   _req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const deleted = await Product.findByIdAndDelete(params.id);
//     if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     return NextResponse.json({ message: "Product deleted" }, { status: 200 });
//   } catch (err) {
//     console.error("DELETE /api/product/[id] error:", err);
//     return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
//   }
// }



// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Product, { IProduct } from "../../../../models/Product";

type UpdateBody = {
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  images?: string[];
  slug?: string;
};

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // <-- await here
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("GET /api/product/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // <-- await here
  await connectDB();

  const body = (await req.json()) as UpdateBody;
  const updatableKeys = ["name", "price", "stock", "description", "images", "slug"];
  const hasUpdate = updatableKeys.some((k) => Object.prototype.hasOwnProperty.call(body, k));
  if (!hasUpdate) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const product = await Product.findById(id).exec();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (typeof body.name === "string") product.name = body.name;
    if (typeof body.price === "number") product.price = body.price;
    if (typeof body.stock === "number") product.stock = body.stock;
    if (typeof body.description === "string") product.description = body.description;
    if (Array.isArray(body.images)) product.images = body.images;
    if (typeof body.slug === "string") product.slug = body.slug;

    if (typeof body.name === "string" && !body.slug) {
      const candidate = slugify(body.name);
      let finalSlug = candidate;
      let suffix = 0;
      // find unique slug
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const existing = await Product.findOne({ slug: finalSlug }).exec();
        if (!existing || existing._id.toString() === product._id.toString()) break;
        suffix += 1;
        finalSlug = `${candidate}-${suffix}`;
      }
      product.slug = finalSlug;
    }

    const saved = await product.save();
    return NextResponse.json(saved, { status: 200 });
  } catch (error: unknown) {
    const e = error as { name?: string; errors?: Record<string, { message?: string }>; code?: number; keyValue?: Record<string, unknown>; message?: string };
    console.error("PUT /api/product/[id] error:", e);

    if (e?.name === "ValidationError" && e.errors) {
      const details: Record<string, string> = {};
      for (const key in e.errors) {
        if (Object.prototype.hasOwnProperty.call(e.errors, key)) {
          details[key] = e.errors[key].message ?? "Invalid value";
        }
      }
      return NextResponse.json({ error: "Validation failed", details }, { status: 400 });
    }
    if (e?.code === 11000) {
      return NextResponse.json({ error: "Duplicate key error", details: e.keyValue }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update product", message: e?.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // <-- await here
  try {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(id).exec();
    if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/product/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
