"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during the static pre-render and hydration, true once on the client. */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
