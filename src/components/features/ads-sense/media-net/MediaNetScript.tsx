import Script from "next/script";
import { adsConfig } from "@/packages/configs/ads.config";

/**
 * Media.net's contextual ads loader, scoped by CID. Mirrors
 * `GoogleAdsScript` — one instance in the root layout, gated by the same
 * `adsConfig.enabled` kill switch.
 */
export const MediaNetScript = () => {
  const { enabled, cid } = adsConfig.mediaNetAds;

  if (!adsConfig.enabled || !enabled || !cid) return null;

  return (
    <Script
      id="medianet-loader"
      async
      strategy="afterInteractive"
      src={`https://contextual.media.net/dmedianet.js?cid=${cid}`}
    />
  );
};
