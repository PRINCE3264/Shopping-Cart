
// // models/Product.ts
// import mongoose, { Schema, Document } from "mongoose";

// export interface IProduct extends Document {
//   name: string;
//   slug: string;
//   description?: string;
//   price: number;
//   stock: number;
//   images?: string[];
// }

// function slugify(text: string) {
//   return text
//     .toString()
//     .toLowerCase()
//     .trim()
//     .replace(/&/g, "-and-")
//     .replace(/[\s\W-]+/g, "-") // collapse spaces, non-word chars, dashes
//     .replace(/(^-|-$)+/g, "");
// }

// const ProductSchema = new Schema<IProduct>(
//   {
//     name: { type: String, required: true },
//     slug: { type: String, required: true, unique: true },
//     description: String,
//     price: { type: Number, required: true },
//     stock: { type: Number, default: 0 },
//     images: [String],
//   },
//   { timestamps: true }
// );

// // Generate slug BEFORE validation so `required` check passes
// ProductSchema.pre("validate", function (next) {
//   // `this` is the document
//   if (!this.slug && this.name) {
//     this.slug = slugify(this.name);
//   }
//   next();
// });

// // Optional indexes
// ProductSchema.index({ slug: 1 });
// ProductSchema.index({ name: "text", description: "text" });

// export default mongoose.models.Product ||
//   mongoose.model<IProduct>("Product", ProductSchema);


// models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock?: number;
  images?: string[];
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    // keep unique here; do NOT call schema.index({ slug: 1 }) below
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
  },
  { timestamps: true }
);

// generate slug before validation
ProductSchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

// Keep text index for searching name + description if you want
ProductSchema.index({ name: "text", description: "text" });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
