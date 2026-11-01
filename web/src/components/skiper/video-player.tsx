"use client";

import { useLenis } from "lenis/react";
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
} from "media-chrome/react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * VideoPlayer and VideoPopOver: Skiper UI skiper67, built on media-chrome.
 * A "Play" label follows the cursor over the poster; clicking opens the film
 * in a blurred overlay with a minimal control bar.
 *
 * License & Usage (Skiper UI):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */

export function CursorPlay({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const spring = { mass: 0.1, stiffness: 300, damping: 30 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const opacity = useSpring(0, spring);
  return (
    <div
      className={cn("relative", className)}
      onPointerMove={e => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        opacity.set(1);
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => opacity.set(0)}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ x, y, opacity }}
        className="pointer-events-none absolute left-0 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-ivory px-4 py-2 text-sm font-semibold text-navy shadow-xl"
      >
        <svg viewBox="-1 0 12 14" className="size-3 fill-current" aria-hidden>
          <path d="M.94 13.24c.31 0 .58-.12.89-.3l9.11-5.27c.65-.38.87-.63.87-1.05 0-.41-.22-.66-.87-1.04L1.83.31C1.52.13 1.25.02.94.02.36.02 0 .45 0 1.13v10.99c0 .68.36 1.12.94 1.12Z" />
        </svg>
        {label}
      </motion.div>
    </div>
  );
}

export type VideoSource = { src: string; poster?: string; width?: number; height?: number; title: string };

export function VideoPopOver({ video, onClose, closeLabel }: { video: VideoSource | null; onClose: () => void; closeLabel: string }) {
  const lenis = useLenis();
  useEffect(() => {
    if (!video) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [video, lenis, onClose]);

  const ratio = video?.width && video?.height ? video.width / video.height : 16 / 9;

  return (
    <AnimatePresence>
      {video && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={video.title} data-lenis-prevent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-navy/85 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 overflow-hidden rounded-3xl bg-black shadow-2xl"
            style={{ aspectRatio: ratio, width: `min(92vw, calc(84svh * ${ratio}))` }}
          >
            <MediaController className="block size-full">
              <video slot="media" src={video.src} poster={video.poster} autoPlay playsInline className="size-full object-contain" />
              <MediaControlBar className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-10">
                <MediaPlayButton className="rounded-full p-2" />
                <MediaTimeRange className="flex-1 [--media-range-thumb-opacity:0] [--media-range-track-height:3px]" />
                <MediaTimeDisplay showDuration className="px-2 text-xs" />
                <MediaMuteButton className="rounded-full p-2" />
                <MediaFullscreenButton className="rounded-full p-2" />
              </MediaControlBar>
            </MediaController>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute end-3 top-3 z-20 grid size-10 place-items-center rounded-full bg-black/50 text-ivory backdrop-blur transition hover:bg-ivory hover:text-navy active:scale-90"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
