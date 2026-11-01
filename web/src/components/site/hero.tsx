"use client";

import Link from "next/link";
import { useLenis } from "lenis/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { FlatTape } from "@/components/site/flat-tape";
import { BtnLabel, EASE, MaskText } from "@/components/site/motion";
import { useI18n } from "@/lib/i18n";

/* The stage: the name, two keys and the 3D cassette, nothing else. The
   [data-tape-hero] box is where the cassette floats (drag it to spin) until
   the scroll carries it down into the deck. */
export function Hero() {
  const { copy } = useI18n();
  const lenis = useLenis();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const glide = (id: string) => (e: React.MouseEvent) => {
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(id, { offset: -24 });
  };

  return (
    <section ref={ref} className="stage" data-dark>
      <div className="wrap stage-inner">
        <motion.div className="stage-copy" style={{ y: lift, opacity: fade }}>
          <h1 className="stage-name">
            <MaskText lines={[copy.hero.first, copy.hero.last]} mount delay={0.1} stagger={0.12} />
          </h1>
          <motion.div
            className="stage-keys"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
          >
            <Link href="/#contact" className="btn btn-gold" onClick={glide("#contact")}>
              <BtnLabel text={copy.hero.book} />
            </Link>
            <Link href="/#voice" className="btn btn-ghost" onClick={glide("#voice")}>
              <BtnLabel text={copy.hero.listen} />
            </Link>
          </motion.div>
        </motion.div>
        <div className="stage-tape" data-tape-hero title={copy.hero.spin}>
          <FlatTape />
        </div>
      </div>
    </section>
  );
}
