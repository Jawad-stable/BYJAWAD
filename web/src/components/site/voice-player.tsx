"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlayPill } from "@/components/skiper/play-pill";
import { type Item, localize, splitTitle } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { cn, EASE, formatTime } from "@/lib/utils";

/* One sample plays at a time: starting a player tells the others to stop. */
const STOP_OTHERS = "voice:play";

function bars(seed: string, count = 46) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: count }, (_, i) => {
    h = (h * 1103515245 + 12345) >>> 0;
    const wave = Math.sin(i / 3.2) * 0.18 + 0.62;
    return Math.round((0.22 + ((h % 1000) / 1000) * 0.55) * wave * 100 + 18);
  });
}

export type Category = "commercial" | "narration";
export function categoryOfVoice(item: Item): Category {
  return /narrat/i.test(localize(item.label || item.category, "en")) ? "narration" : "commercial";
}

export function VoicePlayer({ item, index = 0 }: { item: Item; index?: number }) {
  const { copy, locale, dir } = useI18n();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(Number(item.duration) || 0);
  const [hover, setHover] = useState<number | null>(null);
  const heights = useMemo(() => bars(item.id), [item.id]);

  const [main, rest] = splitTitle(localize(item.title, locale));
  const title = rest || main;
  const sub = rest ? main : copy.dialect;
  const cat = categoryOfVoice(item);
  const progress = duration ? time / duration : 0;

  useEffect(() => {
    const stop = (e: Event) => {
      if ((e as CustomEvent).detail !== item.id) audio.current?.pause();
    };
    window.addEventListener(STOP_OTHERS, stop);
    return () => window.removeEventListener(STOP_OTHERS, stop);
  }, [item.id]);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      window.dispatchEvent(new CustomEvent(STOP_OTHERS, { detail: item.id }));
      el.play().catch(() => setPlaying(false));
    } else el.pause();
  };

  const seek = (fraction: number) => {
    const el = audio.current;
    if (!el) return;
    const apply = () => {
      if (el.duration) el.currentTime = Math.min(el.duration - 0.05, fraction * el.duration);
    };
    if (el.duration) apply();
    else el.addEventListener("loadedmetadata", apply, { once: true });
    if (el.paused) toggle();
  };

  const fractionAt = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = dir === "rtl" ? r.right - e.clientX : e.clientX - r.left;
    return Math.min(1, Math.max(0, x / r.width));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease: EASE, delay: (index % 2) * 0.08 }}
      className={cn(
        "group/player relative isolate flex flex-col overflow-hidden rounded-[30px] p-6 transition-[background-color,color,box-shadow] duration-700 ease-out-expo md:p-7",
        playing
          ? "grain bg-navy text-ivory shadow-[0_40px_80px_-40px_rgba(11,25,44,.7)]"
          : "bg-card text-foreground ring-1 ring-line hover:shadow-[0_30px_70px_-40px_rgba(11,25,44,.4)]",
      )}
    >
      <div className="relative flex items-center justify-between gap-3">
        <span className={cn("text-[11px] font-bold tracking-[0.18em] uppercase transition-colors duration-500 rtl:tracking-normal", playing ? "text-gold" : "text-accent-ink")}>
          {copy.cat[cat]}
        </span>
        <span className={cn("text-xs tabular-nums transition-colors duration-500", playing ? "text-ivory/60" : "text-muted-foreground")}>
          {formatTime(duration)}
        </span>
      </div>

      <h3 className="relative mt-5 font-display text-[clamp(22px,2.2vw,30px)] leading-[1.1] font-bold tracking-[-0.025em]">{title}</h3>
      <p className={cn("relative mt-1.5 text-sm transition-colors duration-500", playing ? "text-ivory/60" : "text-muted-foreground")}>{sub}</p>

      <div className="relative mt-auto flex items-center gap-4 pt-8">
        <PlayPill playing={playing} onClick={toggle} label={playing ? copy.player.pause : copy.player.play} />
        <div
          role="slider"
          tabIndex={0}
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={formatTime(time)}
          className="flex h-12 flex-1 cursor-pointer items-center gap-[2px] outline-none"
          onPointerMove={e => setHover(fractionAt(e))}
          onPointerLeave={() => setHover(null)}
          onClick={e => seek(fractionAt(e as unknown as React.PointerEvent<HTMLDivElement>))}
          onKeyDown={e => {
            const el = audio.current;
            if (!el?.duration) return;
            const step = (e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0) * (dir === "rtl" ? -1 : 1);
            if (step) {
              e.preventDefault();
              el.currentTime = Math.min(el.duration, Math.max(0, el.currentTime + step));
            }
          }}
        >
          {heights.map((h, i) => {
            const at = i / heights.length;
            const on = at < progress;
            const preview = hover != null && at < hover;
            return (
              <motion.span
                key={i}
                initial={{ scaleY: 0.15 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.012 }}
                className={cn(
                  "w-full rounded-full transition-colors duration-200",
                  on ? "bg-gold" : preview ? "bg-gold/45" : playing ? "bg-ivory/20" : "bg-foreground/15",
                )}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
        <span className={cn("w-10 text-end text-xs tabular-nums transition-colors duration-500", playing ? "text-ivory/70" : "text-muted-foreground")}>
          {formatTime(time)}
        </span>
      </div>

      <audio
        ref={audio}
        src={item.fileUrl}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration || duration)}
      />
    </motion.article>
  );
}
