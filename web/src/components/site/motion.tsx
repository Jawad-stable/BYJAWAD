"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Shared motion primitives. One curve for everything: a quick start that
   settles slowly. Under reduced motion, MotionConfig (in Providers) drops
   the movement and keeps the fades. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts its children into place the first time they enter the viewport. */
export function Reveal({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Words rise out of a mask, line by line. Splits on words, never letters,
 * so Arabic keeps its joins. `mount` plays on load; otherwise on first view.
 */
export function MaskText({
  lines,
  mount = false,
  delay = 0,
  stagger = 0.08,
  className,
}: {
  lines: string[];
  mount?: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  let n = 0;
  const play = { y: "0%" };
  // Keyed by its text: a language switch remounts the reveal, so words that
  // are new to the line still get their entrance instead of staying masked.
  return (
    <motion.span
      key={lines.join("|")}
      className={cn("mask-text", className)}
      initial="hidden"
      {...(mount ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
    >
      {lines.map((line, li) => (
        <span key={li} className="mask-line">
          {line.split(" ").map((word, wi, words) => {
            const i = n++;
            // The space sits between the masks: inside one it would collapse.
            return (
              <Fragment key={wi}>
                <span className="mask-word">
                  <motion.span
                    className="mask-inner"
                    variants={{ hidden: { y: "110%" }, shown: play }}
                    transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < words.length - 1 ? " " : null}
              </Fragment>
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/** A paragraph whose words light up one after another as it scrolls through. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  if (reduced) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}

/** A button label that rolls up to a copy of itself on hover. */
export function BtnLabel({ text }: { text: string }) {
  return (
    <span className="btn-label">
      <span data-text={text}>{text}</span>
    </span>
  );
}

/** Section eyebrow and headline, revealed together. */
export function SectionHead({ eyebrow, title, as: Tag = "h2", className }: { eyebrow: string; title: string; as?: "h1" | "h2"; className?: string }) {
  return (
    <div className={cn("section-head", className)}>
      <Reveal y={12}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <Tag className="section-title">
        <MaskText lines={[title]} mount={Tag === "h1"} delay={Tag === "h1" ? 0.1 : 0} />
      </Tag>
    </div>
  );
}
