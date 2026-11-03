"use client";

import { Card, Check } from "@/components/site/home-sections";
import { MaskText, Reveal } from "@/components/site/motion";
import { useI18n } from "@/lib/i18n";

/* About, as the original site's bento: the brief and the YAML credential
   in a large card, the skills beside it. */
export function About() {
  const { copy } = useI18n();
  const a = copy.about;

  return (
    <section id="about" className="section about">
      <div className="wrap bento about-bento">
        <Card className="about-main">
          <Reveal y={12}>
            <p className="eyebrow">{a.label}</p>
          </Reveal>
          <h2 className="about-title">
            <MaskText text={a.title} stagger={0.05} />
          </h2>
          <div className="about-copy">
            <p className="card-text">{a.p1}</p>
            <p className="about-yaml">
              <span className="card-kicker">{a.yaml.k}</span>
              <bdi>{a.yaml.v}</bdi>
            </p>
          </div>
        </Card>

        <Card className="about-skills" i={1}>
          <p className="card-kicker">{a.skillsTitle}</p>
          <ul className="checks">
            {a.skills.map(s => (
              <li key={s}>
                <Check />
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
