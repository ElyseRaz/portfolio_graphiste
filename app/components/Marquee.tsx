"use client";

import { useLanguage } from "../lib/i18n";

export default function Marquee() {
  const { t } = useLanguage();
  const items = [...t.hero.marquee, ...t.skills.disciplines.slice(0, 3)];
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <span key={i}>{it}</span>
        ))}
      </div>
    </div>
  );
}
