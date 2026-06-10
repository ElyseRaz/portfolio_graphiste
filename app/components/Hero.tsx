"use client";

import { Fragment } from "react";
import Image from "next/image";
import { useLanguage } from "../lib/i18n";

export default function Hero({ onJump }: { onJump: (id: string) => void }) {
  const { t } = useLanguage();
  return (
    <header className="hero" id="top">
      <div className="shell">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-meta reveal" style={{ "--d": "80ms" } as React.CSSProperties}>
              {t.hero.tags.map((tag, i) => (
                <Fragment key={i}>
                  {i > 0 && <span className="dot" />}
                  <span className="tag">{tag}</span>
                </Fragment>
              ))}
            </div>
            <h1 className="hero-name">
              <span className="l1 reveal" style={{ "--d": "160ms" } as React.CSSProperties}>
                {t.hero.name1}
              </span>
              <span className="l2 reveal" style={{ "--d": "280ms" } as React.CSSProperties}>
                {t.hero.name2}
              </span>
            </h1>
            <p className="hero-sub reveal" style={{ "--d": "400ms" } as React.CSSProperties}>
              {t.hero.sub}
            </p>
            <div className="hero-actions reveal" style={{ "--d": "500ms" } as React.CSSProperties}>
              <button type="button" className="btn btn-primary" onClick={() => onJump("work")}>
                {t.hero.primary} <span className="arrow">↗</span>
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => onJump("contact")}>
                {t.hero.ghost}
              </button>
            </div>
          </div>
          <div className="hero-portrait reveal" style={{ "--d": "360ms" } as React.CSSProperties}>
            <div className="frame">
              <div className="ring" />
              <span className="vstamp">Portfolio — 2026</span>
              <Image
                src="/image1.png"
                alt="RAZAFINDRAVONJY Solofonirina Elysé"
                fill
                priority
                sizes="(max-width: 980px) 0px, min(42vw, 480px)"
                style={{ objectFit: "cover", objectPosition: "50% 8%" }}
              />
              <div className="badge">
                2<small>YRS</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-foot">
        <div className="scrollcue">
          <span className="line" />
          {t.hero.scroll}
        </div>
        <div className="scrollcue">©2026</div>
      </div>
    </header>
  );
}
