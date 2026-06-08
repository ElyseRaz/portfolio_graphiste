"use client";

/* ============================================================
   store.ts — client-side data layer for the portfolio gallery.
   Persists categories + designs to localStorage. Images are
   downscaled to dataURLs so they survive reloads.
   NOTE: front-end prototype. The admin passcode is a light gate,
   not real security.
   ============================================================ */
import { useEffect, useState } from "react";

export interface Category {
  id: string;
  name: string;
}

export interface Design {
  id: string;
  title: string;
  categoryId: string | null;
  image: string;
  desc: string;
  year: string;
}

interface State {
  categories: Category[];
  designs: Design[];
}

const KEY = "port_gallery_v1";
const ADMIN_KEY = "port_admin_authed";
const ADMIN_CODE = "elys2026";

const DEFAULTS: State = {
  categories: [
    { id: "c_scout",   name: "Scout" },
    { id: "c_chorale", name: "Chorale" },
    { id: "c_affiches", name: "Affiches" },
    { id: "c_social",  name: "Réseaux Sociaux" },
  ],
  designs: [
    {
      id: "d_scout",
      title: "Scout — Tily Faritany",
      categoryId: "c_scout",
      image: "/image2.jpg",
      desc: "Identité visuelle pour le rassemblement scout « Tily Faritany Matsiatra Ambony » : emblème Tily, fleur de lys scoute, colombe de la paix et cathédrale de Fianarantsoa.",
      year: "2025",
    },
  ],
};

const clone = (s: State): State =>
  typeof structuredClone === "function"
    ? structuredClone(s)
    : JSON.parse(JSON.stringify(s));

let state: State = load();
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return clone(DEFAULTS);
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.categories && parsed.designs) return parsed;
    }
  } catch {
    /* ignore */
  }
  return clone(DEFAULTS);
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Storage full or unavailable", e);
  }
  listeners.forEach((fn) => fn());
}

const uid = (p: string) =>
  p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ---- image downscale: returns Promise<dataURL> ---- */
export function resizeImage(file: File, maxDim = 1500, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("not-image"));
      return;
    }
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
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("no-context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === "image/png";
        resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const Store = {
  get: () => state,
  getCategories: () => state.categories.slice(),
  getDesigns: () => state.designs.slice(),
  categoryName: (id: string | null) => {
    const c = state.categories.find((c) => c.id === id);
    return c ? c.name : "—";
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  addCategory(name: string) {
    name = (name || "").trim();
    if (!name) return null;
    const cat: Category = { id: uid("c"), name };
    state.categories.push(cat);
    persist();
    return cat;
  },
  deleteCategory(id: string) {
    state.categories = state.categories.filter((c) => c.id !== id);
    state.designs.forEach((d) => {
      if (d.categoryId === id) d.categoryId = null;
    });
    persist();
  },

  addDesign({
    title,
    categoryId,
    image,
    desc,
    year,
  }: {
    title?: string;
    categoryId?: string | null;
    image?: string;
    desc?: string;
    year?: string;
  }) {
    const d: Design = {
      id: uid("d"),
      title: (title || "Sans titre").trim(),
      categoryId: categoryId || null,
      image: image || "",
      desc: (desc || "").trim(),
      year: (year || "").trim(),
    };
    state.designs.unshift(d);
    persist();
    return d;
  },
  deleteDesign(id: string) {
    state.designs = state.designs.filter((d) => d.id !== id);
    persist();
  },

  resizeImage,

  /* ---- auth (session) ---- */
  isAuthed: () =>
    typeof window !== "undefined" && sessionStorage.getItem(ADMIN_KEY) === "1",
  login(code: string) {
    if (code === ADMIN_CODE) {
      sessionStorage.setItem(ADMIN_KEY, "1");
      return true;
    }
    return false;
  },
  logout() {
    sessionStorage.removeItem(ADMIN_KEY);
  },

  reset() {
    state = clone(DEFAULTS);
    persist();
  },
};

/* Subscribe a component to store changes. Also re-reads persisted state on
   mount so SSR (which seeds DEFAULTS) reconciles with localStorage. */
export function useStore() {
  const [, force] = useState(0);
  useEffect(() => {
    state = load();
    force((n) => n + 1);
    return Store.subscribe(() => force((n) => n + 1));
  }, []);
  return Store;
}
