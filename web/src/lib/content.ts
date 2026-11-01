"use client";

import { useEffect, useState } from "react";
import snapshot from "@/data/content.json";
import type { Locale } from "./copy";

/* Content comes from the Cloudflare content API that the admin panel writes
   to. A snapshot taken at build time renders the pages straight away; the
   live copy replaces it once fetched, so admin edits show without a rebuild. */

export const API_BASE = "https://portfolio-content-api.khmaystjwad.workers.dev";

type Localized = string | { en?: string; ar?: string } | null | undefined;
export type Page = { url: string; w?: number; h?: number };

export type Item = {
  id: string;
  type: "visual-id" | "project" | "voice" | "video" | "social-post" | string;
  anchor?: string;
  title?: Localized;
  meta?: Localized;
  category?: Localized;
  label?: Localized;
  description?: Localized;
  color?: string;
  order?: number;
  published?: boolean;
  featured?: boolean;
  fileUrl?: string;
  pdfUrl?: string;
  pdfSize?: number;
  pages?: (Page | string)[];
  thumbnailUrl?: string;
  embedUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  link?: string;
};

export type Content = { projectsComingSoon?: boolean; items: Item[] };

export function localize(value: Localized, locale: Locale): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.en || value.ar || "";
}

/** "Client — Piece" becomes a title and a short line instead of one dashed string. */
export function splitTitle(text: string): [string, string] {
  const parts = text.split(/\s+[—–-]\s+/);
  return parts.length > 1 ? [parts[0].trim(), parts.slice(1).join(" ").trim()] : [text.trim(), ""];
}

/** "Brand / Education" becomes "Education". */
export const shortMeta = (text: string) => text.split("/").pop()?.trim() ?? "";

export function isSafeUrl(url?: string): url is string {
  return !!url && /^(https?:\/\/|\/)/i.test(url.trim());
}

export function pageList(item: Item): Page[] {
  return (item.pages || [])
    .map(p => (typeof p === "string" ? { url: p } : p))
    .filter(p => isSafeUrl(p?.url));
}

export type WorkCategory = "brand" | "print" | "motion" | "social";
export function categoryOf(item: Item): WorkCategory {
  if (item.type === "video") return "motion";
  if (item.type === "social-post") return "social";
  return localize(item.meta || item.category, "en").toLowerCase().startsWith("print") ? "print" : "brand";
}

const TONES: Record<string, string> = {
  maroon: "navy", navy: "navy", gold: "gold", champagne: "gold", copper: "copper",
  steel: "steel", dark: "slate", charcoal: "slate", light: "pearl", pearl: "pearl",
};
export function toneOf(item: Item, index: number) {
  return TONES[item.color || ""] || ["navy", "gold", "steel", "copper", "slate", "pearl"][index % 6];
}

export const IMAGE_RE = /\.(jpe?g|png|gif|webp|avif|svg)([?#]|$)/i;
export const VIDEO_RE = /\.(mp4|webm|ogv|mov)([?#]|$)/i;

export function coverOf(item: Item): string {
  if (item.type === "video" && isSafeUrl(item.thumbnailUrl)) return item.thumbnailUrl;
  const pages = pageList(item);
  if (pages[0]) return pages[0].url;
  if (isSafeUrl(item.fileUrl) && IMAGE_RE.test(item.fileUrl)) return item.fileUrl;
  return "";
}

function sorted(items: Item[], types: string[]) {
  return items
    .filter(i => types.includes(i.type) && i.published !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export function selectContent(content: Content) {
  const items = content.items || [];
  const design = sorted(items, ["visual-id", "project"]);
  const videos = sorted(items, ["video"]);
  const voices = sorted(items, ["voice"]).filter(v => v.fileUrl);
  const social = sorted(items, ["social-post"]);
  // Same rule as the admin panel: the Projects page shows "coming soon"
  // unless the flag has been switched off.
  return { design, videos, voices, social, comingSoon: content.projectsComingSoon !== false };
}

let live: Content | null = null;
let request: Promise<Content | null> | null = null;

function fetchLive() {
  request ??= fetch(`${API_BASE}/api/content`)
    .then(r => (r.ok ? r.json() : null))
    .then((data: Content | null) => (live = data && Array.isArray(data.items) ? data : null))
    .catch(() => null);
  return request;
}

export function useContent(): Content {
  const [content, setContent] = useState<Content>(live || (snapshot as Content));
  useEffect(() => {
    let alive = true;
    fetchLive().then(data => alive && data && setContent(data));
    return () => {
      alive = false;
    };
  }, []);
  return content;
}
