import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "../../lib/session";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

interface CldResource {
  public_id: string;
  secure_url: string;
  context?: { custom?: Record<string, string> };
}

export async function GET() {
  if (!process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json([]);
  }
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "portfolio/",
      context: true,
      max_results: 500,
    });
    const designs = (result.resources as CldResource[])
      .filter((r) => r.context?.custom?.title)
      .map((r) => ({
        id: r.public_id,
        title: r.context!.custom!.title!,
        categoryId: r.context!.custom!.cat_id || null,
        categoryName: r.context!.custom!.cat_name || null,
        image: r.secure_url,
        desc: r.context!.custom!.desc || "",
        year: r.context!.custom!.year || "",
      }));
    return NextResponse.json(designs);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(req: NextRequest) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  try {
    await cloudinary.uploader.destroy(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
  }
}
