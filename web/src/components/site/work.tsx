"use client";

import Link from "next/link";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useOpenMedia } from "@/components/site/media-provider";
import { EASE, SectionHead } from "@/components/site/motion";
import { workMeta } from "@/components/site/work-card";
import { categoryOf, coverOf, type Item, selectContent, useContent } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* CMS colors map to design-system beds; items without one take the next bed. */
const BEDS: Record<string, string> = {
  maroon: "navy", navy: "navy", gold: "stripe-gold", champagne: "stripe-gold", copper: "stripe-copper",
  steel: "stripe-steel", dark: "shell", charcoal: "shell", light: "label", pearl: "label",
};
const ORDER = ["navy", "stripe-gold", "stripe-copper", "stripe-steel", "shell", "label"];
const bedOf = (item: Item, index: number) => BEDS[item.color || ""] || ORDER[index % ORDER.length];

export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flip-rtl" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Tilts an element toward the pointer, a few degrees at most. */
function tilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 7}deg`);
  el.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 7}deg`);
}
function untilt(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--ry", "0deg");
  e.currentTarget.style.setProperty("--rx", "0deg");
}

/** A piece of work as printed matter: its cover on a colored bed, with a ticket stub. */
export function Sleeve({ item, index, className }: { item: Item; index: number; className?: string }) {
  const { copy, locale } = useI18n();
  const open = useOpenMedia();
  const { title, sub, cover, pages } = workMeta(item, locale);
  const cat = categoryOf(item);
  const motionItem = cat === "motion";
  const bed = motionItem ? "stripe-steel" : bedOf(item, index);
  const catalog = `${motionItem ? "M" : "B"}·${String(index + 1).padStart(2, "0")}`;

  return (
    <button
      type="button"
      className={cn("sleeve", className)}
      style={{ "--bed": `var(--${bed})` } as React.CSSProperties}
      aria-label={`${copy.work.open} ${title}${sub ? `, ${sub}` : ""}`}
      onClick={() => open(item)}
      onPointerMove={tilt}
      onPointerLeave={untilt}
    >
      <span className={cn("sleeve-bed", motionItem && "is-film")}>
        <span className="tag" data-side={motionItem ? "m" : "b"}>
          {copy.projects.filters[cat]}
        </span>
        {cover && <img src={cover} alt="" loading="lazy" decoding="async" />}
        <span className="sleeve-open" aria-hidden>
          {copy.work.open}
          <Arrow />
        </span>
      </span>
      <span className="sleeve-stub">
        <strong>{title}</strong>
        <span>{sub}</span>
        <em>
          {catalog}
          {motionItem ? "" : pages ? ` · ${pages} pp` : ""}
        </em>
      </span>
    </button>
  );
}

export type Filter = { key: string; label: string; count: number };

/**
 * Segmented filter; the raised pill slides under the active option. When the
 * options are wider than the screen it scrolls, with a fade on the hidden edge.
 */
export function FilterSwitch({ label, filters, active, onChange, id }: { label: string; filters: Filter[]; active: string; onChange: (key: string) => void; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setMore(el.scrollWidth - el.clientWidth - Math.abs(el.scrollLeft) > 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    el.addEventListener("scroll", check, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", check);
    };
  }, [filters]);

  return (
    <div ref={ref} className="switch" role="group" aria-label={label} data-more={more || undefined}>
      {filters.map(f => (
        <button
          key={f.key}
          type="button"
          aria-pressed={f.key === active}
          onClick={e => {
            e.currentTarget.scrollIntoView({ inline: "nearest", block: "nearest" });
            onChange(f.key);
          }}
        >
          {f.key === active && <motion.span layoutId={`switch-${id}`} className="switch-pill" transition={{ duration: 0.45, ease: EASE }} />}
          <span className="switch-label">
            {f.label} <small>{f.count}</small>
          </span>
        </button>
      ))}
    </div>
  );
}

/* Selected work. On wide screens the section pins and the sleeves slide
   sideways as the page scrolls; on phones it is a swipeable row. */
export function WorkGallery() {
  const { copy, dir } = useI18n();
  const reduced = useReducedMotion();
  const { design } = selectContent(useContent());
  const picks = [...design.filter(d => d.featured), ...design.filter(d => !d.featured)].slice(0, 7);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const wide = window.matchMedia("(min-width: 1024px)").matches && !reduced;
      setPinned(wide);
      const el = track.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced, picks.length]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useMotionValue(0);
  const geo = useRef({ pinned, distance, dir });
  const place = (p: number) => {
    const g = geo.current;
    x.set(g.pinned ? (g.dir === "rtl" ? 1 : -1) * p * g.distance : 0);
  };
  useEffect(() => {
    geo.current = { pinned, distance, dir };
    place(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned, distance, dir]);
  useMotionValueEvent(scrollYProgress, "change", place);

  return (
    <section id="work" ref={section} className={cn("work", pinned && "is-pinned")} style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}>
      <div className="work-sticky">
        <div className="wrap work-head">
          <SectionHead eyebrow={copy.work.label} title={copy.work.title} />
        </div>
        <motion.div ref={track} className="work-track" style={{ x }}>
          {picks.map((item, i) => (
            <motion.div
              key={item.id}
              className="work-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px -10% 0px -10%" }}
              transition={{ duration: 0.9, ease: EASE, delay: Math.min(i, 3) * 0.08 }}
            >
              <Sleeve item={item} index={design.indexOf(item)} />
            </motion.div>
          ))}
          <Link href="/projects" className="work-end">
            <span className="work-end-label">{copy.work.all}</span>
            <span className="work-end-arrow">
              <Arrow />
            </span>
          </Link>
        </motion.div>
        <div className="wrap">
          <div className="work-progress" aria-hidden>
            <motion.span style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Films: posters that play a silent preview under the pointer. */
function Film({ item, wide }: { item: Item; wide?: boolean }) {
  const { copy, locale } = useI18n();
  const open = useOpenMedia();
  const video = useRef<HTMLVideoElement>(null);
  const { title, sub } = workMeta(item, locale);
  const preview = (on: boolean) => {
    const v = video.current;
    if (!v || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (on) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  };
  return (
    <button
      type="button"
      className={cn("film", wide && "film--wide")}
      aria-label={`${copy.motion.play} ${title}${sub ? `, ${sub}` : ""}`}
      onClick={() => open(item)}
      onPointerEnter={() => preview(true)}
      onPointerLeave={() => preview(false)}
    >
      <img src={coverOf(item)} alt="" loading="lazy" decoding="async" />
      {item.fileUrl && <video ref={video} src={item.fileUrl} poster={coverOf(item)} muted loop playsInline preload="none" aria-hidden />}
      <span className="film-shade" aria-hidden />
      <span className="film-meta">
        <span className="mono-label">{sub}</span>
        <strong>{title}</strong>
      </span>
      <span className="film-play" aria-hidden>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.5 5.2c-.7-.4-1.5.1-1.5.9v11.8c0 .8.8 1.3 1.5.9l10-5.9c.7-.4.7-1.4 0-1.8z" transform="translate(1 0)" />
        </svg>
      </span>
    </button>
  );
}

export function Films() {
  const { copy } = useI18n();
  const { videos } = selectContent(useContent());
  const [lead, ...rest] = videos;
  if (!lead) return null;
  return (
    <section className="section films" data-dark>
      <div className="wrap">
        <SectionHead eyebrow={copy.motion.label} title={copy.motion.title} />
        <div className="films-grid">
          {[lead, ...rest.slice(0, 2)].map((v, i) => (
            <motion.div
              key={v.id}
              className={i === 0 ? "films-lead" : undefined}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
            >
              <Film item={v} wide={i === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
