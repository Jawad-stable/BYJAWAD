"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * TextRoll: Skiper UI skiper58. On hover each letter rolls up and a copy
 * rolls in from below, staggered from the centre outward.
 * Arabic letters join, so Arabic text rolls as one word instead of by letter.
 *
 * License & Usage (Skiper UI):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
const STAGGER = 0.025;
const ARABIC = /[؀-ۿ]/;

export function TextRoll({ children, className, center = false }: { children: string; className?: string; center?: boolean }) {
  const arabic = ARABIC.test(children);
  const parts = arabic ? [children] : children.split("");
  const delayOf = (i: number) => (center ? STAGGER * Math.abs(i - (parts.length - 1) / 2) : STAGGER * i);
  const roll = { ease: [0.76, 0, 0.24, 1] as const, duration: 0.45 };

  return (
    // Latin letters keep their order inside the Arabic layout.
    <motion.span
      initial="initial"
      whileHover="hovered"
      dir={arabic ? "rtl" : "ltr"}
      className={cn("relative inline-block overflow-hidden align-top", className)}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden className="block">
        {parts.map((l, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            variants={{ initial: { y: 0 }, hovered: { y: "-110%" } }}
            transition={{ ...roll, delay: delayOf(i) }}
          >
            {l}
          </motion.span>
        ))}
      </span>
      <span aria-hidden className="absolute inset-0 block">
        {parts.map((l, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            variants={{ initial: { y: "110%" }, hovered: { y: 0 } }}
            transition={{ ...roll, delay: delayOf(i) }}
          >
            {l}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
