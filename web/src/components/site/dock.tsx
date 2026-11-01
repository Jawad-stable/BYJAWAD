"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { BtnLabel, EASE } from "@/components/site/motion";
import { useI18n } from "@/lib/i18n";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

type NavKey = "home" | "voice" | "work" | "about" | "contact";

/* The floating pill. Glass that turns dark over dark sections, tucks away
   while reading down and returns on the way up. Every radius inside it is
   concentric with the pill (60px tall, 6px in, so 48px pills). */
export function Dock() {
  const { copy, toggle, locale } = useI18n();
  const pathname = usePathname();
  const lenis = useLenis();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(pathname === "/");
  const [section, setSection] = useState<NavKey>("home");
  const menu = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  const home = pathname === "/";

  const links: { key: NavKey; href: string; label: string }[] = [
    { key: "home", href: "/", label: copy.nav.home },
    { key: "voice", href: "/samples", label: copy.nav.voice },
    { key: "work", href: "/projects", label: copy.nav.work },
    { key: "about", href: "/#about", label: copy.nav.about },
    { key: "contact", href: "/#contact", label: copy.nav.contact },
  ];
  const active: NavKey | null = pathname.startsWith("/samples") ? "voice" : pathname.startsWith("/projects") ? "work" : home ? section : null;
  const night = mounted && resolvedTheme === "dark";

  useMotionValueEvent(scrollY, "change", y => {
    const prev = scrollY.getPrevious() ?? 0;
    if (open) return;
    if (y > 240 && y - prev > 6) setHidden(true);
    else if (prev - y > 6 || y < 240) setHidden(false);
  });

  // Dark glass over dark sections; the home sections mark the active link.
  useEffect(() => {
    const strip = { rootMargin: "-30px 0px -94% 0px" };
    const darkIO = new IntersectionObserver(entries => {
      const any = [...document.querySelectorAll("[data-dark]")].some(el => {
        const r = el.getBoundingClientRect();
        return r.top <= 40 && r.bottom >= 40;
      });
      if (entries.length) setDark(any);
    }, strip);
    document.querySelectorAll("[data-dark]").forEach(el => darkIO.observe(el));
    // The active section is the last one whose top has passed mid-screen.
    let raf = 0;
    const track = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let current: NavKey = "home";
        for (const id of ["voice", "about", "work", "contact"] as NavKey[]) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) current = id;
        }
        setSection(current);
      });
    };
    track();
    window.addEventListener("scroll", track, { passive: true });
    return () => {
      darkIO.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", track);
    };
  }, [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menu.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  // On the home page, section links glide there instead of jumping.
  const go = (href: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!home || !lenis) return;
    if (href === "/") {
      e.preventDefault();
      lenis.scrollTo(0);
    } else if (href.startsWith("/#")) {
      e.preventDefault();
      lenis.scrollTo(href.slice(1), { offset: -24 });
    }
  };

  // Theme: a circle grows from the key and uncovers the other theme.
  const switchTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = night ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) return setTheme(next);
    const r = e.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--vt-x", `${r.left + r.width / 2}px`);
    root.style.setProperty("--vt-y", `${r.top + r.height / 2}px`);
    root.classList.add("vt-theme");
    const t = document.startViewTransition(() =>
      flushSync(() => {
        root.classList.remove("light", "dark");
        root.classList.add(next);
        root.style.colorScheme = next;
        setTheme(next);
      }),
    );
    t.finished.finally(() => root.classList.remove("vt-theme"));
  };

  const tools = (
    <>
      <button type="button" className="dock-icon" aria-label={copy.theme.night} aria-pressed={night} onClick={switchTheme}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {night ? (
            <>
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
            </>
          ) : (
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          )}
        </svg>
      </button>
      <button type="button" className="dock-icon dock-lang" aria-label={copy.lang.label} lang={locale === "ar" ? "en" : "ar"} onClick={toggle}>
        {locale === "ar" ? "EN" : "ع"}
      </button>
    </>
  );

  return (
    <header className={cn("dock", hidden && "is-hidden", (dark || open) && "is-dark")}>
      <div className="dock-bar">
        <Link href="/" className="dock-brand" onClick={go("/")} aria-label="Jawad Khamaysa">
          <img src="/media/logo-gold.png" alt="" width={32} height={32} />
          <span>{locale === "ar" ? "جواد خمايسة" : "Jawad Khamaysa"}</span>
        </Link>
        <nav aria-label="Main" className="dock-nav">
          <ul>
            {links.map(l => (
              <li key={l.key}>
                <Link href={l.href} onClick={go(l.href)} aria-current={active === l.key ? "page" : undefined}>
                  {active === l.key && <motion.span layoutId="dock-pill" className="dock-pill" transition={{ duration: 0.5, ease: EASE }} />}
                  <span className="dock-link">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="dock-tools">{tools}</div>
        <button
          ref={menu}
          type="button"
          className="dock-icon dock-menu"
          aria-expanded={open}
          aria-controls="dock-sheet"
          aria-label={open ? copy.nav.close : copy.nav.menu}
          onClick={() => setOpen(o => !o)}
        >
          <span className={cn("burger", open && "is-open")} aria-hidden>
            <i />
            <i />
          </span>
        </button>
        <Link href="/#contact" className="btn btn-gold dock-cta" onClick={go("/#contact")}>
          <BtnLabel text={copy.nav.book} />
        </Link>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="dock-sheet"
            className="dock-sheet"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <nav aria-label="Main">
              <ul>
                {links.map((l, i) => (
                  <motion.li key={l.key} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.05 }}>
                    <Link href={l.href} onClick={go(l.href)} aria-current={active === l.key ? "page" : undefined} autoFocus={i === 0}>
                      <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="dock-sheet-tools">{tools}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
