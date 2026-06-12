import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "../../../lib/session";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const safe = (s: string) => (s || "").replace(/[|=]/g, " ").trim();

function extractPublicId(url: string): string | null {
  // Extrait "portfolio/filename" de l'URL Cloudinary (sans extension)
  const m = url.match(/portfolio\/[^.?#]+/);
  return m ? m[0] : null;
}

export async function POST(req: NextRequest) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const designs: Array<{
    title?: string;
    desc?: string;
    year?: string;
    categoryId?: string;
    categoryName?: string;
    image?: string;
  }> = await req.json();

  let ok = 0;
  let failed = 0;

  for (const d of designs) {
    if (!d.image?.includes("res.cloudinary.com")) continue;
    const publicId = extractPublicId(d.image);
    if (!publicId) { failed++; continue; }

    try {
      const title    = safe(d.title || "Sans titre");
      const desc     = safe(d.desc || "");
      const year     = safe(d.year || "");
      const cat_id   = safe(d.categoryId || "");
      const cat_name = safe(d.categoryName || "");
      await cloudinary.uploader.explicit(publicId, {
        type: "upload",
        context: `title=${title}|desc=${desc}|year=${year}|cat_id=${cat_id}|cat_name=${cat_name}`,
      });
      ok++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ ok, failed });
}
