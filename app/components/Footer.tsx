"use client";

import Link from "next/link";
import { useLanguage } from "../lib/i18n";
import { SOCIALS } from "../lib/content";

export default function Footer({ onJump }: { onJump: (id: string) => void }) {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <div className="brand">Elysé</div>
            <p className="footer-tag">{t.footer.tagline}</p>
          </div>
          <div className="footer-soc">
            <div className="label">{t.contact.socialsLabel}</div>
            <nav>
              {SOCIALS.map((s, i) => (
                <span key={s.label} style={{ display: "contents" }}>
                  {i > 0 && <i>/</i>}
                  <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>
                </span>
              ))}
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="meta">© 2026 RAZAFINDRAVONJY · {t.footer.rights}</span>
          <span className="meta soft">
            <Link href="/admin">Admin</Link> · {t.footer.made}
          </span>
          <button type="button" className="totop" onClick={() => onJump("top")}>
            {t.footer.top} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
