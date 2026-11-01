import { cn } from "@/lib/utils";

/* The cassette drawn flat, to the same layout as the 3D model (one SVG unit
   per 0.1mm). It stands in wherever the 3D cassette isn't: without WebGL,
   in the player under reduced motion, and in the small library rows. */

const PACK = { min: 42, max: 72 };
const REELS = [502 - 162, 502 + 162];

function Reel({ x, pack }: { x: number; pack: number }) {
  return (
    <g>
      <circle cx={x} cy={264} r={pack} fill="#3b2a1f" />
      <g className="flat-tape-hub">
        <circle cx={x} cy={264} r={37} fill="#f4f0e6" />
        <circle cx={x} cy={264} r={13} fill="#14171c" />
        {[90, 210, 330].map(a => (
          <circle key={a} cx={+(x + Math.cos((a * Math.PI) / 180) * 23).toFixed(2)} cy={+(264 - Math.sin((a * Math.PI) / 180) * 23).toFixed(2)} r={7} fill="#14171c" />
        ))}
      </g>
    </g>
  );
}

export function FlatTape({ progress = 0, playing = false, className }: { progress?: number; playing?: boolean; className?: string }) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <svg viewBox="0 0 1004 638" className={cn("flat-tape", playing && "is-playing", className)} aria-hidden>
      <rect width="1004" height="638" rx="38" fill="#262d39" />
      <rect x="54.5" y="31.5" width="895" height="455" rx="28" fill="#f2eee3" />
      <rect x="54.5" y="250.5" width="895" height="17" fill="#d4af37" />
      <rect x="54.5" y="267.5" width="895" height="17" fill="#c88568" />
      <rect x="54.5" y="284.5" width="895" height="17" fill="#94b0c7" />
      <rect x="250" y="177" width="504" height="174" rx="87" fill="#323a48" />
      <rect x="257" y="184" width="490" height="160" rx="80" fill="#0f1217" />
      <rect x="424.5" y="225" width="155" height="78" rx="6" fill="#1d222a" />
      <Reel x={REELS[0]} pack={PACK.max - (PACK.max - PACK.min) * p} />
      <Reel x={REELS[1]} pack={PACK.min + (PACK.max - PACK.min) * p} />
      <polygon points="192,633 812,633 752,520 252,520" fill="#323a48" />
      <circle cx="287" cy="595" r="17" fill="#14171c" />
      <circle cx="717" cy="595" r="17" fill="#14171c" />
      <rect x="418" y="566" width="24" height="24" fill="#14171c" />
      <rect x="562" y="566" width="24" height="24" fill="#14171c" />
      {[
        [42, 42],
        [962, 42],
        [42, 596],
        [962, 596],
        [502, 548],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={13} fill="#a3aab4" />
      ))}
    </svg>
  );
}
