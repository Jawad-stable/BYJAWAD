"use client";

import { useRef, useState } from "react";
import { MaskText, Reveal } from "@/components/site/motion";
import { Arrow } from "@/components/site/work";
import { useI18n } from "@/lib/i18n";

const EMAIL = "jawad.kh.vo@gmail.com";

/* "Let's talk." set huge, and a paper ticket with the email and channels. */
export function Contact() {
  const { copy } = useI18n();
  const mail = useRef<HTMLAnchorElement>(null);
  const [key, setKey] = useState(copy.contact.copy);
  const [live, setLive] = useState("");
  const channels = [
    { href: "https://wa.me/972595540726", label: copy.contact.whatsapp },
    { href: "https://www.instagram.com/jawad.khamaysa", label: copy.contact.instagram },
    { href: "https://www.youtube.com/@jawad_khamaysa", label: copy.contact.youtube },
  ];

  const reset = (ms: number) =>
    setTimeout(() => {
      setKey(copy.contact.copy);
      setLive("");
    }, ms);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setKey(copy.contact.copied);
      setLive(copy.contact.copiedLive);
      reset(1600);
    } catch {
      const range = document.createRange();
      if (mail.current) range.selectNodeContents(mail.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      setKey(copy.contact.select);
      setLive(copy.contact.selectedLive);
      reset(2400);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="wrap contact-grid">
        <div className="contact-lead">
          <Reveal y={12}>
            <p className="eyebrow">{copy.contact.label}</p>
          </Reveal>
          <h2 className="contact-title">
            <MaskText lines={copy.contact.title.split(" ")} stagger={0.1} />
          </h2>
          <Reveal delay={0.25}>
            <p className="contact-sub">{copy.contact.sub}</p>
          </Reveal>
        </div>

        <Reveal className="ticket" delay={0.15} y={48}>
          <div className="ticket-main">
            <p className="mono-label ticket-kicker">{copy.contact.email}</p>
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
              {channels.map(c => (
                <li key={c.href}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer">
                    {c.label}
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="ticket-stub" aria-hidden>
            <span>{copy.contact.admit}</span>
            <img src="/media/logo-gold.png" alt="" width={44} height={44} />
            <span>{copy.contact.sides}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
