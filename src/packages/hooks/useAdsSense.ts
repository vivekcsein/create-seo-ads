"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Pushes a Google AdSense `<ins>` element into the `adsbygoogle` render
 * queue once it's mounted. Keyed off `pathname` so client-side navigation
 * (e.g. list -> `[slug]`) re-fires the push for the freshly mounted node
 * instead of silently reusing a stale, already-filled ad slot.
 */
export const useAdsSense = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is an intentional re-trigger key, not a real dependency
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense script not loaded yet (dev/ad-blocked/offline) — fail silently,
      // the reserved-size <ins> just stays empty instead of throwing.
    }
  }, [pathname]);

  return ref;
};
