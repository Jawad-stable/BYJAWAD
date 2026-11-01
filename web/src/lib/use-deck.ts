"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Item } from "./content";

/* One deck, many tapes. Playback follows the design system's state table
   (idle, loading, playing, paused, error), always from the audio element's
   own events. Loading a different tape swaps the source and plays it. */

export type Status = "idle" | "loading" | "playing" | "paused" | "error";

export function useDeck(items: Item[]) {
  const audio = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [slow, setSlow] = useState(false);
  const [time, setTime] = useState(0);
  const [loadedDuration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const autoplay = useRef(false);

  const item = items[Math.min(index, items.length - 1)];
  const duration = loadedDuration || Number(item?.duration) || 0;

  useEffect(() => {
    if (status !== "loading") return;
    const t = setTimeout(() => setSlow(true), 300);
    return () => {
      clearTimeout(t);
      setSlow(false);
    };
  }, [status]);

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
    setStatus("loading");
    el.play().catch((err: DOMException) => setStatus(err?.name === "AbortError" ? "paused" : "error"));
  }, []);

  // A new tape: the source changes with React; start it once it is set.
  useEffect(() => {
    if (!autoplay.current) return;
    autoplay.current = false;
    play();
  }, [index, play]);

  const select = useCallback(
    (i: number) => {
      const el = audio.current;
      if (!el) return;
      if (i === index) {
        if (status === "playing" || status === "loading") el.pause();
        else {
          if (status === "error") el.load();
          play();
        }
        return;
      }
      el.pause();
      autoplay.current = true;
      setTime(0);
      setDuration(0);
      setStatus("idle");
      setIndex(i);
    },
    [index, play, status],
  );

  const seekTo = useCallback(
    (seconds: number) => {
      const el = audio.current;
      if (!el) return;
      const apply = () => {
        const to = Math.min(Math.max(0, seconds), Math.max(0, (el.duration || duration) - 0.05));
        el.currentTime = to;
        setTime(to);
      };
      if (el.readyState >= 1) apply();
      else el.addEventListener("loadedmetadata", apply, { once: true });
    },
    [duration],
  );

  const toggleMute = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }, []);

  const audioProps = {
    ref: audio,
    src: item?.fileUrl,
    preload: "metadata" as const,
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
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLAudioElement>) => setDuration(e.currentTarget.duration || 0),
  };

  return { index, item, status, slow, time, duration, muted, select, seekTo, toggleMute, audioProps };
}
