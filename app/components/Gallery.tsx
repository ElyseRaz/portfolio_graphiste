"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useLanguage } from "../lib/i18n";
import { Store, useStore, type Design } from "../lib/store";

function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: Design[];
  index: number | null;
  onClose: () => void;
  onNav: (dir: number) => void;
}) {
  const { lang } = useLanguage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = index != null ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onNav]);

  if (index == null) return null;
  const d = items[index];
  if (!d) return null;

  return (
    <div className="lb-back open" onClick={onClose}>
      <button type="button" className="lb-close" onClick={onClose}>
        ✕ {lang === "fr" ? "Fermer" : "Close"}
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            className="lb-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="lb-nav next"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
          >
            ›
          </button>
        </>
      )}
      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        <div className="lb-img">
          {d.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.image} alt={d.title} />
          ) : (
            <div className="lb-noimg">{lang === "fr" ? "Aucune image" : "No image"}</div>
          )}
        </div>
        <div className="lb-meta">
          <div className="lb-cat">
            {Store.categoryName(d.categoryId)}
            {d.year ? " · " + d.year : ""}
          </div>
          <h3>{d.title}</h3>
          {d.desc && <p>{d.desc}</p>}
          <div className="lb-count">
            {index + 1} / {items.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const { t, lang } = useLanguage();
  const store = useStore();
  const [activeCat, setActiveCat] = useState("all");
  // Stocker l'ID du design ouvert (pas l'index) — stable même si filtered change
  const [lbId, setLbId] = useState<string | null>(null);

  const cats = store.getCategories();
  const designs = store.getDesigns();

  const filtered = activeCat === "all" ? designs : designs.filter((d) => d.categoryId === activeCat);
  const filteredRef = useRef(filtered);
  filteredRef.current = filtered;

  // keep activeCat valid if a category is deleted
  useEffect(() => {
    if (activeCat !== "all" && !cats.some((c) => c.id === activeCat)) setActiveCat("all");
  }, [cats, activeCat]);

  // Calculer l'index depuis l'ID — toujours correct même après re-render du store
  const lbIndexRaw = lbId != null ? filtered.findIndex((d) => d.id === lbId) : -1;
  const lbIndex: number | null = lbIndexRaw >= 0 ? lbIndexRaw : null;

  const countFor = (id: string) =>
    id === "all" ? designs.length : designs.filter((d) => d.categoryId === id).length;

  // Stables — ne changent jamais, utilisent filteredRef pour toujours lire le tableau à jour
  const closeLb = useCallback(() => setLbId(null), []);
  const navLb = useCallback((dir: number) => {
    const f = filteredRef.current;
    if (!f.length) return;
    setLbId((prev) => {
      if (!prev) return null;
      const idx = f.findIndex((d) => d.id === prev);
      if (idx < 0) return null;
      return f[(idx + dir + f.length) % f.length].id;
    });
  }, []);

  return (
    <section className="block" id="work">
      <div className="shell">
        <div className="section-head">
          <div>
            <div className="eyebrow reveal">{t.work.eyebrow}</div>
            <h2
              className="section-title reveal"
              style={{ "--d": "100ms", marginTop: "22px" } as CSSProperties}
            >
              {t.work.title[0]} <span className="accent">{t.work.title[1]}</span>
            </h2>
          </div>
          <div className="section-index reveal" style={{ "--d": "160ms" } as CSSProperties}>
            {t.work.index}
          </div>
        </div>

        {/* category filter */}
        <div className="filterbar reveal">
          <button
            type="button"
            className={"filter" + (activeCat === "all" ? " active" : "")}
            onClick={() => setActiveCat("all")}
          >
            {lang === "fr" ? "Tous" : "All"} <span className="fc">{countFor("all")}</span>
          </button>
          {cats.map((c) => (
            <button
              type="button"
              key={c.id}
              className={"filter" + (activeCat === c.id ? " active" : "")}
              onClick={() => setActiveCat(c.id)}
            >
              {c.name} <span className="fc">{countFor(c.id)}</span>
            </button>
          ))}
        </div>

        {/* grid */}
        {filtered.length === 0 ? (
          <div className="gallery-empty">
            {lang === "fr"
              ? "Aucun design dans cette catégorie pour l'instant."
              : "No design in this category yet."}
          </div>
        ) : (
          <div className="gallery-grid">
            {filtered.map((d, i) => (
              <button
                type="button"
                className="gcard reveal"
                key={d.id}
                style={{ "--d": (i % 6) * 60 + "ms" } as CSSProperties}
                onClick={() => setLbId(d.id)}
              >
                <div className="gcard-img">
                  {d.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.image} alt={d.title} loading="lazy" />
                  ) : (
                    <div className="gcard-noimg">{lang === "fr" ? "Sans image" : "No image"}</div>
                  )}
                  <span className="gcard-view">{lang === "fr" ? "Voir" : "View"} ↗</span>
                </div>
                <div className="gcard-body">
                  <h3>{d.title}</h3>
                  <span className="gcard-cat">
                    {store.categoryName(d.categoryId)}
                    {d.year ? " · " + d.year : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox items={filtered} index={lbIndex} onClose={closeLb} onNav={navLb} />
    </section>
  );
}
