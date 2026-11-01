"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * PlayPill: Skiper UI skiper3, the Apple-style dynamic toggle. Idle it's a
 * round play button; playing, it stretches into a pill that shows a live
 * equaliser beside the pause glyph.
 *
 * License & Usage (Skiper UI):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
const glyph = { initial: { opacity: 0, scale: 0.5, filter: "blur(4px)" }, animate: { opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { opacity: 0, scale: 0.5, filter: "blur(4px)" } };

export function PlayPill({ playing, onClick, label, className }: { playing: boolean; onClick: () => void; label: string; className?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={playing}
      layout
      animate={{ width: playing ? 104 : 56 }}
      transition={{ type: "spring", bounce: 0.18, duration: 0.6 }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "relative flex h-14 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full transition-colors duration-500",
        playing ? "bg-gold text-navy" : "bg-foreground text-background hover:bg-gold hover:text-navy",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {playing && (
          <motion.span key="eq" {...glyph} transition={{ delay: 0.12 }} className="flex h-5 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3].map(i => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-current"
                animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
                transition={{ duration: 1 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout" initial={false}>
        {playing ? (
          <motion.svg key="pause" {...glyph} viewBox="0 0 10 13" className="size-4 fill-current" aria-hidden>
            <path d="M1.04 12.73h1.78c.68 0 1.04-.36 1.04-1.05V1.04C3.86.33 3.5 0 2.82 0H1.04C.36 0 0 .36 0 1.04v10.64c0 .69.36 1.05 1.04 1.05Zm5.68 0h1.77c.69 0 1.04-.36 1.04-1.05V1.04C9.53.33 9.18 0 8.49 0H6.72c-.69 0-1.05.36-1.05 1.04v10.64c0 .69.36 1.05 1.05 1.05Z" />
          </motion.svg>
        ) : (
          <motion.svg key="play" {...glyph} viewBox="-1 0 12 14" className="ms-0.5 size-[18px] fill-current" aria-hidden>
            <path d="M.94 13.24c.31 0 .58-.12.89-.3l9.11-5.27c.65-.38.87-.63.87-1.05 0-.41-.22-.66-.87-1.04L1.83.31C1.52.13 1.25.02.94.02.36.02 0 .45 0 1.13v10.99c0 .68.36 1.12.94 1.12Z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
