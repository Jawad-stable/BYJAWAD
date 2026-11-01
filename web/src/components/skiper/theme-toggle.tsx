"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useI18n } from "@/lib/i18n";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

/**
 * Theme toggle: Skiper UI ThemeToggleButton2 (skiper4), wired to next-themes.
 * The new theme spreads out in a circle from the button.
 *
 * License & Usage (Skiper UI):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { copy } = useI18n();
  const isDark = useMounted() && resolvedTheme === "dark";

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) return setTheme(next);

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add("vt-theme");
    const t = document.startViewTransition(() => {
      setTheme(next);
      // next-themes updates the class on the next tick; apply it now so the
      // transition captures the finished theme.
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
    });
    t.ready
      .then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 800, easing: "cubic-bezier(.16,1,.3,1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
    t.finished.catch(() => {}).finally(() => root.classList.remove("vt-theme"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? copy.theme.toLight : copy.theme.toDark}
      aria-pressed={isDark}
      className={cn(
        "grid size-10 place-items-center rounded-full p-2.5 text-foreground transition-colors duration-300 hover:bg-foreground/[0.07] active:scale-95",
        className,
      )}
    >
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" strokeLinecap="round" viewBox="0 0 32 32" className="size-full">
        <clipPath id="theme-toggle-clip">
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>
        <g clipPath="url(#theme-toggle-clip)">
          <motion.circle animate={{ r: isDark ? 10 : 8 }} transition={{ ease: "easeInOut", duration: 0.35 }} cx="16" cy="16" />
          <motion.g
            animate={{ rotate: isDark ? -100 : 0, scale: isDark ? 0.5 : 1, opacity: isDark ? 0 : 1 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
}
