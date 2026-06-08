"use client";

import type { CSSProperties } from "react";
import { useLanguage } from "../lib/i18n";
import { SERVICES } from "../lib/content";
import SectionHead from "./SectionHead";

export default function Services() {
  const { t, lang } = useLanguage();
  return (
    <section className="block alt" id="services">
      <div className="shell">
        <SectionHead eyebrow={t.services.eyebrow} index={t.services.index} titleParts={t.services.title} />
        <div className="svc-grid">
          {SERVICES.map((s, i) => {
            const d = lang === "fr" ? s.fr : s.en;
            return (
              <div className="svc reveal" key={i} style={{ "--d": i * 80 + "ms" } as CSSProperties}>
                <span className="sn">{String(i + 1).padStart(2, "0")} / 04</span>
                <h4>{d.t}</h4>
                <p>{d.d}</p>
                <span className="big">{String(i + 1).padStart(2, "0")}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
