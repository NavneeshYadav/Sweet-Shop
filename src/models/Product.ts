import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  availableInStocks: boolean; // ✅ Add this
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  availableInStocks: { type: Boolean, default: true }, // ✅ Add this
});

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
