"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* One button for the whole site. A liquid fill rises from the bottom edge on
   hover, the label changes ink with it, the button leans toward the pointer,
   and a press gives a small physical give. */

type Variant = "gold" | "ink" | "glass" | "outline";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-navy before:bg-ivory hover:shadow-[0_18px_40px_-16px_rgba(212,175,55,.75)]",
  ink: "bg-foreground text-background before:bg-gold hover:text-navy",
  glass: "bg-ivory/10 text-ivory ring-1 ring-inset ring-ivory/20 backdrop-blur-md before:bg-ivory hover:text-navy",
  outline: "text-foreground ring-1 ring-inset ring-line-strong before:bg-foreground hover:text-background",
};

const base =
  "group/btn relative isolate inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 font-display text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-[color,box-shadow] duration-500 ease-out-expo " +
  "before:absolute before:inset-[-1px] before:-z-10 before:translate-y-[102%] before:rounded-[50%_50%_0_0/100%_100%_0_0] before:transition-[transform,border-radius] before:duration-700 before:ease-out-expo before:content-[''] " +
  "hover:before:translate-y-0 hover:before:rounded-none active:scale-[0.96]";

function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.span
      className="inline-flex"
      style={{ x: sx, y: sy }}
      onPointerMove={e => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

type Common = { variant?: Variant; className?: string; children: ReactNode; magnetic?: boolean };

export function ButtonLink({ variant = "gold", className, children, magnetic = true, href, ...props }: Common & ComponentProps<typeof Link>) {
  const external = typeof href === "string" && /^(https?:|mailto:)/.test(href);
  const el = external ? (
    <a href={href as string} className={cn(base, variants[variant], className)} {...(props as ComponentProps<"a">)}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function Button({ variant = "gold", className, children, magnetic = true, ...props }: Common & ComponentProps<"button">) {
  const el = (
    <button type="button" className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export { Magnetic };

/** Arrow that nudges forward on hover and mirrors for Arabic. */
export function Arrow({ className, diagonal = false }: { className?: string; diagonal?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn(
        "size-4 shrink-0 transition-transform duration-500 ease-out-expo rtl:-scale-x-100",
        diagonal ? "group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" : "group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1",
        className,
      )}
    >
      {diagonal ? <path d="M7 17 17 7M8 7h9v9" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
    </svg>
  );
}
