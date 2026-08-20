"use client";

import { adsConfig } from "@/packages/configs/ads.config";
import { useAdsSense } from "@/packages/hooks/useAdsSense";

type GoogleAdUnitProps = {
  slot: string | undefined;
  /** Fixed pixel size — keeps layout stable (no CLS) while the ad loads. */
  width: number;
  height: number;
  className?: string;
};

/**
 * A single Google AdSense display unit. Renders nothing (rather than an
 * empty box) when ads are disabled or the slot id is missing, so a
 * template without production ad ids doesn't ship broken-looking rails.
 */
export const GoogleAdUnit = ({
  slot,
  width,
  height,
  className,
}: GoogleAdUnitProps) => {
  const { googleAdsEnabled, clientId } = adsConfig.googleAds;
  const ref = useAdsSense<HTMLModElement>();

  if (!adsConfig.enabled || !googleAdsEnabled || !clientId || !slot) {
    return null;
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle ${className ?? ""}`.trim()}
      style={{ display: "inline-block", width, height }}
      data-ad-client={clientId}
      data-ad-slot={slot}
    />
  );
};
