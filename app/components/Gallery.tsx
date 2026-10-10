"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLanguage } from "../lib/i18n";
import { Store, useStore, type Design } from "../lib/store";
import { cldUrl, cloudinaryLoader } from "../lib/cloudinary";

/* Image de carte : fondu à l'apparition (évite le "pop" brutal), gère le cas
   où l'image est déjà en cache avant l'hydratation. */
function CardImage({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  const [ready, setReady] = useState(false);
  return (
    <Image
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0) setReady(true);
      }}
      loader={cloudinaryLoader}
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, (max-width: 1100px) 33vw, 25vw"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onLoad={() => setReady(true)}
      className={"gimg" + (ready ? " ready" : "")}
    />
  );
}

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
  const [aspect, setAspect] = useState<"portrait" | "landscape" | "square">("landscape");
  // Sens de la dernière navigation (0 = ouverture) — pilote l'animation de transition
  const [dir, setDir] = useState<-1 | 0 | 1>(0);
  const go = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      onNav(d);
    },
    [onNav]
  );

  useEffect(() => {
    if (index == null) setDir(0);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = index != null ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, go]);

  useEffect(() => {
    setAspect("landscape");
  }, [index]);

  // Précharge l'image suivante et la précédente : la transition animée est instantanée
  useEffect(() => {
    if (index == null || items.length < 2) return;
    for (const off of [1, -1]) {
      const n = items[(index + off + items.length) % items.length];
      if (n?.image) new window.Image().src = cldUrl(n.image, 1400);
    }
  }, [index, items]);

  if (index == null) return null;
  const d = items[index];
  if (!d) return null;

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const r = img.naturalWidth / img.naturalHeight;
    if (r < 0.85) setAspect("portrait");
    else if (r > 1.2) setAspect("landscape");
    else setAspect("square");
  };

  // Portal : rendu directement sur document.body, hors du contexte z-index de <main>
  // Permet au lightbox (z-index 120) de passer au-dessus de la navbar (z-index 50)
  return createPortal(
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
              go(-1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="lb-nav next"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            ›
          </button>
        </>
      )}
      <div
        key={d.id}
        className={`lb-stage lb-stage--${aspect} lb-anim-${dir > 0 ? "next" : dir < 0 ? "prev" : "open"}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="lb-img">
          {d.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cldUrl(d.image, 1400)} alt={d.title} onLoad={handleLoad} decoding="async" />
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
    </div>,
    document.body
  );
}

const PAGE = 8;

export default function Gallery() {
  const { t, lang } = useLanguage();
  const store = useStore();
  const [activeCat, setActiveCat] = useState("all");
  const [showAll, setShowAll] = useState(false);
  // Stocker l'ID du design ouvert (pas l'index) — stable même si filtered change
  const [lbId, setLbId] = useState<string | null>(null);

  const designs = store.getDesigns();

  // Catégories dérivées des designs Cloudinary — visibles sur tous les appareils
  const cats = useMemo(() => {
    const seen = new Map<string, string>();
    for (const d of designs) {
      if (d.categoryId && d.categoryName) seen.set(d.categoryId, d.categoryName);
    }
    return Array.from(seen, ([id, name]) => ({ id, name }));
  }, [designs]);

  const filtered = activeCat === "all" ? designs : designs.filter((d) => d.categoryId === activeCat);

  // Tri chronologique décroissant (plus récent en premier), sans année en dernier
  const sorted = [...filtered].sort((a, b) => {
    if (!a.year && !b.year) return 0;
    if (!a.year) return 1;
    if (!b.year) return -1;
    return Number(b.year) - Number(a.year);
  });

  const sortedRef = useRef(sorted);
  sortedRef.current = sorted;

  // keep activeCat valid if a category is deleted
  useEffect(() => {
    if (activeCat !== "all" && !cats.some((c) => c.id === activeCat)) setActiveCat("all");
  }, [cats, activeCat]);

  // Réinitialiser la pagination quand on change de catégorie
  useEffect(() => {
    setShowAll(false);
  }, [activeCat]);

  const visible = showAll ? sorted : sorted.slice(0, PAGE);
  const hasMore = sorted.length > PAGE;

  // Calculer l'index depuis l'ID — toujours correct même après re-render du store
  const lbIndexRaw = lbId != null ? sorted.findIndex((d) => d.id === lbId) : -1;
  const lbIndex: number | null = lbIndexRaw >= 0 ? lbIndexRaw : null;

  const countFor = (id: string) =>
    id === "all" ? designs.length : designs.filter((d) => d.categoryId === id).length;

  // Stables — ne changent jamais, utilisent sortedRef pour toujours lire le tableau à jour
  const closeLb = useCallback(() => setLbId(null), []);
  const navLb = useCallback((dir: number) => {
    const f = sortedRef.current;
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
            <div className="eyebrow reveal">{t.work.index.replace(/\s*—\s*/, " / ")}</div>
            <h2 className="section-title reveal" style={{ "--d": "80ms" } as CSSProperties}>
              {t.work.title[0]} <span className="accent">{t.work.title[1]}</span>
            </h2>
          </div>
          <div className="section-index reveal" style={{ "--d": "140ms" } as CSSProperties}>
            {t.work.hint}
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
        {!store.isLoaded() ? (
          <div className="gallery-grid" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div className="gcard skeleton" key={i}>
                <div className="gcard-img" />
                <div className="gcard-body">
                  <span className="sk-line" style={{ width: "40%" }} />
                  <span className="sk-line lg" />
                  <span className="sk-line" style={{ width: "80%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="gallery-empty">
            {lang === "fr"
              ? "Aucun design dans cette catégorie pour l'instant."
              : "No design in this category yet."}
          </div>
        ) : (
          <>
            <div className="gallery-grid">
              {visible.map((d, i) => (
                <button
                  type="button"
                  className="gcard reveal"
                  key={d.id}
                  style={{ "--d": (i % 6) * 60 + "ms" } as CSSProperties}
                  onClick={() => setLbId(d.id)}
                >
                  <div className="gcard-img">
                    {d.image ? (
                      <CardImage src={d.image} alt={d.title} priority={i < 4} />
                    ) : (
                      <div className="gcard-noimg">{lang === "fr" ? "Sans image" : "No image"}</div>
                    )}
                    <span className="gcard-chip">{store.categoryName(d.categoryId)}</span>
                  </div>
                  <div className="gcard-body">
                    <div className="gcard-meta">
                      <span>[ {String(i + 1).padStart(2, "0")} ]</span>
                      <span>{d.year}</span>
                    </div>
                    <h3>{d.title}</h3>
                    {d.desc && <p className="gcard-desc">{d.desc}</p>}
                    <div className="gcard-foot">
                      <div>
                        <span className="c1">{store.categoryName(d.categoryId)}</span>
                        <span className="c2">{t.work.viewAll} →</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {!showAll && hasMore && (
              <div className="gallery-more">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAll(true)}>
                  {lang === "fr"
                    ? `Voir plus (${sorted.length - PAGE})`
                    : `View more (${sorted.length - PAGE})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Lightbox items={sorted} index={lbIndex} onClose={closeLb} onNav={navLb} />
    </section>
  );
}
