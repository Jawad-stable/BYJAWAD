"use client";

import { motion } from "motion/react";
import { StackCards } from "@/components/skiper/stack-cards";
import { Container, SectionHead } from "@/components/site/ui";
import { coverOf, selectContent, useContent } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const BARS = [38, 62, 84, 50, 72, 96, 44, 78, 58, 90, 36, 66, 80, 52, 42, 98, 34, 70, 86, 48, 74, 56, 38, 92, 62, 78];

function VoiceVisual() {
  return (
    <div className="flex h-40 items-center gap-1.5 md:h-56" aria-hidden>
      {BARS.map((h, i) => (
        <motion.span
          key={i}
          className="w-full rounded-full bg-gold"
          style={{ height: `${h}%` }}
          animate={{ scaleY: [1, 0.35 + (i % 5) * 0.12, 1] }}
          transition={{ duration: 1.4 + (i % 4) * 0.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

function CoversVisual({ covers }: { covers: string[] }) {
  return (
    <div className="relative h-56 w-full md:h-80" aria-hidden>
      {covers.slice(0, 3).map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          initial={{ rotate: 0, x: 0 }}
          whileInView={{ rotate: (i - 1) * 9, x: `${(i - 1) * 34}%` }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="absolute start-1/2 top-1/2 h-[78%] w-auto max-w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-lg object-contain shadow-[0_30px_60px_-20px_rgba(11,25,44,.55)] rtl:translate-x-1/2"
          style={{ zIndex: i === 1 ? 3 : 1 }}
        />
      ))}
    </div>
  );
}

function PosterVisual({ poster }: { poster: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(11,25,44,.6)]" aria-hidden>
      {poster && <img src={poster} alt="" loading="lazy" className="size-full object-cover" />}
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-16 place-items-center rounded-full bg-ivory/90 text-navy backdrop-blur">
          <svg viewBox="-1 0 12 14" className="ms-0.5 size-5 fill-current">
            <path d="M.94 13.24c.31 0 .58-.12.89-.3l9.11-5.27c.65-.38.87-.63.87-1.05 0-.41-.22-.66-.87-1.04L1.83.31C1.52.13 1.25.02.94.02.36.02 0 .45 0 1.13v10.99c0 .68.36 1.12.94 1.12Z" />
          </svg>
        </span>
      </span>
    </div>
  );
}

export function Services() {
  const { copy } = useI18n();
  const { design, videos } = selectContent(useContent());
  const covers = [design[4], design[0], design[1]].filter(Boolean).map(coverOf).filter(Boolean);
  const poster = videos[0] ? coverOf(videos[0]) : "";

  const tones = [
    "grain bg-navy text-ivory",
    "bg-gold text-navy",
    "bg-copper text-navy",
  ];
  const visuals = [<VoiceVisual key="v" />, <CoversVisual key="c" covers={covers} />, <PosterVisual key="p" poster={poster} />];

  return (
    <section className="relative pt-24 md:pt-36">
      <Container>
        <SectionHead label={copy.services.label} title={copy.services.title} />
      </Container>
      <Container className="pb-[4vh]">
        <StackCards>
          {copy.services.items.map((item, i) => (
            <article
              key={item.title}
              className={cn(
                "relative mx-auto grid min-h-[min(74svh,620px)] w-full overflow-hidden rounded-[36px] p-7 md:grid-cols-2 md:items-center md:gap-12 md:p-14",
                tones[i],
              )}
            >
              <div className="relative flex h-full flex-col justify-between gap-10">
                <span className="font-display text-sm font-semibold tracking-[0.2em] opacity-60">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-[clamp(44px,6vw,92px)] leading-[0.92] font-extrabold tracking-[-0.05em] rtl:leading-[1.2] rtl:font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-lg opacity-70">{item.line}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="rounded-full px-4 py-2 text-[13px] font-medium ring-1 ring-current/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative mt-8 md:mt-0">{visuals[i]}</div>
            </article>
          ))}
        </StackCards>
      </Container>
    </section>
  );
}
