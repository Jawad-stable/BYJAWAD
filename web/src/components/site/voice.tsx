"use client";

import { useEffect, useRef, useState } from "react";
import { FlatTape } from "@/components/site/flat-tape";
import { type Item, localize, splitTitle } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { tape } from "@/lib/tape";
import { useSample } from "@/lib/use-sample";
import { cn, formatTime } from "@/lib/utils";

export type Category = "commercial" | "narration";
export function categoryOfVoice(item: Item): Category {
  return /narrat/i.test(localize(item.label || item.category, "en")) ? "narration" : "commercial";
}

function useVoiceMeta(item: Item) {
  const { copy, locale } = useI18n();
  const [main, rest] = splitTitle(localize(item.title, locale));
  return { title: rest || main, client: rest ? main : copy.dialect, category: copy.cat[categoryOfVoice(item)] };
}

export const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8.5 5.2c-.7-.4-1.5.1-1.5.9v11.8c0 .8.8 1.3 1.5.9l10-5.9c.7-.4.7-1.4 0-1.8z" transform="translate(1 0)" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
    <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
  </svg>
);

/** Play and pause stay mounted and cross-fade (design system: transport swap). */
function Transport({ on }: { on: boolean }) {
  return (
    <span className={cn("jk-swap", on && "is-on")} aria-hidden>
      <PlayIcon />
      <PauseIcon />
    </span>
  );
}

function Seek({ time, duration, title, onSeek, onSeeking }: { time: number; duration: number; title: string; onSeek: (s: number) => void; onSeeking: (on: boolean) => void }) {
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
      className="jk-slider"
      role="slider"
      tabIndex={0}
      aria-label={`${copy.player.seek} ${title}`}
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
      <div className="track">
        <div className="fill" style={{ width: `${p * 100}%` }} />
      </div>
      <div className="thumb" style={{ left: `${p * 100}%` }} />
    </div>
  );
}

/** The featured sample. With `docked`, its slot is where the 3D cassette lands. */
export function CassettePlayer({ item, index = 0, docked = false }: { item: Item; index?: number; docked?: boolean }) {
  const { copy } = useI18n();
  const { title, client, category } = useVoiceMeta(item);
  const s = useSample(item);
  const [seeking, setSeeking] = useState(false);
  const progress = s.duration ? s.time / s.duration : 0;
  const on = s.status === "playing" || s.status === "loading";
  const turning = s.status === "playing" && !seeking;

  useEffect(() => {
    if (docked) tape.set({ playing: turning, progress });
  }, [docked, turning, progress]);
  useEffect(() => () => tape.set({ playing: false, progress: 0 }), []);

  const status = s.status === "error" ? copy.player.error : s.status === "loading" && s.slow ? copy.player.loading : "";

  return (
    <article className="player" role="group" aria-label={`${title}, ${client}`} aria-busy={s.status === "loading" || undefined}>
      <div className="player-slot" data-tape-dock={docked || undefined}>
        <FlatTape progress={progress} playing={turning} />
      </div>
      <div className="player-body">
        <p className="mono-label player-cat">
          JK · A{String(index + 1).padStart(2, "0")} · {category}
        </p>
        <h3 className="player-title">{title}</h3>
        <p className="player-client">{client}</p>
        <div className="player-scrub" dir="ltr">
          <Seek time={s.time} duration={s.duration} title={title} onSeek={s.seekTo} onSeeking={setSeeking} />
          <span className="jk-time" aria-hidden>
            {formatTime(s.time)} / {formatTime(s.duration)}
          </span>
        </div>
        <p className="jk-status" role="status">
          {status}
        </p>
        <div className="player-bay">
          <button type="button" className="jk-key jk-key--shell jk-key--round" aria-label={copy.player.back} onClick={() => s.seekTo(s.time - 10)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <button type="button" className="jk-key jk-key--gold jk-key--round jk-key--lg" aria-label={`${on ? copy.player.pause : copy.player.play} ${title}`} onClick={s.toggle}>
            <Transport on={on} />
          </button>
          <button type="button" className="jk-key jk-key--shell jk-key--round" aria-label={copy.player.mute} aria-pressed={s.muted} onClick={s.toggleMute}>
            <span className={cn("jk-mute", s.muted && "is-on")} aria-hidden>
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
      </div>
      <audio {...s.audioProps} preload="metadata" />
    </article>
  );
}

/** A sample in the library: small cassette, title, label, counter, play key. */
export function CassetteMini({ item }: { item: Item }) {
  const { copy } = useI18n();
  const { title, client, category } = useVoiceMeta(item);
  const s = useSample(item);
  const on = s.status === "playing" || s.status === "loading";
  const counter =
    s.status === "error" ? copy.player.cantPlay : s.status === "loading" && s.slow ? copy.player.loading : `${formatTime(s.time)} / ${formatTime(s.duration)}`;

  return (
    <article className={cn("jk-mini", on && "is-playing")}>
      <div className="jk-mini-shell">
        <FlatTape progress={s.duration ? s.time / s.duration : 0} playing={s.status === "playing"} />
      </div>
      <div className="jk-mini-meta">
        <strong>{title}</strong>
        <span>{client}</span>
      </div>
      <div className="jk-mini-end">
        <span className="jk-tag" data-side="a">
          {category}
        </span>
        <span className="jk-time">{counter}</span>
        <button type="button" className="jk-key jk-key--gold jk-key--round" aria-label={`${on ? copy.player.pause : copy.player.play} ${title}`} onClick={s.toggle}>
          <Transport on={on} />
        </button>
      </div>
      <p className="sr-only" role="status">
        {s.status === "error" ? copy.player.error : ""}
      </p>
      <audio {...s.audioProps} />
    </article>
  );
}
