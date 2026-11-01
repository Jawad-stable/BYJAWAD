"use client";

import Link from "next/link";
import { useLenis } from "lenis/react";
import { MaskText } from "@/components/site/motion";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { copy, locale } = useI18n();
  const lenis = useLenis();
  const links = [
    { href: "/", label: copy.nav.home },
    { href: "/samples", label: copy.nav.voice },
    { href: "/projects", label: copy.nav.work },
    { href: "/#about", label: copy.nav.about },
    { href: "/#contact", label: copy.nav.contact },
    { href: "https://www.instagram.com/jawad.khamaysa", label: copy.contact.instagram },
    { href: "https://www.youtube.com/@jawad_khamaysa", label: copy.contact.youtube },
  ];

  return (
    <footer className="footer" data-dark>
      <div className="wrap footer-top">
        <ul className="footer-links">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" className="footer-top-btn" onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0 }))}>
          {copy.footer.top}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </button>
      </div>
      <p className="footer-mark" aria-hidden>
        <MaskText lines={[locale === "ar" ? "جواد خمايسة" : "Jawad Khamaysa"]} stagger={0.06} />
      </p>
      <div className="wrap footer-bottom">
        <span>{copy.footer.rights}</span>
        <span>{copy.hero.status}</span>
      </div>
    </footer>
  );
}
