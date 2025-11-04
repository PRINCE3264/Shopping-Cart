// // models/Order.ts
// import mongoose, { Schema, Document } from "mongoose";

// export interface IOrderItem {
//   productId: mongoose.Types.ObjectId;
//   name: string;
//   qty: number;
//   price: number;
// }

// export interface IOrder extends Document {
//   user?: mongoose.Types.ObjectId;
//   items: IOrderItem[];
//   total: number;
//   status: "pending" | "paid" | "shipped" | "cancelled";
//   createdAt: Date;
// }

// const OrderItemSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
//   name: String,
//   qty: Number,
//   price: Number,
// });

// const OrderSchema = new Schema<IOrder>({
//   user: { type: Schema.Types.ObjectId, ref: "User", index: true, sparse: true },
//   items: [OrderItemSchema],
//   total: { type: Number, required: true },
//   status: { type: String, default: "pending" },
// }, { timestamps: true });

// export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);


// models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  qty: number;
  price: number;
  image?: string; // <- snapshot of product image (first image)
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  qty: Number,
  price: Number,
  image: String, // <- saved here
});

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", index: true, sparse: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
