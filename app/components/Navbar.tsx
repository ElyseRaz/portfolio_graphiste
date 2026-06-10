"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../lib/i18n";
import { useTheme } from "../lib/theme";

export default function Navbar({ onJump }: { onJump: (id: string) => void }) {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Fermer le menu avec Échap
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Bloquer le scroll du body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links: [string, string][] = [
    ["about",    t.nav.about],
    ["skills",   t.nav.skills],
    ["work",     t.nav.work],
    ["services", t.nav.services],
    ["contact",  t.nav.contact],
  ];

  const jumpTo = (id: string) => { setMenuOpen(false); onJump(id); };

  return (
    <>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); jumpTo("top"); }}>
          <span className="mark">R</span>
          <span>
            RAZAFINDRAVONJY
            <span className="mono brand-sub">Solofonirina Elysé</span>
          </span>
        </a>

        <div className="nav-links">
          {links.map(([id, label]) => (
            <a key={id} href={"#" + id} onClick={(e) => { e.preventDefault(); jumpTo(id); }}>
              {label}
            </a>
          ))}
        </div>

        <div className="nav-right">
          <button className="theme-toggle" onClick={toggle} aria-label="Changer le thème">
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <div className="lang-toggle">
            <button type="button" className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
            <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <button type="button" className="nav-cta" onClick={() => jumpTo("contact")}>{t.nav.cta}</button>
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
      </nav>

      {/* Menu mobile — rendu comme frère de <nav> pour éviter le stacking context */}
      <div className={"mobile-menu" + (menuOpen ? " open" : "")} aria-hidden={menuOpen ? "false" : "true"}>
        <nav className="mobile-menu-links">
          {links.map(([id, label]) => (
            <a key={id} href={"#" + id} onClick={(e) => { e.preventDefault(); jumpTo(id); }}>
              {label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-foot">
          <button type="button" className="btn btn-primary" onClick={() => jumpTo("contact")}>
            {t.nav.cta}
          </button>
        </div>
      </div>
    </>
  );
}
