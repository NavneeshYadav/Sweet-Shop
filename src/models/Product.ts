import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  imagePublicId?: string;
  availableInStocks: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Please provide a product image"],
    },
    imagePublicId: {
      type: String,
    },
    availableInStocks: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a product category"],
      enum: ["sweet product", "namkeen product", "dairy product", "bakery product", "other"],
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined (for Next.js hot reloading)
const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;