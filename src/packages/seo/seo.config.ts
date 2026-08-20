import type { Metadata } from "next";
import { appConfig } from "@/packages/configs/app.config";
import { adsConfig } from "../configs/ads.config";

const { site, app, keywords } = appConfig;

/** Absolute URL helper — Next resolves relative OG/icon paths against metadataBase too, but explicit is safer for social crawlers that don't. */
const absoluteUrl = (path: string) => new URL(path, site.url).toString();

const GOOGLE_SITE_VERIFICATION = adsConfig.googleAds.verificationId;

const ogImage = site.ogImageUrl
  ? absoluteUrl(site.ogImageUrl)
  : absoluteUrl(site.logoUrl);

/**
 * Base metadata applied site-wide via the root layout. Individual routes can
 * spread this and override specific fields (title, description) as the app
 * grows beyond a single page.
 */

export const seoConfig: Metadata = {
  metadataBase: new URL(site.url),

  title: {
    default: site.title,
    template: `%s · ${app.name}`,
  },
  description: site.description,
  applicationName: app.name,
  keywords,
  category: "technology",

  // Google Search Console ownership verification — set
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to enable; omitted entirely
  // (rather than rendered empty) when unset.
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: site.url,
    siteName: app.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${app.name} — Master Every Roleplay On Every Server`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [ogImage],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: site.logoUrl,
  },

  manifest: "/manifest.webmanifest",
};
