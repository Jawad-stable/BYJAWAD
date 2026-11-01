"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * StaggerText: Vengence UI "stagger-text". Each word (or letter) rises out
 * of its own mask in sequence. Arabic always splits by word, since splitting
 * Arabic letters breaks how they join.
 * Source: https://www.vengenceui.com/components/stagger-text (open source)
 */
const EASE = [0.16, 1, 0.3, 1] as const;
const ARABIC = /[؀-ۿ]/;

export function StaggerText({
  text,
  className,
  delay = 0,
  by = "word",
  trigger = "view",
  stagger,
}: {
  text: string;
  className?: string;
  delay?: number;
  by?: "word" | "letter";
  trigger?: "view" | "mount";
  stagger?: number;
}) {
  const mode = ARABIC.test(text) ? "word" : by;
  const parts = mode === "letter" ? text.split("") : text.split(" ");
  const step = stagger ?? (mode === "letter" ? 0.028 : 0.07);
  const play = trigger === "mount" ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <motion.span
      className={cn("inline-block", className)}
      initial="hidden"
      {...play}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}
    >
      <span className="sr-only">{text}</span>
      {parts.map((part, i) => (
        <span key={i} aria-hidden className="relative inline-block overflow-hidden pb-[0.12em] align-top -mb-[0.12em]">
          <motion.span
            className="inline-block will-change-transform"
            variants={{ hidden: { y: "115%" }, show: { y: "0%", transition: { duration: 0.9, ease: EASE } } }}
          >
            {mode === "letter" ? (part === " " ? " " : part) : part}
            {mode === "word" && i < parts.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
