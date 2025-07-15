import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Extend the global object type to store mongoose connection
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

// Use globalThis to avoid TypeScript errors
const cached = globalThis.mongooseCache || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "sweetShop" }).then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  globalThis.mongooseCache = cached; // Store in global scope

  return cached.conn;
}
