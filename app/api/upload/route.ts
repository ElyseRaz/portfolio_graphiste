import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "../../lib/session";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const safe = (s: string) => (s || "").replace(/[|=]/g, " ").trim();

export async function POST(req: NextRequest) {
  // 1. Auth
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // 2. Variables d'environnement
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({
      error: "Cloudinary non configuré",
      missing: { cloudName: !cloudName, apiKey: !apiKey, apiSecret: !apiSecret },
    }, { status: 500 });
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  // 3. FormData
  let form: FormData;
  try {
    form = await req.formData();
  } catch (e) {
    return NextResponse.json({ error: "Lecture du formulaire impossible", detail: String(e) }, { status: 400 });
  }

  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Format non autorisé" }, { status: 400 });

  const title    = safe((form.get("title")    as string | null) || "");
  const desc     = safe((form.get("desc")     as string | null) || "");
  const year     = safe((form.get("year")     as string | null) || "");
  const cat_id   = safe((form.get("cat_id")   as string | null) || "");
  const cat_name = safe((form.get("cat_name") as string | null) || "");

  // 4. Buffer
  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch (e) {
    return NextResponse.json({ error: "Lecture du fichier impossible", detail: String(e) }, { status: 500 });
  }

  // 5. Upload Cloudinary (sans context — évite le problème de signature)
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
            if (error || !result) reject(error ?? new Error("upload-failed"));
            else resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[upload] étape 1 échouée:", msg);
    return NextResponse.json({ error: "Échec upload image", detail: msg }, { status: 500 });
  }

  // 6. Attacher les métadonnées via Admin API
  try {
    await cloudinary.uploader.explicit(uploaded.public_id, {
      type: "upload",
      context: `title=${title}|desc=${desc}|year=${year}|cat_id=${cat_id}|cat_name=${cat_name}`,
    });
  } catch (e) {
    // L'image est uploadée — les métadonnées peuvent être ajoutées via migration
    console.error("[upload] étape 2 (context) échouée:", e instanceof Error ? e.message : String(e));
  }

  return NextResponse.json({ url: uploaded.secure_url, public_id: uploaded.public_id });
}
