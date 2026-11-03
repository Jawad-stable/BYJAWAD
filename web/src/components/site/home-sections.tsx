"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Deck } from "@/components/site/deck";
import { FlatTape } from "@/components/site/flat-tape";
import { BtnLabel, EASE, MaskText, SectionHead } from "@/components/site/motion";
import { Arrow } from "@/components/site/work";
import { selectContent, useContent } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/** A bento card that rises into place, a beat after the one before it. */
export function Card({ children, className, i = 0, href, external }: { children: ReactNode; className?: string; i?: number; href?: string; external?: boolean }) {
  const anim = {
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -8% 0px" },
    transition: { duration: 0.9, ease: EASE, delay: (i % 4) * 0.08 },
  };
  if (href)
    return (
      <motion.a href={href} className={cn("card", className)} {...anim} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </motion.a>
    );
  return (
    <motion.div className={cn("card", className)} {...anim}>
      {children}
    </motion.div>
  );
}

/* Voice: the 3D cassette rests beside the title ([data-tape-hero], drag to
   spin) and drops into the deck below it, then what the voice covers and
   the way in, laid out as the original site's bento. */
export function VoiceSection() {
  const { copy } = useI18n();
  const { voices } = selectContent(useContent());
  if (!voices.length) return null;
  const v = copy.voice;
  // Featured tapes first, so the one that lands is a featured sample.
  const ordered = [...voices.filter(t => t.featured), ...voices.filter(t => !t.featured)];

  return (
    <section id="voice" className="section voice">
      <div className="wrap">
        <div className="voice-head">
          <SectionHead eyebrow={v.label} title={v.title} />
          <div className="stage-tape voice-tape" data-tape-hero title={copy.hero.spin}>
            <FlatTape />
          </div>
        </div>
        <Deck
          items={ordered}
          limit={5}
          footer={
            <Link href="/samples" className="btn btn-line shelf-all">
              <BtnLabel text={v.all} />
            </Link>
          }
        />

        <div className="bento voice-bento">
          <Card className="voice-dialects">
            <p className="card-kicker">{v.dialectsTitle}</p>
            <ul className="spec">
              {v.dialects.map(d => (
                <li key={d.name}>
                  <strong>{d.name}</strong>
                  <span>{d.level}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="voice-formats" i={1}>
            <p className="card-kicker">{v.formatsTitle}</p>
            <ul className="spec">
              {v.formats.map(([name, where]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{where}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="card--navy voice-cta" i={2}>
            <h3 className="card-title voice-cta-title">
              <MaskText text={v.cta.title} stagger={0.06} />
            </h3>
            <div className="voice-cta-keys">
              <Link href="/#contact" className="btn btn-gold">
                <BtnLabel text={v.cta.quote} />
              </Link>
              <Link href="/samples" className="btn btn-ghost">
                <BtnLabel text={v.cta.more} />
              </Link>
            </div>
          </Card>
          <Card className="voice-studio" i={3}>
            <p className="card-kicker">{v.studio.title}</p>
            <ul className="checks">
              {v.studio.items.map(item => (
                <li key={item}>
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

const YouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15.1V8.9l5.8 3.1z" />
  </svg>
);
const Instagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/* Channels: where the work and the process live, two cards. */
export function Channels() {
  const { copy } = useI18n();
  const c = copy.socials;
  return (
    <section className="section channels">
      <div className="wrap">
        <SectionHead eyebrow={c.label} title={c.title} />
        <div className="bento">
          {c.cards.map((card, i) => (
            <Card key={card.href} href={card.href} external i={i} className={cn("channel", i === 0 ? "card--navy" : "channel--light")}>
              <span className="channel-icon">{i === 0 ? <YouTube /> : <Instagram />}</span>
              <p className="card-kicker">{card.kicker}</p>
              <h3 className="card-title">
                <bdi>{card.name}</bdi>
              </h3>
              <p className="card-text">{card.desc}</p>
              <span className="card-open">
                {c.open}
                <Arrow />
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
