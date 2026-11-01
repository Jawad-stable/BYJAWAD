"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * HoverExpand: Skiper UI skiper52 (HoverExpand_001). A row of panels where
 * the one you point at opens up and the rest narrow to slivers. Widths are
 * flex ratios here rather than fixed rems, so the row fills any container.
 *
 * License & Usage (Skiper UI):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
export type ExpandPanel = {
  key: string;
  background: ReactNode;
  caption: ReactNode;
  onSelect?: () => void;
  label: string;
};

export function HoverExpand({ panels, className, height = 520 }: { panels: ExpandPanel[]; className?: string; height?: number }) {
  const [active, setActive] = useState(0);

  return (
    <div className={cn("flex w-full gap-2", className)} style={{ height }}>
      {panels.map((panel, index) => {
        const open = active === index;
        return (
          <motion.button
            type="button"
            key={panel.key}
            aria-label={panel.label}
            onHoverStart={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => (open ? panel.onSelect?.() : setActive(index))}
            animate={{ flexGrow: open ? 6 : 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-w-0 basis-0 cursor-pointer overflow-hidden rounded-[28px] text-start outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {panel.background}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent p-6 pt-20"
                >
                  {panel.caption}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
