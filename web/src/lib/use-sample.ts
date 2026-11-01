"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Item } from "./content";

/* One voice sample's playback, following the design system's state table:
   idle, loading, playing, paused, error. Every state comes from the audio
   element's own events, so the reels never run ahead of the sound. */

export type Status = "idle" | "loading" | "playing" | "paused" | "error";

// Starting a sample tells every other one to pause; they keep their place.
const STOP_OTHERS = "voice:play";

export function useSample(item: Item) {
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [slow, setSlow] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(Number(item.duration) || 0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const stop = (e: Event) => {
      if ((e as CustomEvent).detail !== item.id) audio.current?.pause();
    };
    window.addEventListener(STOP_OTHERS, stop);
    return () => window.removeEventListener(STOP_OTHERS, stop);
  }, [item.id]);

  // "Loading" only shows after 300ms, so a quick start never flickers.
  useEffect(() => {
    if (status !== "loading") return;
    const t = setTimeout(() => setSlow(true), 300);
    return () => {
      clearTimeout(t);
      setSlow(false);
    };
  }, [status]);

  // timeupdate fires a few times a second; follow the playhead per frame.
  useEffect(() => {
    if (status !== "playing") return;
    let raf = 0;
    const tick = () => {
      if (audio.current) setTime(audio.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  const play = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    window.dispatchEvent(new CustomEvent(STOP_OTHERS, { detail: item.id }));
    if (status === "error") el.load();
    setStatus("loading");
    el.play().catch((err: DOMException) => setStatus(err?.name === "AbortError" ? "paused" : "error"));
  }, [item.id, status]);

  const toggle = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    if (status === "playing" || status === "loading") el.pause();
    else play();
  }, [play, status]);

  const seekTo = useCallback((seconds: number) => {
    const el = audio.current;
    if (!el) return;
    const apply = () => {
      const max = el.duration || duration;
      const to = Math.min(Math.max(0, seconds), Math.max(0, max - 0.05));
      el.currentTime = to;
      setTime(to);
    };
    if (el.readyState >= 1) apply();
    else {
      el.preload = "metadata";
      el.addEventListener("loadedmetadata", apply, { once: true });
      setTime(Math.max(0, Math.min(seconds, duration)));
    }
  }, [duration]);

  const toggleMute = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }, []);

  const audioProps = {
    ref: audio,
    src: item.fileUrl,
    preload: "none" as const,
    onPlaying: () => setStatus("playing"),
    onWaiting: () => {
      if (audio.current && !audio.current.paused) setStatus("loading");
    },
    onPause: () => {
      if (audio.current && !audio.current.ended) setStatus(s => (s === "error" ? s : "paused"));
    },
    onEnded: () => {
      if (audio.current) audio.current.currentTime = 0;
      setTime(0);
      setStatus("idle");
    },
    onError: () => setStatus("error"),
    onTimeUpdate: (e: React.SyntheticEvent<HTMLAudioElement>) => setTime(e.currentTarget.currentTime),
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLAudioElement>) => setDuration(e.currentTarget.duration || duration),
  };

  return { status, slow, time, duration, muted, toggle, seekTo, toggleMute, audioProps };
}
