import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "product_images" }, (error, result) => {
        if (error || !result) reject(error);
        else {
          console.log(result.public_id);
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      }).end(buffer);
    });


    return NextResponse.json({
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
