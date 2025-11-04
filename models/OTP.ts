// models/OTP.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  identifier: string;
  hashedOtp: string;
  purpose: string;
  expiresAt: Date;
  attempts: number;
  used: boolean;
}

const OTPSchema = new Schema<IOTP>({
  identifier: { type: String, required: true, index: true },
  hashedOtp: { type: String, required: true },
  purpose: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  used: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);
