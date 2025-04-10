import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

// UPDATE Product
export async function PUT(req: Request, context: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const { id } = await context.params;
    const data = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

// DELETE Product
export async function DELETE(req: Request, context: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const { id } =await context.params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
