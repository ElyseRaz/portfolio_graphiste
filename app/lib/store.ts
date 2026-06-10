"use client";

/* ============================================================
   store.ts — client-side data layer for the portfolio gallery.
   Categories persist in localStorage.
   Designs are fetched server-side from Cloudinary via /api/designs.
   Auth is handled server-side via httpOnly cookies (/api/auth/*).
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
  categoryName: string | null;
  image: string;
  desc: string;
  year: string;
}

interface State {
  categories: Category[];
  designs: Design[];
}

const KEY = "port_gallery_v1";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "c_scout",    name: "Scout" },
  { id: "c_chorale",  name: "Chorale" },
  { id: "c_affiches", name: "Affiches" },
  { id: "c_social",   name: "Réseaux Sociaux" },
];

let state: State = { categories: [...DEFAULT_CATEGORIES], designs: [] };
const listeners = new Set<() => void>();

function loadCategories(): Category[] {
  if (typeof window === "undefined") return [...DEFAULT_CATEGORIES];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.categories)) return parsed.categories;
    }
  } catch { /* ignore */ }
  return [...DEFAULT_CATEGORIES];
}

function persistCategories() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ categories: state.categories }));
  } catch (e) {
    console.warn("Storage full or unavailable", e);
  }
  listeners.forEach((fn) => fn());
}

const uid = (p: string) =>
  p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const Store = {
  get: () => state,
  getCategories: () => state.categories.slice(),
  getDesigns: () => state.designs.slice(),

  categoryName: (id: string | null) => {
    if (!id) return "—";
    // Check local categories first (admin device)
    const c = state.categories.find((c) => c.id === id);
    if (c) return c.name;
    // Fallback: use the name stored with the design itself
    const d = state.designs.find((d) => d.categoryId === id);
    return d?.categoryName || "—";
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },

  async refreshDesigns() {
    try {
      const res = await fetch("/api/designs");
      if (res.ok) {
        state.designs = await res.json();
        listeners.forEach((fn) => fn());
      }
    } catch { /* ignore — keep current state */ }
  },

  addCategory(name: string) {
    name = (name || "").trim();
    if (!name) return null;
    const cat: Category = { id: uid("c"), name };
    state.categories.push(cat);
    persistCategories();
    return cat;
  },

  deleteCategory(id: string) {
    state.categories = state.categories.filter((c) => c.id !== id);
    persistCategories();
  },

  async deleteDesign(id: string) {
    await fetch(`/api/designs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await Store.refreshDesigns();
  },

  reset() {
    state.categories = [...DEFAULT_CATEGORIES];
    persistCategories();
  },
};

export function useStore() {
  const [, force] = useState(0);
  useEffect(() => {
    // Load categories from localStorage
    state.categories = loadCategories();
    force((n) => n + 1);

    // Load designs from Cloudinary via server API
    Store.refreshDesigns();

    return Store.subscribe(() => force((n) => n + 1));
  }, []);
  return Store;
}
