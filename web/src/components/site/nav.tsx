"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/skiper/theme-toggle";
import { TextRoll } from "@/components/skiper/text-roll";
import { ButtonLink } from "@/components/site/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NavLink = { key: string; label: string; href: string; section?: string };

export function Nav() {
  const { copy, toggle, locale } = useI18n();
  const pathname = usePathname();
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(pathname === "/");
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const home = pathname === "/";
  const links: NavLink[] = [
    { key: "about", label: copy.nav.about, href: "/#about", section: "about" },
    { key: "voice", label: copy.nav.voice, href: "/samples" },
    { key: "work", label: copy.nav.work, href: "/projects" },
    { key: "contact", label: copy.nav.contact, href: "/#contact", section: "contact" },
  ];
  const activeKey = pathname.startsWith("/samples") ? "voice" : pathname.startsWith("/projects") ? "work" : home ? section : null;

  // Tuck away while reading down, return on the first scroll up.
  useMotionValueEvent(scrollY, "change", y => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setOverHero(home && y < window.innerHeight - 70);
    if (open) return;
    if (y > 320 && y - prev > 4) setHidden(true);
    else if (prev - y > 4 || y < 320) setHidden(false);
  });

  // On the home page, mark the section crossing the middle of the screen.
  useEffect(() => {
    if (!home) return;
    const ids = ["about", "contact"];
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setSection(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [home]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[90] px-3 pt-3 sm:px-6 sm:pt-4"
        data-hidden={hidden}
        style={{ viewTransitionName: "site-nav" }}
      >
        <nav
          aria-label="Main"
          className={cn(
            "relative mx-auto flex h-[60px] max-w-[1240px] items-center gap-2 rounded-full border border-line bg-glass ps-3 pe-2 text-foreground backdrop-blur-2xl backdrop-saturate-150 transition-[box-shadow,background-color,border-color,color] duration-500",
            scrolled ? "shadow-[0_18px_50px_-20px_rgba(11,25,44,.35)]" : "shadow-[0_4px_20px_-12px_rgba(11,25,44,.18)]",
            home && overHero && !open && "on-dark",
          )}
        >
          <Link href="/" aria-label="Jawad Khamaysa" className="group me-auto flex items-center gap-3 rounded-full">
            <img src="/media/logo-gold.png" alt="" width={36} height={36} className="size-9 object-contain transition-transform duration-700 ease-out-expo group-hover:-rotate-12 group-hover:scale-105" />
            <span className="hidden font-display text-[15px] font-bold tracking-tight sm:block">
              {locale === "ar" ? "جواد خمايسة" : "Jawad Khamaysa"}
            </span>
          </Link>

          <SpotlightLinks links={links} activeKey={activeKey} />

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={toggle}
              aria-label={copy.lang.label}
              className="grid h-10 min-w-10 place-items-center rounded-full px-2 font-display text-[13px] font-bold transition-colors hover:bg-foreground/[0.07] active:scale-95"
            >
              <TextRoll center>{copy.lang.next}</TextRoll>
            </button>
            <ButtonLink href="/#contact" variant="ink" className="hidden h-11 px-5 text-sm md:inline-flex" magnetic={false}>
              {copy.nav.book}
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-label={open ? copy.nav.close : copy.nav.menu}
              className="grid size-11 place-items-center rounded-full bg-foreground text-background active:scale-95 md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={cn("absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-transform duration-500 ease-out-expo", open && "translate-y-[5px] rotate-45")} />
                <span className={cn("absolute inset-x-0 bottom-0 h-0.5 rounded bg-current transition-transform duration-500 ease-out-expo", open && "-translate-y-[5px] -rotate-45")} />
              </span>
            </button>
          </div>

          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute inset-x-7 -bottom-px h-[2px] origin-left rounded-full bg-gold rtl:origin-right"
          />
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="grain fixed inset-0 z-[80] flex flex-col justify-between overflow-hidden bg-navy px-6 pb-10 pt-28 text-ivory md:hidden"
            data-lenis-prevent
          >
            <ul className="flex flex-col gap-2">
              {links.map((link, i) => (
                <motion.li
                  key={link.key}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn("flex items-baseline gap-4 font-display text-5xl font-bold tracking-[-0.04em]", activeKey === link.key && "text-gold")}
                  >
                    <span className="text-sm font-medium text-ivory/40">0{i + 1}</span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}>
              <ButtonLink href="/#contact" onClick={() => setOpen(false)} className="w-full">
                {copy.nav.book}
              </ButtonLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Spotlight links: Vengence UI "spotlight-navbar". A soft gold light follows
 * the pointer along the links and springs back to the current page when it
 * leaves; a short gold glow marks the active link.
 * Source: https://www.vengenceui.com/components/spotlight-navbar (open source)
 */
function SpotlightLinks({ links, activeKey }: { links: NavLink[]; activeKey: string | null }) {
  const ref = useRef<HTMLUListElement>(null);
  const spot = useSpring(0, { stiffness: 220, damping: 24 });
  const ambience = useSpring(0, { stiffness: 220, damping: 24 });
  const [hovering, setHovering] = useState(false);

  const centerOf = (key: string | null) => {
    const list = ref.current;
    const el = key ? list?.querySelector<HTMLElement>(`[data-key="${key}"]`) : null;
    if (!list || !el) return null;
    const a = list.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    return b.left - a.left + b.width / 2;
  };

  useEffect(() => {
    const x = centerOf(activeKey);
    if (x != null) {
      ambience.set(x);
      if (!hovering) spot.set(x);
    }
  });

  const [spotX, setSpotX] = useState(0);
  const [ambX, setAmbX] = useState(0);
  useMotionValueEvent(spot, "change", setSpotX);
  useMotionValueEvent(ambience, "change", setAmbX);

  return (
    <ul
      ref={ref}
      className="relative me-2 hidden h-11 items-center overflow-hidden rounded-full md:flex"
      onPointerMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        setHovering(true);
        spot.jump(e.clientX - r.left);
      }}
      onPointerLeave={() => {
        setHovering(false);
        const x = centerOf(activeKey);
        if (x != null) spot.set(x);
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: hovering ? 1 : 0, background: `radial-gradient(110px circle at ${spotX}px 100%, rgba(212,175,55,.22), transparent 55%)` }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] transition-opacity duration-500"
        style={{ opacity: activeKey ? 1 : 0, background: `radial-gradient(44px circle at ${ambX}px 0%, var(--gold), transparent 100%)` }}
      />
      {links.map(link => (
        <li key={link.key} className="relative z-10">
          <Link
            href={link.href}
            data-key={link.key}
            aria-current={activeKey === link.key ? "page" : undefined}
            className={cn(
              "flex h-11 items-center rounded-full px-4 text-[14px] font-medium transition-colors duration-300",
              activeKey === link.key ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <TextRoll>{link.label}</TextRoll>
          </Link>
        </li>
      ))}
    </ul>
  );
}
