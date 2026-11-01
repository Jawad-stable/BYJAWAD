"use client";

import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { StaggerText } from "@/components/vengeance/stagger-text";
import { cn, EASE } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8", className)} {...props} />;
}

/** Fades and lifts its content in once it scrolls into view. */
export function Reveal({ children, delay = 0, className, y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.2em] uppercase rtl:tracking-normal", className)}>
      <span className="size-1.5 rounded-full bg-gold" />
      {children}
    </span>
  );
}

export function SectionHead({ label, title, action, className, invert }: { label: string; title: string; action?: ReactNode; className?: string; invert?: boolean }) {
  return (
    <div className={cn("mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 md:mb-16", className)}>
      <div>
        <Reveal y={12}>
          <Label className={invert ? "text-ivory/60" : "text-muted-foreground"}>{label}</Label>
        </Reveal>
        <h2 className="mt-5 font-display text-[clamp(46px,7vw,112px)] leading-[0.92] font-extrabold tracking-[-0.05em] rtl:leading-[1.2] rtl:font-bold">
          <StaggerText text={title} />
        </h2>
      </div>
      {action && <Reveal delay={0.15}>{action}</Reveal>}
    </div>
  );
}

/** A card that pools a soft light under the pointer and lifts a touch on hover. */
export function SpotCard({
  className,
  children,
  glow = "rgba(212,175,55,.16)",
  lift = true,
  ...props
}: ComponentProps<"div"> & { glow?: string; lift?: boolean }) {
  return (
    <div
      {...props}
      onPointerMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group/card relative isolate overflow-hidden rounded-[30px] transition-[transform,box-shadow] duration-700 ease-out-expo",
        lift && "hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-40px_rgba(11,25,44,.45)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx,50%) var(--my,50%), ${glow}, transparent 65%)` }}
      />
      {children}
    </div>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium ring-1 ring-inset ring-current/15", className)}>
      {children}
    </span>
  );
}
