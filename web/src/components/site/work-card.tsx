"use client";

import { motion } from "motion/react";
import { forwardRef } from "react";
import { categoryOf, coverOf, type Item, localize, pageList, shortMeta, splitTitle } from "@/lib/content";
import { pageCount } from "@/lib/copy";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* Brand-coloured backdrops a cover page sits on, like a printed piece laid
   on a coloured table. Pearl darkens in dark mode so it doesn't glare. */
export const TONE_BG: Record<string, string> = {
  navy: "bg-[radial-gradient(120%_90%_at_25%_0%,#2a4266,#13243d_70%)]",
  gold: "bg-[radial-gradient(120%_90%_at_25%_0%,#f0d784,#d4af37_70%)]",
  copper: "bg-[radial-gradient(120%_90%_at_25%_0%,#e3ae96,#c88568_70%)]",
  steel: "bg-[radial-gradient(120%_90%_at_25%_0%,#c3d5e3,#94b0c7_70%)]",
  slate: "bg-[radial-gradient(120%_90%_at_25%_0%,#476280,#2c3e50_70%)]",
  pearl: "bg-[radial-gradient(120%_90%_at_25%_0%,#ffffff,#e2e7ec_70%)] dark:bg-[radial-gradient(120%_90%_at_25%_0%,#2d4260,#1a2b42_70%)]",
};

export function useWorkMeta(item: Item) {
  return workMeta(item, useI18n().locale);
}

export function workMeta(item: Item, locale: "en" | "ar") {
  const [main, rest] = splitTitle(localize(item.title, locale));
  return {
    title: main,
    sub: rest || shortMeta(localize(item.meta || item.category, locale)),
    cover: coverOf(item),
    pages: pageList(item).length,
    isVideo: item.type === "video",
    category: categoryOf(item),
  };
}

const PLAY = "M.94 13.24c.31 0 .58-.12.89-.3l9.11-5.27c.65-.38.87-.63.87-1.05 0-.41-.22-.66-.87-1.04L1.83.31C1.52.13 1.25.02.94.02.36.02 0 .45 0 1.13v10.99c0 .68.36 1.12.94 1.12Z";

export const WorkCard = forwardRef<HTMLButtonElement, { item: Item; tone: string; onOpen: () => void; className?: string }>(
  function WorkCard({ item, tone, onOpen, className }, ref) {
    const { copy, locale } = useI18n();
    const { title, sub, cover, pages, isVideo } = useWorkMeta(item);
    const badge = isVideo ? copy.work.video : pages > 1 ? pageCount(pages, locale) : "";

    return (
      <motion.button
        ref={ref}
        type="button"
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onClick={onOpen}
        aria-label={sub ? `${title}, ${sub}` : title}
        className={cn("group flex flex-col gap-4 text-start outline-none", className)}
      >
        <div
          className={cn(
            "relative aspect-[5/4] w-full overflow-hidden rounded-[26px] transition-[box-shadow,transform] duration-700 ease-out-expo group-hover:shadow-[0_40px_70px_-35px_rgba(11,25,44,.6)] group-focus-visible:ring-2 group-focus-visible:ring-gold group-active:scale-[0.985]",
            TONE_BG[tone],
          )}
        >
          {cover &&
            (isVideo ? (
              <img src={cover} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]" />
            ) : (
              <img
                src={cover}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-[11%] size-[78%] object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,.32)] transition-transform duration-[1.1s] ease-out-expo group-hover:-translate-y-1.5 group-hover:scale-[1.035] group-hover:-rotate-1"
              />
            ))}
          {isVideo && (
            <span className="absolute inset-0 grid place-items-center bg-gradient-to-t from-navy/50 to-transparent">
              <span className="grid size-16 place-items-center rounded-full bg-ivory/15 text-ivory ring-1 ring-ivory/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-navy">
                <svg viewBox="-1 0 12 14" className="ms-0.5 size-5 fill-current" aria-hidden>
                  <path d={PLAY} />
                </svg>
              </span>
            </span>
          )}
          {badge && (
            <span className="absolute bottom-3.5 start-3.5 rounded-full bg-navy/55 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ivory tabular-nums backdrop-blur-md">
              {badge}
            </span>
          )}
          <span className="absolute end-3.5 top-3.5 grid size-10 scale-50 place-items-center rounded-full bg-ivory text-navy opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-4 rtl:-scale-x-100" aria-hidden>
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4 px-1">
          <span className="font-display text-[19px] leading-tight font-bold tracking-[-0.02em] transition-colors duration-300 group-hover:text-accent-ink">{title}</span>
          {sub && <span className="shrink-0 text-[13px] text-muted-foreground">{sub}</span>}
        </div>
      </motion.button>
    );
  },
);
