"use client";

import NumberFlow from "@number-flow/react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE, Reveal, ScrollWords, SectionHead } from "@/components/site/motion";
import { selectContent, useContent } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

/* The short brief: the portrait, a paragraph that lights up as it scrolls,
   three facts and three counts. */
export function About() {
  const { copy } = useI18n();
  const { voices, design, videos } = selectContent(useContent());
  const section = useRef<HTMLElement>(null);
  const stats = useRef<HTMLDListElement>(null);
  const counted = useInView(stats, { once: true, margin: "0px 0px -15% 0px" });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], ["10%", "-6%"]);

  const numbers = [
    { n: voices.length, label: copy.about.stats.reads },
    { n: design.length, label: copy.about.stats.projects },
    { n: videos.length, label: copy.about.stats.films },
  ];

  return (
    <section id="about" ref={section} className="section about">
      {/* Heading, portrait, then the rest: on phones the heading leads; on wide
          screens the portrait takes the first column beside both. */}
      <div className="wrap about-grid">
        <SectionHead className="about-head" eyebrow={copy.about.label} title={copy.about.title} />
        <Reveal className="about-figure" y={40}>
          <motion.img src="/media/portrait.webp" alt={copy.hero.portrait} width={842} height={1264} loading="lazy" style={{ y: lift }} />
        </Reveal>

        <div className="about-body">
          <ScrollWords text={copy.about.brief} className="about-brief" />
          <dl className="about-facts">
            {copy.about.facts.map((f, i) => (
              <motion.div
                key={f.k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
              >
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </motion.div>
            ))}
          </dl>
          <dl ref={stats} className="about-stats">
            {numbers.map(s => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  <NumberFlow value={counted ? s.n : 0} format={{ minimumIntegerDigits: 2 }} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
