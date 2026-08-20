import Script from "next/script";
import { adsConfig } from "@/packages/configs/ads.config";

/**
 * The single AdSense loader script every page needs once. Reads client id
 * and enable flag from `adsConfig` (single source of truth) so the kill
 * switch and publisher id never drift between the script tag and the
 * `<ins>` units that depend on it.
 */
export const GoogleAdsScript = () => {
  const { googleAdsEnabled, clientId, scriptSrc } = adsConfig.googleAds;

  if (!adsConfig.enabled || !googleAdsEnabled || !clientId) return null;

  return (
    <Script
      id="google-adsense-loader"
      async
      strategy="afterInteractive"
      src={`${scriptSrc}?client=${clientId}`}
      crossOrigin="anonymous"
    />
  );
};
