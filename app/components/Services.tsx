"use client";

import type { CSSProperties, ReactNode } from "react";
import { useLanguage } from "../lib/i18n";
import { SERVICES } from "../lib/content";
import SectionHead from "./SectionHead";

const svg = (children: ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const ICONS: ReactNode[] = [
  svg(<><path d="M4 4h12l4 4v12H4z" /><path d="M8 14h8M8 18h5M8 9h4" /></>),
  svg(<><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" /></>),
  svg(<><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" /></>),
  svg(<><rect x="3" y="6" width="18" height="13" rx="1" /><path d="M3 10h18M7 6l2 4M12 6l2 4M17 6l2 4" /></>),
];

export default function Services() {
  const { t, lang } = useLanguage();
  return (
    <section className="block alt" id="services">
      <div className="shell">
        <SectionHead
          index={t.services.index}
          titleParts={t.services.title}
          
        />
        <div className="svc-grid">
          {SERVICES.map((s, i) => {
            const d = lang === "fr" ? s.fr : s.en;
            return (
              <div className="svc reveal" key={i} style={{ "--d": i * 80 + "ms" } as CSSProperties}>
                <div className="svc-top">
                  <span className="ico">{ICONS[i % ICONS.length]}</span>
                  <span className="sn">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h4>{d.t}</h4>
                <p>{d.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
