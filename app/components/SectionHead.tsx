import type { CSSProperties } from "react";

export default function SectionHead({
  eyebrow,
  index,
  titleParts,
}: {
  eyebrow: string;
  index: string;
  titleParts: [string, string];
}) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow reveal">{eyebrow}</div>
        <h2
          className="section-title reveal"
          style={{ "--d": "100ms", marginTop: "22px" } as CSSProperties}
        >
          {titleParts[0]} <span className="accent">{titleParts[1]}</span>
        </h2>
      </div>
      <div className="section-index reveal" style={{ "--d": "160ms" } as CSSProperties}>
        {index}
      </div>
    </div>
  );
}
