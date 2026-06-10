"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/i18n";
import { Store, useStore } from "../lib/store";

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
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          {lang === "fr" ? "Accès restreint" : "Restricted"}
        </div>
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
            style={{ width: "100%", justifyContent: "center" }}
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

function CategoryPanel() {
  const { lang } = useLanguage();
  const store = useStore();
  const [name, setName] = useState("");
  const cats = store.getCategories();

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      store.addCategory(name);
      setName("");
    }
  };
  const count = (id: string) => store.getDesigns().filter((d) => d.categoryId === id).length;

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>{lang === "fr" ? "Catégories" : "Categories"}</h3>
        <span className="ap-count">{cats.length}</span>
      </div>
      <form className="admin-inline" onSubmit={add}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={lang === "fr" ? "Nouvelle catégorie…" : "New category…"}
        />
        <button type="submit" className="btn-mini">
          + {lang === "fr" ? "Ajouter" : "Add"}
        </button>
      </form>
      <ul className="cat-list">
        {cats.length === 0 && (
          <li className="empty-row">{lang === "fr" ? "Aucune catégorie" : "No categories"}</li>
        )}
        {cats.map((c) => (
          <li key={c.id}>
            <span className="cat-name">{c.name}</span>
            <span className="cat-badge">
              {count(c.id)} {lang === "fr" ? "design(s)" : "item(s)"}
            </span>
            <button
              type="button"
              className="del"
              title={lang === "fr" ? "Supprimer" : "Delete"}
              onClick={() => {
                if (
                  confirm(
                    lang === "fr"
                      ? `Supprimer la catégorie « ${c.name} » ? Les designs liés deviendront sans catégorie.`
                      : `Delete category "${c.name}"? Linked designs become uncategorised.`
                  )
                )
                  store.deleteCategory(c.id);
              }}
            >
              ✕
            </button>
          </li>
        ))}
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

function DesignPanel() {
  const { lang } = useLanguage();
  const store = useStore();
  const cats = store.getCategories();
  const designs = store.getDesigns();
  const [form, setForm] = useState({ title: "", categoryId: "", year: "", desc: "" });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setErr("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErr(lang === "fr" ? "Titre requis" : "Title required");
      return;
    }
    if (!file) {
      setErr(lang === "fr" ? "Image requise" : "Image required");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const blob = await compressImage(file);
      const catId = form.categoryId || cats[0]?.id || "";
      const catName = cats.find((c) => c.id === catId)?.name || "";
      const fd = new FormData();
      fd.append("file", blob, file.name);
      fd.append("title", form.title.trim());
      fd.append("desc", form.desc.trim());
      fd.append("year", form.year.trim());
      fd.append("cat_id", catId);
      fd.append("cat_name", catName);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("upload");
      await Store.refreshDesigns();
      setForm({ title: "", categoryId: "", year: "", desc: "" });
      setFile(null);
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setErr(
        lang === "fr"
          ? "Erreur d'upload. Vérifiez votre connexion et le format du fichier."
          : "Upload error. Check your connection and file format."
      );
    }
    setBusy(false);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Designs</h3>
        <span className="ap-count">{designs.length}</span>
      </div>

      <form className="design-form" onSubmit={submit}>
        <div className="df-row">
          <label>
            <span>{lang === "fr" ? "Titre" : "Title"}</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={lang === "fr" ? "Nom du design" : "Design name"}
            />
          </label>
          <label>
            <span>{lang === "fr" ? "Catégorie" : "Category"}</span>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {cats.length === 0 && (
                <option value="">{lang === "fr" ? "— aucune —" : "— none —"}</option>
              )}
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="df-year">
            <span>{lang === "fr" ? "Année" : "Year"}</span>
            <input
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="2025"
            />
          </label>
        </div>
        <label>
          <span>{lang === "fr" ? "Description (optionnel)" : "Description (optional)"}</span>
          <textarea
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            rows={2}
            placeholder={
              lang === "fr" ? "Quelques mots sur le projet…" : "A few words about the project…"
            }
          />
        </label>

        <div className="df-upload">
          <label className="upload-zone">
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} hidden />
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="preview" />
            ) : (
              <span>
                {lang === "fr" ? "📁 Choisir une image" : "📁 Choose an image"}
              </span>
            )}
          </label>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy
              ? lang === "fr" ? "Upload en cours…" : "Uploading…"
              : lang === "fr" ? "Ajouter le design +" : "Add design +"}
          </button>
        </div>
        {err && <div className="df-err">{err}</div>}
      </form>

      <div className="design-list">
        {designs.length === 0 && (
          <div className="empty-row">
            {lang === "fr" ? "Aucun design. Ajoutez-en un ci-dessus." : "No designs yet. Add one above."}
          </div>
        )}
        {designs.map((d) => (
          <div className="dl-item" key={d.id}>
            <div className="dl-thumb">
              {d.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.image} alt="" />
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
            <button
              type="button"
              className="del"
              onClick={async () => {
                if (
                  confirm(
                    lang === "fr"
                      ? `Supprimer « ${d.title} » ?`
                      : `Delete "${d.title}"?`
                  )
                )
                  await store.deleteDesign(d.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const { lang, setLang } = useLanguage();
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

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
    <div className="admin">
      <header className="admin-bar">
        <Link className="brand" href="/">
          <span className="mark">R</span>
          <span>
            {lang === "fr" ? "ESPACE ADMIN" : "ADMIN AREA"}
            <span className="mono admin-brand-sub">
              RAZAFINDRAVONJY · Portfolio
            </span>
          </span>
        </Link>
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
            className="nav-cta"
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
          <h1>{lang === "fr" ? "Gérez vos designs" : "Manage your designs"}</h1>
          <p>
            {lang === "fr"
              ? "Créez des catégories, ajoutez vos réalisations avec une image, et tout apparaît instantanément sur votre portfolio."
              : "Create categories, add your work with an image, and everything appears instantly on your portfolio."}
          </p>
        </div>
        <div className="admin-grid">
          <CategoryPanel />
          <DesignPanel />
        </div>
      </div>
    </div>
  );
}
