/**
 * Single source of truth for all Google AdSense config & secrets.
 *
 * Values are read from env vars so nothing sensitive is committed.
 * Add these to your `.env.local` / hosting provider env settings:
 *
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_SIDEBAR_LEFT_SLOT=1234567890
 *   NEXT_PUBLIC_ADSENSE_SIDEBAR_RIGHT_SLOT=0987654321
 *
 * NOTE: these must be prefixed with NEXT_PUBLIC_ because they're read
 * in the browser (AdSense script + <ins> tags render client-side).
 * They are not secret in the security sense — AdSense client/slot ids
 * are visible in any rendered page's HTML — but centralizing them here
 * means there is exactly one place to update if they ever change.
 */

import { envAdsConfig } from "../env/ads.env";

export const adsConfig = {
  enabled: envAdsConfig.enabled,
  googleAds: {
    /** Whether ads should render at all. Handy kill-switch for local/dev/staging. */
    googleAdsEnabled: envAdsConfig.GOOGLE_ADS_ENABLED,
    verificationId: envAdsConfig.GOOGLE_SITE_VERIFICATION,

    /** Your AdSense publisher/client id, e.g. "ca-pub-1234567890123456". */
    clientId: envAdsConfig.GOOGLE_ADSENSE_CLIENT_ID,

    /** Loader script src — the single AdSense script every page needs once. */
    scriptSrc: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",

    sidebar: {
      /** Fixed vertical skyscraper size used for the left/right rail ads. */
      width: 160,
      height: 600,

      left: {
        slot: envAdsConfig.GOOGLE_ADSENSE_SIDEBAR_LEFT_SLOT,
      },
      right: {
        slot: envAdsConfig.GOOGLE_ADSENSE_SIDEBAR_RIGHT_SLOT,
      },
    },
  },

  mediaNetAds: {
    enabled: envAdsConfig.MEDIANET_ADS_ENABLED,
    cid: envAdsConfig.MEDIANET_CID,
    left: {
      slot: envAdsConfig.MEDIANET_LEFT_CRID,
    },
    right: {
      slot: envAdsConfig.MEDIANET_RIGHT_CRID,
    },
  },
} as const;

export type AdsConfig = typeof adsConfig;
