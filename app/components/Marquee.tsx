"use client";

import { useLanguage } from "../lib/i18n";

export default function Marquee() {
  const { t } = useLanguage();
  const doubled = [...t.hero.marquee, ...t.hero.marquee];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <span key={i}>{it}</span>
        ))}
      </div>
    </div>
  );
}
