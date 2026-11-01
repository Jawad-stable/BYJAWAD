/* The tape deck and the 3D cassette share one small piece of state: what is
   loaded (title, client, script direction), whether it is playing, how far
   through it is, and a counter that ticks each time a new tape goes in. The
   3D scene reads it every frame; the deck writes it from its audio events. */

export type TapeState = {
  playing: boolean;
  progress: number;
  title: string;
  client: string;
  rtl: boolean;
  swap: number;
};

let state: TapeState = { playing: false, progress: 0, title: "", client: "", rtl: false, swap: 0 };
const listeners = new Set<() => void>();

export const tape = {
  get: () => state,
  set(next: Partial<TapeState>) {
    const keys = Object.keys(next) as (keyof TapeState)[];
    if (keys.every(k => next[k] === state[k])) return;
    state = { ...state, ...next };
    listeners.forEach(fn => fn());
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
