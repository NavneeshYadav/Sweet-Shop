// File: /app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // You'll need to create this
import Product from "@/models/Product"; // You'll need to create this

// GET - Fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();

    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}