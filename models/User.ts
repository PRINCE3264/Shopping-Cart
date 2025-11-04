// // // models/User.ts
// // import mongoose, { Schema, Document } from "mongoose";

// // export interface IUser extends Document {
// //   email: string;
// //   phone?: string;
// //   passwordHash?: string | null;
// //   isVerified: boolean;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const UserSchema = new Schema<IUser>({
// //   email: { type: String, required: true, unique: true, lowercase: true },
// //   phone: { type: String, unique: true, sparse: true },
// //   passwordHash: { type: String },
// //   isVerified: { type: Boolean, default: false },
// // }, { timestamps: true });

// // export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);


// import mongoose, { Schema, Document } from "mongoose";

// export interface IUser extends Document {
//   email: string;
//   phone?: string;
//   passwordHash?: string | null;
//   isVerified: boolean;
//   otp?: string | null;          // Added for email verification
//   otpExpires?: Date | null;     // Added for OTP expiry
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema = new Schema<IUser>(
//   {
//     email: { type: String, required: true, unique: true, lowercase: true },
//     phone: { type: String, unique: true, sparse: true },
//     passwordHash: { type: String },
//     isVerified: { type: Boolean, default: false },

//     // ✅ New fields for OTP verification
//     otp: { type: String, default: null },
//     otpExpires: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string | null;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
