"use client";

import type { CSSProperties } from "react";
import { useLanguage } from "../lib/i18n";

export default function About() {
  const { t } = useLanguage();
  return (
    <section className="block" id="about">
      <div className="shell">
        <div className="about-grid">
          <div className="about-photo reveal">
            <span className="tab">{t.about.tab}</span>
            <div className="img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image2.jpg" alt="Portrait" />
            </div>
          </div>
          <div className="about-text">
            <div className="eyebrow reveal">{t.about.eyebrow}</div>
            <h2
              className="about-lead reveal"
              style={{ "--d": "100ms", marginTop: "22px" } as CSSProperties}
            >
              {t.about.lead[0]} <span className="accent">{t.about.lead[1]}</span>
              {t.about.lead[2]}
            </h2>
            <div className="about-body">
              {t.about.body.map((p, i) => (
                <p key={i} className="reveal" style={{ "--d": 180 + i * 80 + "ms" } as CSSProperties}>
                  {p}
                </p>
              ))}
            </div>
            <div className="about-stats">
              {t.about.stats.map((s, i) => (
                <div
                  className="stat reveal"
                  key={i}
                  style={{ "--d": 260 + i * 90 + "ms" } as CSSProperties}
                >
                  <div className="n">{s.n}</div>
                  <div className="k">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
