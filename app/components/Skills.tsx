"use client";

import type { CSSProperties } from "react";
import { useLanguage } from "../lib/i18n";
import { TOOLS } from "../lib/content";
import SectionHead from "./SectionHead";
import ToolLogo from "./ToolLogo";

export default function Skills() {
  const { t, lang } = useLanguage();
  return (
    <section className="block" id="skills">
      <div className="shell">
        <SectionHead index={t.skills.index} titleParts={t.skills.title} sub={t.skills.sub} />
        <div className="skill-grid">
          {TOOLS.map((tool, i) => (
            <div className="skill-card reveal" key={tool.name} style={{ "--d": i * 70 + "ms" } as CSSProperties}>
              <span className="skill-logo"><ToolLogo name={tool.name} abbr={tool.abbr} /></span>
              <div className="skill-body">
                <div className="skill-top">
                  <h4>{tool.name}</h4>
                  <span className="skill-lvl">{tool.lvl}%</span>
                </div>
                <p>{lang === "fr" ? tool.roleFr : tool.roleEn}</p>
                <div className="skill-bar"><span style={{ width: tool.lvl + "%" }} /></div>
              </div>
            </div>
          ))}
        </div>
        <div className="chips reveal">
          {t.skills.disciplines.map((d) => (
            <span className="chip" key={d}>{d}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
