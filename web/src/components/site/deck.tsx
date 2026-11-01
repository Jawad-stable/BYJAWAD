"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FlatTape } from "@/components/site/flat-tape";
import { EASE } from "@/components/site/motion";
import { type Item, localize, splitTitle } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { tape } from "@/lib/tape";
import { useDeck } from "@/lib/use-deck";
import { cn, formatTime } from "@/lib/utils";

export type Category = "commercial" | "narration";
export function categoryOfVoice(item: Item): Category {
  return /narrat/i.test(localize(item.label || item.category, "en")) ? "narration" : "commercial";
}

function useMeta() {
  const { copy, locale } = useI18n();
  return (item: Item) => {
    const [main, rest] = splitTitle(localize(item.title, locale));
    return { title: rest || main, client: rest ? main : copy.dialect, category: copy.cat[categoryOfVoice(item)] };
  };
}

const Icon = {
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.5 5.2c-.7-.4-1.5.1-1.5.9v11.8c0 .8.8 1.3 1.5.9l10-5.9c.7-.4.7-1.4 0-1.8z" transform="translate(1 0)" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  forward: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  ),
};

function Seek({ time, duration, label, onSeek, onSeeking }: { time: number; duration: number; label: string; onSeek: (s: number) => void; onSeeking: (on: boolean) => void }) {
  const { copy } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const p = duration ? Math.min(1, time / duration) : 0;
  const at = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (x - r.left) / r.width)) * duration;
  };
  const keys: Record<string, (t: number) => number> = {
    ArrowRight: t => t + 5,
    ArrowUp: t => t + 5,
    ArrowLeft: t => t - 5,
    ArrowDown: t => t - 5,
    PageUp: t => t + 10,
    PageDown: t => t - 10,
    Home: () => 0,
    End: () => duration,
  };
  return (
    <div
      ref={ref}
      className="seek"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(time)}
      aria-valuetext={`${formatTime(time)} ${copy.viewer.of} ${formatTime(duration)}`}
      aria-disabled={!duration || undefined}
      onPointerDown={e => {
        if (!duration) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        onSeeking(true);
        onSeek(at(e.clientX));
      }}
      onPointerMove={e => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) onSeek(at(e.clientX));
      }}
      onPointerUp={() => onSeeking(false)}
      onLostPointerCapture={() => onSeeking(false)}
      onKeyDown={e => {
        const to = keys[e.key];
        if (!to || !duration) return;
        e.preventDefault();
        onSeek(to(time));
      }}
    >
      <span className="seek-track">
        <span className="seek-fill" style={{ transform: `scaleX(${p})` }} />
      </span>
      <span className="seek-thumb" style={{ left: `${p * 100}%` }} />
    </div>
  );
}

/* A small reel that turns on the shelf row that is playing. */
function MiniReel({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("mini-reel", on && "is-on")} aria-hidden>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      {[0, 120, 240].map(a => (
        <circle key={a} cx={+(12 + Math.cos((a * Math.PI) / 180) * 6).toFixed(2)} cy={+(12 + Math.sin((a * Math.PI) / 180) * 6).toFixed(2)} r="1.6" fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * The deck and its shelf. The bay is where the 3D cassette lands
 * ([data-tape-dock]); pick a tape from the shelf to swap it in and play it.
 * `visible` filters the shelf without unloading the deck.
 */
export function Deck({ items, visible, limit, footer }: { items: Item[]; visible?: (item: Item) => boolean; limit?: number; footer?: React.ReactNode }) {
  const { copy, locale } = useI18n();
  const meta = useMeta();
  const d = useDeck(items);
  const [seeking, setSeeking] = useState(false);
  const swaps = useRef(0);
  const first = useRef(true);

  const current = d.item ? meta(d.item) : null;
  const progress = d.duration ? d.time / d.duration : 0;
  const on = d.status === "playing" || d.status === "loading";
  const turning = d.status === "playing" && !seeking;

  // Tell the 3D cassette what is loaded, and when a new tape goes in.
  useEffect(() => {
    if (!current) return;
    if (!first.current) swaps.current += 1;
    first.current = false;
    tape.set({ title: current.title, client: current.client, rtl: locale === "ar", swap: swaps.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.index, locale]);
  useEffect(() => {
    tape.set({ playing: turning, progress });
  }, [turning, progress]);
  useEffect(() => () => tape.set({ playing: false, progress: 0 }), []);

  if (!current) return null;
  const shelf = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => !visible || visible(item))
    .slice(0, limit);
  const status = d.status === "error" ? copy.player.error : d.status === "loading" && d.slow ? copy.player.loading : "";

  return (
    <div className="deck">
      <div className="deck-panel jk-surface-dark" role="group" aria-label={`${current.title}, ${current.client}`} aria-busy={d.status === "loading" || undefined}>
        <div className="deck-bay">
          <div className="deck-slot" data-tape-dock>
            <FlatTape progress={progress} playing={turning} />
          </div>
        </div>
        <div className="deck-info">
          <p className="mono-label deck-state">
            <MiniReel on={on} />
            {on ? copy.voice.now : copy.voice.loaded}
          </p>
          <motion.div key={d.index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <h3 className="deck-title">{current.title}</h3>
            <p className="deck-client">
              {current.client} · {current.category}
            </p>
          </motion.div>
        </div>
        <div className="deck-scrub" dir="ltr">
          <span className="deck-time">{formatTime(d.time)}</span>
          <Seek time={d.time} duration={d.duration} label={`${copy.player.seek} ${current.title}`} onSeek={d.seekTo} onSeeking={setSeeking} />
          <span className="deck-time">{formatTime(d.duration)}</span>
        </div>
        <p className="deck-status" role="status">
          {status}
        </p>
        <div className="deck-keys">
          <button type="button" className="key-round" aria-label={copy.player.back} onClick={() => d.seekTo(d.time - 10)}>
            {Icon.back}
          </button>
          <button type="button" className="key-round key-play" aria-label={`${on ? copy.player.pause : copy.player.play} ${current.title}`} onClick={() => d.select(d.index)}>
            <span className={cn("swap-icon", on && "is-on")}>
              {Icon.play}
              {Icon.pause}
            </span>
          </button>
          <button type="button" className="key-round" aria-label={copy.voice.forward} onClick={() => d.seekTo(d.time + 10)}>
            {Icon.forward}
          </button>
          <button type="button" className="key-round" aria-label={copy.player.mute} aria-pressed={d.muted} onClick={d.toggleMute}>
            <span className={cn("mute-icon", d.muted && "is-on")} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4z" />
                <path d="m16 9 5 6" />
                <path d="m21 9-5 6" />
              </svg>
            </span>
          </button>
        </div>
        <audio {...d.audioProps} />
      </div>

      <div className="shelf">
        <p className="mono-label shelf-head">{copy.voice.shelf}</p>
        <ol className="shelf-list">
          {shelf.map(({ item, i }, n) => {
            const m = meta(item);
            const loaded = i === d.index;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: n * 0.05 }}
              >
                <button type="button" className={cn("shelf-row", loaded && "is-loaded", loaded && on && "is-playing")} aria-pressed={loaded} onClick={() => d.select(i)}>
                  <span className="shelf-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="shelf-main">
                    <strong>{m.title}</strong>
                    <small>
                      {m.client} · {m.category}
                    </small>
                  </span>
                  <span className="shelf-dur">{formatTime(Number(item.duration) || 0)}</span>
                  <span className="shelf-state">{loaded && on ? <MiniReel on /> : Icon.play}</span>
                </button>
              </motion.li>
            );
          })}
        </ol>
        {footer}
      </div>
    </div>
  );
}
