"use client";

import { useMemo } from "react";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

/**
 * PerspectiveGrid: Vengence UI "perspective-grid", recoloured for the navy
 * hero. A tilted floor of tiles; the tile under the pointer lights gold and
 * fades back slowly, leaving a trail.
 * Source: https://www.vengenceui.com/components/perspective-grid (open source)
 */
export function PerspectiveGrid({ className, size = 26 }: { className?: string; size?: number }) {
  // Tiles are client-only: hundreds of empty divs add nothing to the static HTML.
  const mounted = useMounted();
  const tiles = useMemo(() => Array.from({ length: size * size }), [size]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} style={{ perspective: "2000px", transformStyle: "preserve-3d" }}>
      <div
        className="absolute grid aspect-square w-[80rem] origin-center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(2)",
          transformStyle: "preserve-3d",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {mounted &&
          tiles.map((_, i) => (
            <div
              key={i}
              className="min-h-px min-w-px border border-ivory/[0.06] bg-transparent transition-colors duration-[1600ms] hover:bg-gold/40 hover:duration-0"
            />
          ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,transparent_15%,var(--navy)_75%)]" />
    </div>
  );
}
