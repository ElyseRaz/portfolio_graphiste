"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "../lib/i18n";
import portrait from "../../public/image1.webp";

/* Tilt 3D du portrait, suivant le curseur. Purement compositor (transform),
   rect mis en cache (pas de reflow dans le handler), rAF-throttled, et
   désactivé au toucher / prefers-reduced-motion pour rester zéro-coût ailleurs. */
function usePortraitTilt() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    if (!wrap || !frame) return;

    const canTilt =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTilt) return;

    let rect = wrap.getBoundingClientRect();
    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!pending) return;
      const rx = ((pending.y - rect.height / 2) / rect.height) * -14;
      const ry = ((pending.x - rect.width / 2) / rect.width) * 14;
      frame.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    const onMove = (e: MouseEvent) => {
      pending = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => {
      rect = wrap.getBoundingClientRect();
      frame.style.willChange = "transform";
      frame.style.transition = "none";
    };
    const onLeave = () => {
      frame.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      frame.style.transform = "";
      frame.style.willChange = "";
    };
    const onResize = () => {
      rect = wrap.getBoundingClientRect();
    };

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mousemove", onMove, { passive: true });
    wrap.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { wrapRef, frameRef };
}

export default function Hero({ onJump }: { onJump: (id: string) => void }) {
  const { t, lang } = useLanguage();
  const { wrapRef, frameRef } = usePortraitTilt();
  const d = (ms: number) => ({ "--d": ms + "ms" }) as React.CSSProperties;
  const stats = t.about.stats;
  return (
    <header className="hero" id="top">
      <div className="shell">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="pill reveal" style={d(80)}>
              <span className="dot" />
              {t.hero.tags.join(" · ")}
            </div>
            <h1 className="hero-name">
              <span className="l1 reveal" style={d(160)}>{t.hero.name1}</span>
              <span className="l2 reveal" style={d(260)}>{t.hero.name2}.</span>
            </h1>
            <p className="hero-sub reveal" style={d(360)}>{t.hero.sub}</p>
            <div className="hero-actions reveal" style={d(460)}>
              <button type="button" className="btn btn-primary" onClick={() => onJump("work")}>
                {t.hero.primary} <span className="arrow">→</span>
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => onJump("contact")}>
                {t.hero.ghost}
              </button>
            </div>
            <div className="hero-stats reveal" style={d(560)}>
              {stats.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="n">{s.n}</div>
                  <div className="k">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-portrait reveal" ref={wrapRef} style={d(300)}>
            <div className="sheet" />
            <div className="frame" ref={frameRef}>
              <span className="tag">{t.hero.tags[0]}</span>
              <Image
                src={portrait}
                placeholder="blur"
                alt="RAZAFINDRAVONJY Solofonirina Elysé"
                fill
                preload
                sizes="(max-width: 980px) 90vw, 440px"
                style={{ objectFit: "cover", objectPosition: "50% 8%" }}
              />
            </div>
            <div className="badge">
              <div className="n">2+</div>
              <small>{lang === "fr" ? "ans d'expérience" : "years of experience"}</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
