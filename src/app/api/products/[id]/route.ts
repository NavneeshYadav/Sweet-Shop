import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// UPDATE Product
export async function PUT(req: Request,  context: { params: { id: string } }) {
  await connectToDatabase();

  const { id } = await context.params;
  const body = await req.json();

  const {
    name,
    price,
    image,
    imagePublicId,
    availableInStocks,
    category,
  } = body;

  try {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 🧹 Delete old image from Cloudinary if changed
    if (image !== existingProduct.image && existingProduct.imagePublicId) {
      await cloudinary.uploader.destroy(existingProduct.imagePublicId);
    }

    // Update product
    existingProduct.name = name;
    existingProduct.price = price;
    existingProduct.image = image;
    existingProduct.imagePublicId = imagePublicId;
    existingProduct.availableInStocks = availableInStocks;
    existingProduct.category = category;

    await existingProduct.save();

    return NextResponse.json(existingProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE Product

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.log(product.imagePublicId);
    // Delete image from Cloudinary
    if (product.imagePublicId) {


      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
