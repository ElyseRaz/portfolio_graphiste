/* Transformations Cloudinary à la volée : bonne taille + format moderne (AVIF/WebP)
   servis directement par le CDN Cloudinary, sans repasser par l'optimiseur Next. */
const MARKER = "/image/upload/";

export function cldUrl(src: string, width: number): string {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes(MARKER)) return src;
  return src.replace(MARKER, `${MARKER}f_auto,q_auto:good,c_limit,w_${width}/`);
}

/* Loader pour next/image : produit le srcset avec les largeurs demandées par Next. */
export function cloudinaryLoader({ src, width }: { src: string; width: number }): string {
  return cldUrl(src, width);
}
