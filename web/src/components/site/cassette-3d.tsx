"use client";

import { useEffect, useRef } from "react";

/* Loads three.js only on the home page, after first paint, and hands it the
   canvas. Until it is ready (or if WebGL is missing) the flat cassettes in
   the hero and the player stay visible. */
export function Cassette3D() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;
    import("@/lib/cassette-scene").then(({ mountCassette }) => {
      if (!cancelled && canvas.current) cleanup = mountCassette(canvas.current);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <canvas ref={canvas} className="tape-canvas" aria-hidden />;
}
