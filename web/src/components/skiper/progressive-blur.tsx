import { cn } from "@/lib/utils";

/**
 * ProgressiveBlur: Skiper UI skiper41, after Rauno Freiberg. Content softens
 * as it slides under the edge instead of being cut by a hard line.
 *
 * License & Usage (Skiper UI):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
export function ProgressiveBlur({
  className,
  position = "top",
  height = "120px",
  blur = "6px",
  tint = "var(--background)",
}: {
  className?: string;
  position?: "top" | "bottom";
  height?: string;
  blur?: string;
  tint?: string;
}) {
  const top = position === "top";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none left-0 w-full select-none", className)}
      style={{
        [top ? "top" : "bottom"]: 0,
        height,
        background: `linear-gradient(${top ? "to top" : "to bottom"}, transparent, color-mix(in srgb, ${tint} 70%, transparent))`,
        maskImage: `linear-gradient(${top ? "to bottom" : "to top"}, black 45%, transparent)`,
        WebkitMaskImage: `linear-gradient(${top ? "to bottom" : "to top"}, black 45%, transparent)`,
        backdropFilter: `blur(${blur})`,
        WebkitBackdropFilter: `blur(${blur})`,
      }}
    />
  );
}
