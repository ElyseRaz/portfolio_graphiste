import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "../../lib/session";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

const safe = (s: string) => (s || "").replace(/[|=]/g, " ").trim();

export async function POST(req: NextRequest) {
  const authed = await verifySession();
  if (!authed) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json({ error: "Cloudinary non configuré" }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Format non autorisé (JPEG, PNG, WebP, GIF, AVIF)" }, { status: 400 });

  const title    = safe((form.get("title")    as string | null) || "");
  const desc     = safe((form.get("desc")     as string | null) || "");
  const year     = safe((form.get("year")     as string | null) || "");
  const cat_id   = safe((form.get("cat_id")   as string | null) || "");
  const cat_name = safe((form.get("cat_name") as string | null) || "");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Étape 1 : upload de l'image (sans context pour éviter le problème de signature)
  let uploaded: UploadApiResponse;
  try {
    uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "portfolio",
            resource_type: "image",
            transformation: [{ width: 1500, height: 1500, crop: "limit", quality: "auto:good" }],
          },
          (error, result) => {
            if (error || !result) reject(error || new Error("upload-failed"));
            else resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Échec de l'upload";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // Étape 2 : attacher les métadonnées via Admin API (pas de problème de signature)
  try {
    await cloudinary.uploader.explicit(uploaded.public_id, {
      type: "upload",
      context: `title=${title}|desc=${desc}|year=${year}|cat_id=${cat_id}|cat_name=${cat_name}`,
    });
  } catch {
    // Les métadonnées n'ont pas pu être attachées mais l'image est bien uploadée
    // On retourne quand même un succès — la migration peut corriger ça plus tard
  }

  return NextResponse.json({ url: uploaded.secure_url, public_id: uploaded.public_id });
}
