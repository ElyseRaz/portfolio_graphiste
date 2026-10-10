import type { CSSProperties, ReactNode } from "react";

export default function SectionHead({
  index,
  titleParts,
  sub,
  aside,
}: {
  index: string;
  titleParts: [string, string];
  sub?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow reveal">{index.replace(/\s*—\s*/, " / ")}</div>
        <h2 className="section-title reveal" style={{ "--d": "80ms" } as CSSProperties}>
          {titleParts[0]} <span className="accent">{titleParts[1]}</span>
        </h2>
        {sub && <p className="section-sub reveal" style={{ "--d": "140ms" } as CSSProperties}>{sub}</p>}
      </div>
      {aside}
    </div>
  );
}
