"use client";

import Link from "next/link";
import { Deck } from "@/components/site/deck";
import { BtnLabel, SectionHead } from "@/components/site/motion";
import { selectContent, useContent } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

/* Voice: the deck the 3D cassette lands in, with the first five tapes. */
export function VoiceSection() {
  const { copy } = useI18n();
  const { voices } = selectContent(useContent());
  if (!voices.length) return null;
  // Featured tapes first, so the one that lands is a featured sample.
  const ordered = [...voices.filter(v => v.featured), ...voices.filter(v => !v.featured)];

  return (
    <section id="voice" className="section voice">
      <div className="wrap">
        <SectionHead eyebrow={copy.voice.label} title={copy.voice.title} />
        <Deck
          items={ordered}
          limit={5}
          footer={
            <Link href="/samples" className="btn btn-line shelf-all">
              <BtnLabel text={copy.voice.all} />
            </Link>
          }
        />
      </div>
    </section>
  );
}
