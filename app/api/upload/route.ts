import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json({ error: "Cloudinary non configuré" }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<NextResponse>((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio",
          resource_type: "image",
          transformation: [{ width: 1500, height: 1500, crop: "limit", quality: "auto:good" }],
        },
        (error, result) => {
          if (error || !result) {
            resolve(NextResponse.json({ error: "Échec de l'upload" }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ url: result.secure_url }));
          }
        }
      )
      .end(buffer);
  });
}
