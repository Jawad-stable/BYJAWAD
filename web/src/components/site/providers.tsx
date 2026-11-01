"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { MediaProvider } from "@/components/site/media-provider";
import { I18nProvider } from "@/lib/i18n";

/* Smooth scroll with a light touch; under reduced motion the wheel goes back
   to the browser's own scrolling (Lenis rebuilds when its options change). */
function Scroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const options = reduced ? { lerp: 1, smoothWheel: false } : { lerp: 0.1, smoothWheel: true };
  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <I18nProvider>
        <MotionConfig reducedMotion="user">
          <Scroll>
            <MediaProvider>{children}</MediaProvider>
          </Scroll>
        </MotionConfig>
      </I18nProvider>
    </ThemeProvider>
  );
}
