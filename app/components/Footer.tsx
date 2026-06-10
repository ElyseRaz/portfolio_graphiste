"use client";

import Link from "next/link";
import { useLanguage } from "../lib/i18n";

export default function Footer({ onJump }: { onJump: (id: string) => void }) {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="shell">
        <div className="big-name reveal">RAZAFINDRAVONJY SOLOFONIRINA ELYSÉ</div>
        <div className="footer-grid" style={{ marginTop: 30 }}>
          <div className="meta">
            © 2026 RAZAFINDRAVONJY · {t.footer.tagline}
          </div>
          <div className="meta">
            <Link href="/admin" style={{ color: "var(--ink-3)" }}>
              Admin
            </Link>{" "}
            · {t.footer.made}
          </div>
          <button type="button" className="totop" onClick={() => onJump("top")}>
            {t.footer.top} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
