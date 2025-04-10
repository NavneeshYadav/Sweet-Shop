import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product, { IProduct } from "@/models/Product";

export async function GET() {
  await connectToDatabase();
  const products = await Product.find({});
  return NextResponse.json(products, { status: 200 });
}

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { name, price, image, availableInStocks }: IProduct = await req.json();

    const newProduct = new Product({
      name,
      price,
      image,
      availableInStocks: availableInStocks ?? true, // fallback to true if undefined
    });
     

    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
