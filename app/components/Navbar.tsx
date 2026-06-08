"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../lib/i18n";

export default function Navbar({ onJump }: { onJump: (id: string) => void }) {
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  const links: [string, string][] = [
    ["about", t.nav.about],
    ["skills", t.nav.skills],
    ["work", t.nav.work],
    ["services", t.nav.services],
    ["contact", t.nav.contact],
  ];

  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <a
        className="brand"
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onJump("top");
        }}
      >
        <span className="mark">R</span>
        <span>
          RAZAFINDRAVONJY
          <span className="mono" style={{ display: "block" }}>
            Solofonirina Elysé
          </span>
        </span>
      </a>
      <div className="nav-links">
        {links.map(([id, label]) => (
          <a
            key={id}
            href={"#" + id}
            onClick={(e) => {
              e.preventDefault();
              onJump(id);
            }}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="nav-right">
        <div className="lang-toggle">
          <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>
            FR
          </button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            EN
          </button>
        </div>
        <button className="nav-cta" onClick={() => onJump("contact")}>
          {t.nav.cta}
        </button>
      </div>
    </nav>
  );
}
