"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * StackCards: Skiper UI skiper16 (StickyCard_001). Each card pins as you
 * scroll and the ones beneath ease back in scale, so the stack builds up like
 * pages being laid down.
 *
 * License & Usage (Skiper UI):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
export function StackCards({ children }: { children: ReactNode[] }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });

  return (
    <div ref={container} className="relative">
      {children.map((child, i) => (
        <StackCard
          key={i}
          i={i}
          progress={scrollYProgress}
          range={[i / children.length, 1]}
          targetScale={1 - (children.length - i - 1) * 0.06}
        >
          {child}
        </StackCard>
      ))}
    </div>
  );
}

function StackCard({
  i,
  progress,
  range,
  targetScale,
  children,
}: {
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  children: ReactNode;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  const dim = useTransform(progress, range, [0, i === 0 ? 0.28 : 0.18]);
  return (
    <div className="sticky top-0 flex h-svh items-start justify-center pt-[12svh]">
      <motion.div style={{ scale, top: `${i * 26}px` }} className="relative w-full origin-top">
        {children}
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 rounded-[36px] bg-navy" />
      </motion.div>
    </div>
  );
}
