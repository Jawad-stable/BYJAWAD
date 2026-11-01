"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* Two bands of services drifting in opposite directions. Scrolling speeds
   them up and turns them with the scroll, then they ease back to a cruise. */

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function Band({ words, base, outline }: { words: string[]; base: number; outline?: boolean }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  const pos = useTransform(x, v => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = direction.current * base * (delta / 1000);
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    move += direction.current * move * b;
    x.set(x.get() + move);
  });

  const run = [...words, ...words];
  return (
    <div className="flex overflow-hidden whitespace-nowrap" dir="ltr">
      <motion.div style={{ x: pos }} className="flex shrink-0">
        {[0, 1].map(copy => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span
                  className={cn(
                    "px-6 font-display text-[clamp(44px,7vw,108px)] leading-none font-extrabold tracking-[-0.045em] rtl:font-bold",
                    outline ? "text-transparent [-webkit-text-stroke:1.5px_var(--line-strong)]" : "text-foreground",
                  )}
                >
                  {word}
                </span>
                <span className="size-3 shrink-0 rounded-full bg-gold" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  const { copy } = useI18n();
  const half = Math.ceil(copy.marquee.length / 2);
  return (
    <section aria-hidden className="relative overflow-hidden pb-4 pt-14 md:pt-20">
      <div className="flex flex-col gap-2 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <Band words={copy.marquee.slice(0, half)} base={-2.2} />
        <Band words={copy.marquee.slice(half)} base={2.2} outline />
      </div>
    </section>
  );
}
