import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  imagePublicId?: string; // 👈 Add this
  availableInStocks: boolean;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String }, // 👈 Add this
  availableInStocks: { type: Boolean, default: true },
});


export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
