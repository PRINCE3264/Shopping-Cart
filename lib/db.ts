import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

// use a number or boolean with proper type inference
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI);

    // readyState returns a number (1 = connected)
    isConnected = db.connections[0].readyState === 1;

    console.log("✅ MongoDB Connected Successfully...!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};
