"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/i18n";
import { Store, useStore } from "../lib/store";
import { cldUrl } from "../lib/cloudinary";

function Login({ onOk }: { onOk: () => void }) {
  const { lang } = useLanguage();
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        onOk();
      } else {
        setErr(true);
        setCode("");
      }
    } catch {
      setErr(true);
      setCode("");
    }
    setBusy(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="brand">Elysé</div>
        <div className="eyebrow">{lang === "fr" ? "Accès restreint" : "Restricted"}</div>
        <h2>{lang === "fr" ? "Espace Admin" : "Admin Area"}</h2>
        <p>
          {lang === "fr"
            ? "Entrez le code d'accès pour gérer vos designs."
            : "Enter the access code to manage your designs."}
        </p>
        <form onSubmit={submit} className={"field" + (err ? " err" : "")}>
          <input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErr(false);
            }}
            placeholder={lang === "fr" ? "Code d'accès" : "Access code"}
          />
          <div className="msg">{err ? (lang === "fr" ? "Code incorrect" : "Wrong code") : ""}</div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy}
          >
            {busy
              ? lang === "fr" ? "Connexion…" : "Signing in…"
              : (lang === "fr" ? "Se connecter" : "Sign in") + " →"}
          </button>
        </form>
        <Link className="admin-back" href="/">
          ← {lang === "fr" ? "Retour au site" : "Back to site"}
        </Link>
      </div>
    </div>
  );
}

/* ---------- Infrastructure : toasts + session expirée ---------- */
type ToastKind = "ok" | "err";
interface AdminCtxValue {
  toast: (msg: string, kind?: ToastKind) => void;
  expire: () => void;
}
const AdminCtx = createContext<AdminCtxValue>({ toast: () => {}, expire: () => {} });
const useAdmin = () => useContext(AdminCtx);

function Toasts({ items }: { items: { id: number; msg: string; kind: ToastKind }[] }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={"toast " + t.kind}>
          <span className="toast-ico">{t.kind === "ok" ? "✓" : "!"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* Confirmation en deux temps, sur place (remplace window.confirm) */
function ConfirmDel({
  onConfirm,
  label,
  hint,
}: {
  onConfirm: () => void | Promise<void>;
  label: string;
  hint?: string;
}) {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ask) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAsk(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ask]);

  if (!ask) {
    return (
      <button type="button" className="del" title={fr ? "Supprimer" : "Delete"} aria-label={label} onClick={() => setAsk(true)}>
        ✕
      </button>
    );
  }
  return (
    <span className="confirm" role="group" aria-label={label}>
      {hint && <span className="confirm-hint">{hint}</span>}
      <button
        type="button"
        className="confirm-yes"
        autoFocus
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try { await onConfirm(); } finally { setBusy(false); setAsk(false); }
        }}
      >
        {busy ? "…" : fr ? "Supprimer" : "Delete"}
      </button>
      <button type="button" className="confirm-no" onClick={() => setAsk(false)} disabled={busy}>
        {fr ? "Annuler" : "Cancel"}
      </button>
    </span>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <div className="fld-err" id={id} role="alert">
      {msg || ""}
    </div>
  );
}

function CategoryPanel() {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const store = useStore();
  const { toast } = useAdmin();
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const cats = store.getCategories();
  const count = (id: string) => store.getDesigns().filter((d) => d.categoryId === id).length;

  const validate = (v: string) => {
    const n = v.trim();
    if (!n) return fr ? "Saisissez un nom de catégorie." : "Enter a category name.";
    if (n.length > 40) return fr ? "40 caractères maximum." : "40 characters max.";
    if (cats.some((c) => c.name.toLowerCase() === n.toLowerCase()))
      return fr ? "Cette catégorie existe déjà." : "This category already exists.";
    return "";
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const m = validate(name);
    if (m) return setErr(m);
    store.addCategory(name);
    toast(fr ? `Catégorie « ${name.trim()} » ajoutée` : `Category "${name.trim()}" added`);
    setName("");
    setErr("");
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>{fr ? "Catégories" : "Categories"}</h3>
        <span className="ap-count">{cats.length}</span>
      </div>
      <form className="admin-inline" onSubmit={add} noValidate>
        <div className="grow">
          <input
            value={name}
            maxLength={40}
            aria-invalid={err ? "true" : undefined}
            aria-describedby="cat-err"
            aria-label={fr ? "Nom de la nouvelle catégorie" : "New category name"}
            onChange={(e) => { setName(e.target.value); if (err) setErr(""); }}
            placeholder={fr ? "Nouvelle catégorie…" : "New category…"}
          />
          <FieldError id="cat-err" msg={err} />
        </div>
        <button type="submit" className="btn-mini">
          + {fr ? "Ajouter" : "Add"}
        </button>
      </form>
      <ul className="cat-list">
        {cats.length === 0 && <li className="empty-row">{fr ? "Aucune catégorie — créez-en une pour classer vos designs." : "No categories — create one to organise your designs."}</li>}
        {cats.map((c) => {
          const n = count(c.id);
          return (
            <li key={c.id}>
              <span className="cat-name">{c.name}</span>
              <span className="cat-badge">
                {n} {fr ? "design(s)" : "item(s)"}
              </span>
              <ConfirmDel
                label={fr ? `Supprimer la catégorie ${c.name}` : `Delete category ${c.name}`}
                hint={n > 0 ? (fr ? "Les designs liés resteront sans catégorie" : "Linked designs become uncategorised") : undefined}
                onConfirm={() => {
                  store.deleteCategory(c.id);
                  toast(fr ? `Catégorie « ${c.name} » supprimée` : `Category "${c.name}" deleted`);
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function compressImage(file: File, maxDim = 1500, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (Math.max(width, height) > maxDim) {
          const s = maxDim / Math.max(width, height);
          width = Math.round(width * s);
          height = Math.round(height * s);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("compress-failed"))),
          mime,
          quality
        );
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_FILE = 10 * 1024 * 1024; // aligné sur la limite serveur (10 Mo)
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
type FormErrors = { title?: string; category?: string; year?: string; image?: string };

function DesignPanel() {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const store = useStore();
  const { toast, expire } = useAdmin();
  const cats = store.getCategories();
  const designs = store.getDesigns();
  const [form, setForm] = useState({ title: "", categoryId: "", year: "", desc: "" });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState<FormErrors>({});
  const [serverErr, setServerErr] = useState("");
  const [drag, setDrag] = useState(false);
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const categoryId = form.categoryId || cats[0]?.id || "";
  const thisYear = new Date().getFullYear();

  const checkTitle = (v: string) => (v.trim() ? "" : fr ? "Le titre est requis." : "Title is required.");
  const checkYear = (v: string) => {
    if (!v) return "";
    const y = Number(v);
    return /^\d{4}$/.test(v) && y >= 1990 && y <= thisYear + 1
      ? ""
      : fr ? `Année entre 1990 et ${thisYear + 1}.` : `Year between 1990 and ${thisYear + 1}.`;
  };
  const checkFile = (f: File | null) => {
    if (!f) return fr ? "Choisissez une image." : "Choose an image.";
    if (!OK_TYPES.includes(f.type)) return fr ? "Format non pris en charge (JPEG, PNG, WebP, GIF, AVIF)." : "Unsupported format (JPEG, PNG, WebP, GIF, AVIF).";
    if (f.size > MAX_FILE) return fr ? "Image trop lourde (10 Mo maximum)." : "Image too large (10 MB max).";
    return "";
  };

  const pick = (f: File | undefined | null) => {
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const m = checkFile(f);
    setServerErr("");
    if (m) {
      setFile(null);
      setPreviewUrl("");
      setErrs((e) => ({ ...e, image: m }));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setErrs((e) => ({ ...e, image: "" }));
    // Pré-remplit le titre depuis le nom du fichier si vide
    setForm((v) => (v.title ? v : { ...v, title: f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").slice(0, 80) }));
  };

  const setField = (k: "title" | "year" | "desc" | "categoryId") => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setServerErr("");
    if (k === "title" && errs.title) setErrs((e) => ({ ...e, title: checkTitle(v) }));
    if (k === "year" && errs.year) setErrs((e) => ({ ...e, year: checkYear(v) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: FormErrors = {
      title: checkTitle(form.title),
      year: checkYear(form.year),
      image: checkFile(file),
      category: cats.length === 0 ? (fr ? "Créez d'abord une catégorie." : "Create a category first.") : "",
    };
    setErrs(next);
    if (Object.values(next).some(Boolean)) {
      // Amène directement le focus sur le premier champ en erreur
      requestAnimationFrame(() => {
        const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        el?.focus();
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }
    setBusy(true);
    setServerErr("");
    try {
      const blob = await compressImage(file!);
      const catName = cats.find((c) => c.id === categoryId)?.name || "";
      const fd = new FormData();
      fd.append("file", blob, file!.name);
      fd.append("title", form.title.trim());
      fd.append("desc", form.desc.trim());
      fd.append("year", form.year.trim());
      fd.append("cat_id", categoryId);
      fd.append("cat_name", catName);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.status === 401) {
        toast(fr ? "Session expirée — reconnectez-vous." : "Session expired — please sign in again.", "err");
        expire();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "upload");
      }
      await Store.refreshDesigns(true);
      toast(fr ? `« ${form.title.trim()} » ajouté au portfolio` : `"${form.title.trim()}" added to the portfolio`);
      // On garde catégorie et année : pratique pour enchaîner plusieurs ajouts
      setForm((f) => ({ ...f, title: "", desc: "" }));
      setFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setErrs({});
      if (fileRef.current) fileRef.current.value = "";
    } catch (ex) {
      const m = ex instanceof Error && ex.message !== "upload" ? ex.message : "";
      setServerErr(
        m || (fr ? "Échec de l'envoi. Vérifiez votre connexion et réessayez." : "Upload failed. Check your connection and try again.")
      );
    } finally {
      setBusy(false);
    }
  };

  const q = query.trim().toLowerCase();
  const shown = q
    ? designs.filter((d) => (d.title + " " + store.categoryName(d.categoryId) + " " + d.year).toLowerCase().includes(q))
    : designs;

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Designs</h3>
        <span className="ap-count">{designs.length}</span>
      </div>

      <form className="design-form" ref={formRef} onSubmit={submit} noValidate>
        <div className="df-row">
          <label>
            <span>{fr ? "Titre" : "Title"} <b className="req" aria-hidden="true">*</b></span>
            <input
              value={form.title}
              maxLength={80}
              aria-invalid={errs.title ? "true" : undefined}
              aria-describedby="df-title-err"
              onChange={(e) => setField("title")(e.target.value)}
              onBlur={() => form.title && setErrs((x) => ({ ...x, title: checkTitle(form.title) }))}
              placeholder={fr ? "Nom du design" : "Design name"}
            />
            <FieldError id="df-title-err" msg={errs.title} />
          </label>
          <label>
            <span>{fr ? "Catégorie" : "Category"} <b className="req" aria-hidden="true">*</b></span>
            <select
              value={categoryId}
              disabled={cats.length === 0}
              aria-invalid={errs.category ? "true" : undefined}
              aria-describedby="df-cat-err"
              onChange={(e) => setField("categoryId")(e.target.value)}
            >
              {cats.length === 0 && <option value="">{fr ? "— aucune —" : "— none —"}</option>}
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <FieldError id="df-cat-err" msg={errs.category} />
          </label>
          <label className="df-year">
            <span>{fr ? "Année" : "Year"}</span>
            <input
              value={form.year}
              inputMode="numeric"
              maxLength={4}
              aria-invalid={errs.year ? "true" : undefined}
              aria-describedby="df-year-err"
              onChange={(e) => setField("year")(e.target.value.replace(/\D/g, ""))}
              onBlur={() => setErrs((x) => ({ ...x, year: checkYear(form.year) }))}
              placeholder={String(thisYear)}
            />
            <FieldError id="df-year-err" msg={errs.year} />
          </label>
        </div>
        <label>
          <span>{fr ? "Description (optionnel)" : "Description (optional)"}</span>
          <textarea
            value={form.desc}
            maxLength={400}
            onChange={(e) => setField("desc")(e.target.value)}
            rows={2}
            placeholder={fr ? "Quelques mots sur le projet…" : "A few words about the project…"}
          />
          <small className="df-count">{form.desc.length}/400</small>
        </label>

        <div className="df-upload">
          <div className="upload-col">
            <label
              className={"upload-zone" + (drag ? " drag" : "") + (errs.image ? " invalid" : "")}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
            >
              <input
                ref={fileRef}
                type="file"
                accept={OK_TYPES.join(",")}
                aria-invalid={errs.image ? "true" : undefined}
                aria-describedby="df-img-err"
                onChange={(e) => pick(e.target.files?.[0])}
                className="sr-file"
              />
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt={fr ? "Aperçu" : "Preview"} />
              ) : (
                <span>
                  {fr ? "Glissez une image ici ou cliquez pour choisir" : "Drop an image here or click to choose"}
                  <small>JPEG · PNG · WebP — {fr ? "10 Mo max" : "10 MB max"}</small>
                </span>
              )}
            </label>
            <FieldError id="df-img-err" msg={errs.image} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? (fr ? "Envoi en cours…" : "Uploading…") : fr ? "Ajouter le design" : "Add design"}
          </button>
        </div>
        {serverErr && <div className="df-err" role="alert">{serverErr}</div>}
      </form>

      {designs.length > 6 && (
        <input
          type="search"
          className="design-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={fr ? "Rechercher un design…" : "Search designs…"}
          aria-label={fr ? "Rechercher un design" : "Search designs"}
        />
      )}
      <div className="design-list">
        {designs.length === 0 && (
          <div className="empty-row">{fr ? "Aucun design. Ajoutez-en un ci-dessus." : "No designs yet. Add one above."}</div>
        )}
        {designs.length > 0 && shown.length === 0 && (
          <div className="empty-row">{fr ? "Aucun résultat." : "No results."}</div>
        )}
        {shown.map((d) => (
          <div className="dl-item" key={d.id}>
            <div className="dl-thumb">
              {d.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cldUrl(d.image, 160)} alt="" loading="lazy" />
              ) : (
                <span>—</span>
              )}
            </div>
            <div className="dl-info">
              <strong>{d.title}</strong>
              <span>
                {store.categoryName(d.categoryId)}
                {d.year ? " · " + d.year : ""}
              </span>
            </div>
            <ConfirmDel
              label={fr ? `Supprimer ${d.title}` : `Delete ${d.title}`}
              onConfirm={async () => {
                const res = await fetch(`/api/designs?id=${encodeURIComponent(d.id)}`, { method: "DELETE" });
                if (res.status === 401) {
                  toast(fr ? "Session expirée — reconnectez-vous." : "Session expired — please sign in again.", "err");
                  expire();
                  return;
                }
                if (!res.ok) {
                  toast(fr ? "Suppression impossible, réessayez." : "Could not delete, try again.", "err");
                  return;
                }
                await Store.refreshDesigns(true);
                toast(fr ? `« ${d.title} » supprimé` : `"${d.title}" deleted`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MigratePanel() {
  const { lang } = useLanguage();
  const [designs, setDesigns] = useState<unknown[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState({ ok: 0, failed: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("port_gallery_v1");
      const parsed = JSON.parse(raw || "{}");
      const cats: Array<{ id: string; name: string }> = parsed.categories || [];
      const list: Array<Record<string, string>> = (parsed.designs || []).filter(
        (d: Record<string, string>) => d.image?.includes("res.cloudinary.com")
      );
      // Enrichir avec le nom de catégorie stocké localement
      const enriched = list.map((d) => ({
        ...d,
        categoryName: cats.find((c) => c.id === d.categoryId)?.name || "",
      }));
      setDesigns(enriched);
    } catch { /* ignore */ }
  }, []);

  if (designs.length === 0) return null;

  const run = async () => {
    setStatus("running");
    try {
      const res = await fetch("/api/designs/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designs),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      await Store.refreshDesigns(true);
      // Nettoyer les designs de localStorage — migration terminée
      const raw = localStorage.getItem("port_gallery_v1");
      const parsed = JSON.parse(raw || "{}");
      localStorage.setItem("port_gallery_v1", JSON.stringify({ categories: parsed.categories || [] }));
      setDesigns([]);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="admin-panel migrate-panel">
      <div className="admin-panel-head">
        <h3>{lang === "fr" ? "Migration Cloudinary" : "Cloudinary Migration"}</h3>
        <span className="ap-count">{designs.length}</span>
      </div>
      <p className="migrate-desc">
        {lang === "fr"
          ? `${designs.length} design(s) trouvé(s) dans votre navigateur. Cliquez pour attacher leurs métadonnées sur Cloudinary — les images ne seront pas re-uploadées.`
          : `${designs.length} design(s) found in your browser. Click to attach their metadata on Cloudinary — images will not be re-uploaded.`}
      </p>
      {status === "idle" && (
        <button type="button" className="btn btn-primary" onClick={run}>
          {lang === "fr" ? `Migrer ${designs.length} designs →` : `Migrate ${designs.length} designs →`}
        </button>
      )}
      {status === "running" && (
        <p className="migrate-running">
          {lang === "fr" ? "Migration en cours…" : "Migrating…"}
        </p>
      )}
      {status === "done" && (
        <p className="migrate-done">
          ✓ {result.ok} {lang === "fr" ? "migré(s)" : "migrated"}
          {result.failed > 0 ? ` · ${result.failed} ${lang === "fr" ? "échoué(s)" : "failed"}` : ""}
        </p>
      )}
      {status === "error" && (
        <p className="df-err">{lang === "fr" ? "Erreur — réessayez." : "Error — try again."}</p>
      )}
    </div>
  );
}

function AdminStats() {
  const { lang } = useLanguage();
  const store = useStore();
  const designs = store.getDesigns();
  const years = new Set(designs.map((d) => d.year).filter(Boolean));
  const items: [number, string][] = [
    [designs.length, "Designs"],
    [store.getCategories().length, lang === "fr" ? "Catégories" : "Categories"],
    [years.size, lang === "fr" ? "Années couvertes" : "Years covered"],
  ];
  return (
    <div className="admin-stats">
      {items.map(([n, k]) => (
        <div className="admin-stat" key={k}>
          <div className="n">{n}</div>
          <div className="k">{k}</div>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const { lang, setLang } = useLanguage();
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; kind: ToastKind }[]>([]);

  const toast = useCallback((msg: string, kind: ToastKind = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "err" ? 6000 : 3500);
  }, []);
  const expire = useCallback(() => setAuthed(false), []);

  // Vérifie la session côté serveur (cookie httpOnly) après le montage
  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false))
      .finally(() => setReady(true));
  }, []);

  if (!ready) return <div className="admin-login" />;
  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  return (
    <AdminCtx.Provider value={{ toast, expire }}>
    <div className="admin">
      <Toasts items={toasts} />
      <header className="admin-bar">
        <div className="brand-wrap">
          <Link className="brand" href="/">
            Elysé
          </Link>
          <span className="admin-tag">{lang === "fr" ? "Espace admin" : "Admin area"}</span>
        </div>
        <div className="admin-bar-right">
          <div className="lang-toggle">
            <button
              type="button"
              className={lang === "fr" ? "active" : ""}
              onClick={() => setLang("fr")}
            >
              FR
            </button>
            <button
              type="button"
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
          <Link className="nav-cta" href="/">
            {lang === "fr" ? "Voir le site ↗" : "View site ↗"}
          </Link>
          <button
            type="button"
            className="nav-cta outline"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              setAuthed(false);
            }}
          >
            {lang === "fr" ? "Déconnexion" : "Logout"}
          </button>
        </div>
      </header>

      <div className="admin-body shell">
        <div className="admin-intro">
          <div className="eyebrow">{lang === "fr" ? "Tableau de bord" : "Dashboard"}</div>
          <h1>
            {lang === "fr" ? "Gérez vos" : "Manage your"} <span className="accent">designs</span>
          </h1>
          <p>
            {lang === "fr"
              ? "Créez des catégories, ajoutez vos réalisations avec une image, et tout apparaît instantanément sur votre portfolio."
              : "Create categories, add your work with an image, and everything appears instantly on your portfolio."}
          </p>
        </div>
        <AdminStats />
        <MigratePanel />
        <div className="admin-grid">
          <CategoryPanel />
          <DesignPanel />
        </div>
      </div>
    </div>
    </AdminCtx.Provider>
  );
}
