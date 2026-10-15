/* Official brand logos for the skills section (files in /public/logos). */

const LOGO_FILES: Record<string, string> = {
  Photoshop: "/logos/photoshop.svg",
  Illustrator: "/logos/illustrator.svg",
  Figma: "/logos/figma.svg",
  Canva: "/logos/canva.png",
  CapCut: "/logos/capcut.png",
  Filmora: "/logos/filmora.png",
};

export default function ToolLogo({ name, abbr }: { name: string; abbr: string }) {
  const src = LOGO_FILES[name];
  if (!src) return <span>{abbr}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={22} height={22} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain" }} />;
}
