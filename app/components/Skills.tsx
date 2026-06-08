"use client";

import type { CSSProperties } from "react";
import { useLanguage } from "../lib/i18n";
import { TOOLS } from "../lib/content";
import SectionHead from "./SectionHead";

export default function Skills() {
  const { t, lang } = useLanguage();
  return (
    <section className="block alt" id="skills">
      <div className="shell">
        <SectionHead eyebrow={t.skills.eyebrow} index={t.skills.index} titleParts={t.skills.title} />
        <div className="tools-grid">
          {TOOLS.map((tool, i) => (
            <div
              className="tool reveal"
              key={tool.name}
              style={
                { "--lvl": 100 - tool.lvl + "%", "--d": i * 70 + "ms" } as CSSProperties
              }
            >
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <div className="ico">{tool.abbr}</div>
              <h4>{tool.name}</h4>
              <div className="role">{lang === "fr" ? tool.roleFr : tool.roleEn}</div>
              <div className="bar">
                <i />
              </div>
            </div>
          ))}
        </div>
        <div className="disciplines">
          <span
            className="chip"
            style={{ borderColor: "transparent", color: "var(--ink-3)", paddingLeft: 0 }}
          >
            {t.skills.disciplinesLabel} →
          </span>
          {t.skills.disciplines.map((d, i) => (
            <span className="chip reveal" key={i} style={{ "--d": i * 40 + "ms" } as CSSProperties}>
              {d}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
