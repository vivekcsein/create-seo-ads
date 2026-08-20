import { z } from "zod";

const adsEnvSchema = z.object({
  NEXT_PUBLIC_ADSENSE_ENABLED: z.string().trim().default("true"),

  // Media.net
  NEXT_PUBLIC_MEDIANET_ADS_ENABLED: z.string().trim().default("true"),
  NEXT_PUBLIC_MEDIANET_CID: z.string().trim().default(""),

  NEXT_PUBLIC_MEDIANET_LEFT_CRID: z.string().trim().default(""),

  NEXT_PUBLIC_MEDIANET_RIGHT_CRID: z.string().trim().default(""),

  // Google AdSense — client id looks like "ca-pub-XXXXXXXXXXXXXXXX"
  NEXT_PUBLIC_GOOGLE_ADS_ENABLED: z.string().trim().default("true"),
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: z.string().trim().default(""),

  // Per-placement ad-unit (slot) ids from the AdSense dashboard — used by
  // AdsServices.tsx, the single place that decides what renders left/right.
  NEXT_PUBLIC_GOOGlE_ADSENSE_SIDEBAR_LEFT_SLOT: z.string().trim().default(""),
  NEXT_PUBLIC_GOOGLE_ADSENSE_SIDEBAR_RIGHT_SLOT: z.string().trim().default(""),

  // Google Search Console ownership verification (site/owner-level, not per-ad-unit)
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().trim().default(""),
});

const parsedAdsEnv = adsEnvSchema.safeParse(process.env);

if (!parsedAdsEnv.success) {
  console.error("❌ Invalid ads/verification environment variables:");

  for (const issue of parsedAdsEnv.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  throw new Error("Ads/verification environment validation failed");
}

export const envAdsConfig = Object.freeze({
  enabled: parsedAdsEnv.data.NEXT_PUBLIC_ADSENSE_ENABLED === "true",

  MEDIANET_ADS_ENABLED:
    parsedAdsEnv.data.NEXT_PUBLIC_MEDIANET_ADS_ENABLED === "true",

  MEDIANET_CID: parsedAdsEnv.data.NEXT_PUBLIC_MEDIANET_CID || undefined,
  MEDIANET_LEFT_CRID:
    parsedAdsEnv.data.NEXT_PUBLIC_MEDIANET_LEFT_CRID || undefined,
  MEDIANET_RIGHT_CRID:
    parsedAdsEnv.data.NEXT_PUBLIC_MEDIANET_RIGHT_CRID || undefined,

  GOOGLE_ADS_ENABLED:
    parsedAdsEnv.data.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === "true",
  GOOGLE_ADSENSE_CLIENT_ID:
    parsedAdsEnv.data.NEXT_PUBLIC_ADSENSE_CLIENT_ID || undefined,
  GOOGLE_ADSENSE_SIDEBAR_LEFT_SLOT:
    parsedAdsEnv.data.NEXT_PUBLIC_GOOGlE_ADSENSE_SIDEBAR_LEFT_SLOT || undefined,
  GOOGLE_ADSENSE_SIDEBAR_RIGHT_SLOT:
    parsedAdsEnv.data.NEXT_PUBLIC_GOOGLE_ADSENSE_SIDEBAR_RIGHT_SLOT ||
    undefined,
  GOOGLE_SITE_VERIFICATION:
    parsedAdsEnv.data.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
});

export type EnvAdsConfig = typeof envAdsConfig;
