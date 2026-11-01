"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { COPY, type Copy, type Locale } from "./copy";

const KEY = "siteLocale";
const EVENT = "site:locale";

type I18n = { locale: Locale; copy: Copy; dir: "ltr" | "rtl"; toggle: () => void };

const I18nContext = createContext<I18n>({ locale: "en", copy: COPY.en, dir: "ltr", toggle: () => {} });

/* The language lives on <html lang>, set before first paint by the head
   script in layout.tsx. Pages are pre-rendered in English, so the server
   snapshot is "en" and the client takes over from the real attribute. */
function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}
const readLocale = (): Locale => (document.documentElement.lang === "ar" ? "ar" : "en");

function apply(locale: Locale) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === "ar" ? "rtl" : "ltr";
  try {
    localStorage.setItem(KEY, locale);
  } catch {
    /* preference just isn't remembered */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, () => "en" as Locale);

  // The Arabic copy is on screen now; reveal the page the head script hid.
  useEffect(() => {
    document.documentElement.classList.remove("locale-pending");
  }, [locale]);

  const toggle = useCallback(() => {
    const next: Locale = locale === "ar" ? "en" : "ar";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) return apply(next);
    // A quiet cross-fade between languages instead of a hard cut.
    document.documentElement.classList.add("vt-fade");
    // flushSync so React has rendered the new language before the snapshot.
    const t = document.startViewTransition(() => flushSync(() => apply(next)));
    t.finished.catch(() => {}).finally(() => document.documentElement.classList.remove("vt-fade"));
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, copy: COPY[locale], dir: locale === "ar" ? "rtl" : "ltr", toggle }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
