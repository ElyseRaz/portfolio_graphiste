"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/i18n";

export default function Navbar({ onJump }: { onJump: (id: string) => void }) {
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Lien actif selon la section visible
  useEffect(() => {
    const ids = ["top", "work", "services", "about", "contact"];
    const f = () => {
      let cur = "top";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) cur = id;
      }
      setActive(cur);
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links: [string, string][] = [
    ["top", lang === "fr" ? "Accueil" : "Home"],
    ["work", t.nav.work],
    ["services", t.nav.services],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
  ];

  const jumpTo = (id: string) => { setMenuOpen(false); onJump(id); };

  const langToggle = (
    <div className="lang-toggle">
      <button type="button" className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
      <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
    </div>
  );

  return (
    <>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className="shell nav-inner">
          <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); jumpTo("top"); }} aria-label="Elysé — accueil">
            Elysé
          </a>

          <div className="nav-links">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={"#" + id}
                className={active === id ? "active" : ""}
                onClick={(e) => { e.preventDefault(); jumpTo(id); }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="nav-right">
            {langToggle}
            <button type="button" className="nav-cta" onClick={() => jumpTo("contact")}>{t.nav.cta} →</button>
            <Link className="nav-user" href="/admin" aria-label="Espace admin">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </Link>
            <button
              type="button"
              className={"hamburger" + (menuOpen ? " open" : "")}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen ? "true" : "false"}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={"mobile-menu" + (menuOpen ? " open" : "")} aria-hidden={menuOpen ? "false" : "true"}>
        <nav className="mobile-menu-links">
          {links.map(([id, label]) => (
            <a key={id} href={"#" + id} onClick={(e) => { e.preventDefault(); jumpTo(id); }}>
              {label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-foot">
          {langToggle}
          <button type="button" className="btn btn-primary" onClick={() => jumpTo("contact")}>
            {t.nav.cta} <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </>
  );
}
