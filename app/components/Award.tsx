"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useLanguage } from "../lib/i18n";
import certificate from "../../public/certificat.webp";
import SectionHead from "./SectionHead";

export default function Award() {
  const { t } = useLanguage();
  const a = t.award;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const rows: [string, string][] = [
    [a.contest, a.contestV],
    [a.event, a.eventV],
    [a.organizer, a.organizerV],
    [a.date, a.dateV],
    [a.place, a.placeV],
  ];
  return (
    <section className="block alt" id="award">
      <div className="shell">
        <SectionHead index={a.index} titleParts={a.title} sub={a.sub} />
        <div className="award-grid">
          <button type="button" className="award-cert reveal" onClick={() => setOpen(true)} aria-label={a.view}>
            <Image src={certificate} placeholder="blur" alt={a.alt} sizes="(max-width: 980px) 100vw, 55vw" />
            <span className="award-view">{a.view} ↗</span>
          </button>
          <div className="award-info reveal" style={{ "--d": "120ms" } as CSSProperties}>
            <div className="award-rank">
              <b>2<sup>e</sup></b>
              <span>{a.rank}</span>
            </div>
            <dl>
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      {open && (
        <div className="award-modal" role="dialog" aria-modal="true" aria-label={a.alt} onClick={() => setOpen(false)}>
          <button type="button" className="award-close" onClick={() => setOpen(false)} aria-label={a.close}>×</button>
          <Image src={certificate} alt={a.alt} sizes="100vw" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
