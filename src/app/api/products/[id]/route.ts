import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const updatedProduct = await Product.findByIdAndUpdate(params.id, await req.json(), { new: true });
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Product deleted" }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
