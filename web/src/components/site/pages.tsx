"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Cassette3D } from "@/components/site/cassette-3d";
import { categoryOfVoice, Deck } from "@/components/site/deck";
import { BtnLabel, EASE, MaskText, SectionHead } from "@/components/site/motion";
import { type Filter, FilterSwitch, Sleeve } from "@/components/site/work";
import { categoryOf, selectContent, useContent } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

function CtaBand({ title }: { title: string }) {
  const { copy } = useI18n();
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-band" data-dark>
          <h2>
            <MaskText lines={[title]} />
          </h2>
          <Link href="/#contact" className="btn btn-gold">
            <BtnLabel text={copy.nav.book} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProjectsView() {
  const { copy } = useI18n();
  const { design, videos, social, comingSoon } = selectContent(useContent());
  const all = useMemo(() => [...design, ...videos, ...social], [design, videos, social]);
  const [active, setActive] = useState("all");

  // Counts come from the same list the grid renders; empty filters are hidden.
  const filters: Filter[] = (["all", "brand", "print", "motion", "social"] as const)
    .map(key => ({ key, label: copy.projects.filters[key], count: key === "all" ? all.length : all.filter(i => categoryOf(i) === key).length }))
    .filter(f => f.key === "all" || f.count > 0);
  const shown = active === "all" ? all : all.filter(i => categoryOf(i) === active);

  return (
    <main className="page">
      <div className="wrap page-head">
        <SectionHead as="h1" eyebrow={copy.projects.label} title={copy.projects.title} />
        {!comingSoon && <FilterSwitch id="work" label={copy.projects.label} filters={filters} active={active} onChange={setActive} />}
      </div>
      <div className="wrap">
        {comingSoon ? (
          <p className="page-empty">{copy.projects.soon}</p>
        ) : (
          <div className="sleeve-grid">
            {shown.map((item, i) => (
              <motion.div
                key={`${active}-${item.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
              >
                <Sleeve item={item} index={(item.type === "video" ? videos : design).indexOf(item)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <CtaBand title={copy.projects.cta} />
    </main>
  );
}

export function SamplesView() {
  const { copy } = useI18n();
  const { voices } = selectContent(useContent());
  const [active, setActive] = useState("all");
  const filters: Filter[] = (["all", "commercial", "narration"] as const)
    .map(key => ({
      key,
      label: copy.samples.filters[key],
      count: key === "all" ? voices.length : voices.filter(v => categoryOfVoice(v) === key).length,
    }))
    .filter(f => f.key === "all" || f.count > 0);

  return (
    <main className="page">
      <div className="wrap page-head">
        <SectionHead as="h1" eyebrow={copy.samples.label} title={copy.samples.title} />
        <FilterSwitch id="voice" label={copy.samples.label} filters={filters} active={active} onChange={setActive} />
      </div>
      <div className="wrap voice">
        <Deck items={voices} visible={active === "all" ? undefined : v => categoryOfVoice(v) === active} />
      </div>
      <CtaBand title={copy.samples.cta} />
      <Cassette3D />
    </main>
  );
}
