"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/site/home-sections";
import { BtnLabel, MaskText, SectionHead } from "@/components/site/motion";
import { Arrow } from "@/components/site/work";
import { useI18n } from "@/lib/i18n";

const EMAIL = "jawad.kh.vo@gmail.com";

/* Contact, as the original site's bento: the paper ticket with the email
   and channels, the navy "ready when you are" card, and three facts. */
export function Contact() {
  const { copy } = useI18n();
  const c = copy.contact;
  const mail = useRef<HTMLAnchorElement>(null);
  // The state, not its label, so the key follows a language switch.
  const [state, setState] = useState<"idle" | "copied" | "select">("idle");
  const key = { idle: c.copy, copied: c.copied, select: c.select }[state];
  const live = { idle: "", copied: c.copiedLive, select: c.selectedLive }[state];
  const channels = [
    { href: "https://wa.me/972595540726", label: c.whatsapp, value: "+972 595 540 726" },
    { href: "https://www.instagram.com/jawad.khamaysa", label: c.instagram, value: "@jawad.khamaysa" },
    { href: "https://www.youtube.com/@jawad_khamaysa", label: c.youtube, value: "Jawad Khamaysa" },
  ];

  const reset = (ms: number) => setTimeout(() => setState("idle"), ms);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setState("copied");
      reset(1600);
    } catch {
      const range = document.createRange();
      if (mail.current) range.selectNodeContents(mail.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      setState("select");
      reset(2400);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="wrap">
        <SectionHead eyebrow={c.label} title={c.title} />
        <div className="bento contact-bento">
          <Card className="ticket">
            <div className="ticket-main">
              <p className="mono-label ticket-kicker">{c.email}</p>
              <div className="ticket-mail" dir="ltr">
                <a ref={mail} href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
                <button type="button" className="btn btn-line" onClick={copyEmail}>
                  {key}
                </button>
                <span className="sr-only" role="status">
                  {live}
                </span>
              </div>
              <ul className="ticket-links">
                {channels.map(ch => (
                  <li key={ch.href}>
                    <a href={ch.href} target="_blank" rel="noopener noreferrer">
                      <span>{ch.label}</span>
                      <small>
                        <bdi>{ch.value}</bdi>
                      </small>
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ticket-stub" aria-hidden>
              <img src="/media/logo-gold.png" alt="" width={44} height={44} />
              <span>{c.reach}</span>
            </div>
          </Card>

          <Card className="card--navy contact-ready" i={1}>
            <h3 className="contact-ready-title">
              <MaskText text={c.ready.title} stagger={0.08} />
            </h3>
            <p className="card-text">{c.ready.sub}</p>
            <a href={`mailto:${EMAIL}`} className="btn btn-gold">
              <BtnLabel text={c.ready.button} />
              <Arrow />
            </a>
          </Card>

          {c.bottom.map(([k, v], i) => (
            <Card key={k} className="contact-fact" i={2 + i}>
              <p className="card-kicker">{k}</p>
              <p className="contact-fact-value">{v}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
