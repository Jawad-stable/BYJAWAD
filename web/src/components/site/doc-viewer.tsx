"use client";

import { useLenis } from "lenis/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IMAGE_RE, type Item, isSafeUrl, localize, pageList, shortMeta, splitTitle } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* Documents open as their WEBP page images in a snapping carousel: swipe on a
   phone, arrows or arrow keys elsewhere. The frame takes the shape of the
   document, so a wide deck gets a short box and an A4 booklet a tall one. */

export function DocViewer({ item, onClose }: { item: Item | null; onClose: () => void }) {
  // Keyed by item, so each document opens on its first page with fresh state.
  return <AnimatePresence>{item && <Viewer key={item.id} item={item} onClose={onClose} />}</AnimatePresence>;
}

function Viewer({ item, onClose }: { item: Item; onClose: () => void }) {
  const { copy, locale } = useI18n();
  const lenis = useLenis();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState<Record<number, boolean>>({});

  const listed = pageList(item);
  const pages = listed.length ? listed : isSafeUrl(item.fileUrl) && IMAGE_RE.test(item.fileUrl) ? [{ url: item.fileUrl }] : [];
  const total = pages.length;
  const first = pages[0];
  const ratio = first?.w && first?.h ? first.w / first.h : 1.4;
  const [title, rest] = splitTitle(localize(item.title, locale));
  const eyebrow = rest || shortMeta(localize(item.meta || item.category, locale));
  const pdf = isSafeUrl(item.pdfUrl) ? item.pdfUrl : "";

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const target = Math.min(total - 1, Math.max(0, i));
      el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
    },
    [total],
  );

  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo, onClose]);

  return (
        <div className="fixed inset-0 z-[120] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={title} data-lenis-prevent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col overflow-hidden rounded-t-[28px] bg-card text-foreground shadow-2xl [--pad:10px] md:rounded-[28px] md:[--pad:72px]"
            style={{
              width: `min(1120px, 100vw, calc((90svh - 150px) * ${ratio} + 2 * var(--pad)))`,
              height: `min(92svh, calc((min(1120px, 100vw, calc((90svh - 150px) * ${ratio} + 2 * var(--pad))) - 2 * var(--pad)) / ${ratio} + 150px))`,
              minWidth: "min(340px, 100vw)",
            }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
              <div className="min-w-0">
                {eyebrow && <p className="text-[11px] font-bold tracking-[0.18em] text-accent-ink uppercase rtl:tracking-normal">{eyebrow}</p>}
                <h2 className="mt-1 truncate font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={copy.viewer.close}
                className="group grid size-11 shrink-0 place-items-center rounded-full bg-foreground/[0.06] transition hover:bg-foreground hover:text-background active:scale-90"
              >
                <X className="size-4 transition-transform duration-500 group-hover:rotate-90" />
              </button>
            </header>

            <div className="relative min-h-0 flex-1 bg-foreground/[0.04]">
              <div
                ref={track}
                dir="ltr"
                tabIndex={0}
                onScroll={e => setIndex(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
                className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {pages.map((page, i) => (
                  <div key={page.url} className="relative flex h-full w-full shrink-0 snap-center items-center justify-center px-[var(--pad)] py-3" style={{ scrollSnapStop: "always" }}>
                    {!ready[i] && <span className="absolute size-8 animate-spin rounded-full border-[3px] border-line-strong border-t-gold" />}
                    <img
                      src={page.url}
                      alt={`${title}, ${i + 1} ${copy.viewer.of} ${total}`}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                      onLoad={() => setReady(r => ({ ...r, [i]: true }))}
                      className={cn("size-full object-contain drop-shadow-[0_12px_26px_rgba(0,0,0,.25)] transition-opacity duration-300", ready[i] ? "opacity-100" : "opacity-0")}
                    />
                  </div>
                ))}
              </div>
              {total > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={copy.viewer.prev}
                    disabled={index === 0}
                    onClick={() => goTo(index - 1)}
                    className="absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow-lg backdrop-blur transition hover:bg-foreground hover:text-background active:scale-90 disabled:opacity-30 disabled:hover:bg-card/90 disabled:hover:text-foreground"
                    style={{ left: "12px" }}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={copy.viewer.next}
                    disabled={index === total - 1}
                    onClick={() => goTo(index + 1)}
                    className="absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow-lg backdrop-blur transition hover:bg-foreground hover:text-background active:scale-90 disabled:opacity-30 disabled:hover:bg-card/90 disabled:hover:text-foreground"
                    style={{ right: "12px" }}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            <footer className="flex items-center justify-between gap-4 border-t border-line px-6 py-3 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
              <span dir="ltr" className="tabular-nums">
                {total > 1 ? `${index + 1} / ${total}` : ""}
              </span>
              {pdf && (
                <a href={pdf} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 transition hover:text-accent-ink hover:underline">
                  {copy.viewer.download} ↗
                </a>
              )}
            </footer>
          </motion.div>
        </div>
  );
}
