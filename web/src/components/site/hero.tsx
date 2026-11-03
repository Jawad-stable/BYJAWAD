"use client";

import Link from "next/link";
import { useLenis } from "lenis/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { BtnLabel, EASE, MaskText } from "@/components/site/motion";
import { useI18n } from "@/lib/i18n";

/* The stage, in the original site's composition: the portrait on the end
   side melting into navy, the greeting, name, role and two keys on the
   start side. */
export function Hero() {
  const { copy } = useI18n();
  const lenis = useLenis();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sink = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const glide = (id: string) => (e: React.MouseEvent) => {
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(id, { offset: -24 });
  };

  return (
    <section ref={ref} className="stage hero" data-dark>
      <motion.div
        className="hero-photo"
        style={{ y: sink }}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.1 }}
      >
        <img src="/media/portrait.webp" alt={copy.hero.portrait} width={842} height={1264} fetchPriority="high" decoding="async" />
      </motion.div>
      <div className="hero-shade" aria-hidden />

      <div className="wrap hero-inner">
        <motion.div className="hero-copy" style={{ y: lift, opacity: fade }}>
          <h1 className="hero-title">
            <MaskText className="hero-hi" text={copy.hero.hi} mount delay={0.3} />
            <MaskText className="hero-name" lines={[copy.hero.first, copy.hero.last]} mount delay={0.42} stagger={0.12} />
          </h1>
          <motion.p className="hero-role" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}>
            {copy.hero.role}
          </motion.p>
          <motion.div className="hero-keys" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}>
            <Link href="/#voice" className="btn btn-gold" onClick={glide("#voice")}>
              <BtnLabel text={copy.hero.listen} />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon" aria-hidden>
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </Link>
            <Link href="/#contact" className="btn btn-ghost" onClick={glide("#contact")}>
              <BtnLabel text={copy.hero.book} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
