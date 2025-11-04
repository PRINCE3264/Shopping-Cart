// // models/Cart.ts
// import mongoose, { Schema, Document } from "mongoose";

// export interface ICartItem {
//   product: mongoose.Types.ObjectId;
//   qty: number;
//   priceSnapshot: number;
// }

// export interface ICart extends Document {
//   user?: mongoose.Types.ObjectId; // if user cart
//   sessionId?: string; // for guests
//   items: ICartItem[];
//   updatedAt: Date;
// }

// const CartItemSchema = new Schema({
//   product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
//   qty: { type: Number, required: true },
//   priceSnapshot: { type: Number, required: true },
// });

// const CartSchema = new Schema<ICart>({
//   user: { type: Schema.Types.ObjectId, ref: "User", index: true, sparse: true },
//   sessionId: { type: String, index: true, sparse: true },
//   items: [CartItemSchema],
// }, { timestamps: true });

// export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);


// models/Cart.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  qty: number;
  priceSnapshot: number;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true },
  priceSnapshot: { type: Number, required: true },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true, sparse: true },
    sessionId: { type: String, index: true, sparse: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
