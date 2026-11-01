"use client";

import NumberFlow from "@number-flow/react";
import { useInView } from "motion/react";
import { useRef } from "react";

/**
 * Count: the in-view NumberFlow counter from Skiper UI skiper37. Digits roll
 * into place once the number scrolls into view, and roll on again whenever
 * the live CMS total changes.
 *
 * License & Usage (Skiper UI):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
export function Count({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <span ref={ref} className={className}>
      <NumberFlow value={inView ? value : 0} transformTiming={{ duration: 1400, easing: "cubic-bezier(.16,1,.3,1)" }} />
    </span>
  );
}
