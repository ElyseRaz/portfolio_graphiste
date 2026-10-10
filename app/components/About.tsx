"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useLanguage } from "../lib/i18n";

export default function About() {
  const { t } = useLanguage();
  return (
    <section className="block" id="about">
      <div className="shell">
        <div className="about-grid">
          <div className="about-photo reveal">
            <div className="img-wrap">
              <div className="img">
                <Image
                  src="/image2.png"
                  alt="Portrait — RAZAFINDRAVONJY Solofonirina Elysé"
                  fill
                  sizes="(max-width: 980px) 100vw, 40vw"
                  style={{ objectFit: "cover", objectPosition: "50% 8%" }}
                />
              </div>
            </div>
            <div className="quote">
              <small>{t.about.eyebrow}</small>
              <b>{t.about.tab}</b>
            </div>
          </div>
          <div className="about-text">
            <div className="eyebrow reveal">{t.about.index.replace(/\s*—\s*/, " / ")}</div>
            <h2 className="about-lead reveal" style={{ "--d": "80ms" } as CSSProperties}>
              {t.about.lead[0]} <span className="accent">{t.about.lead[1]}</span>
              {t.about.lead[2]}
            </h2>
            <div className="about-body">
              {t.about.body.map((p, i) => (
                <p key={i} className="reveal" style={{ "--d": 140 + i * 80 + "ms" } as CSSProperties}>
                  {p}
                </p>
              ))}
            </div>
            <div className="chips reveal" style={{ "--d": "300ms" } as CSSProperties}>
              {t.skills.disciplines.map((d, i) => (
                <span className="chip" key={i}>{d}</span>
              ))}
              <span className="chip lime">{t.hero.tags[t.hero.tags.length - 1]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
