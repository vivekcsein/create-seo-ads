import { envAppConfig } from "../env/app.env";
import { envPublicConfig } from "../env/public.env";

export const appConfig = Object.freeze({
  app: {
    name: envPublicConfig.APP_NAME,
    version: envPublicConfig.APP_VERSION,
    description: envPublicConfig.APP_DESCRIPTION,
    environment: envAppConfig.NODE_ENV,
    locale: "en",
    timezone: "UTC",
  },

  site: {
    url: envPublicConfig.SITE_URL,
    name: envPublicConfig.APP_NAME,
    title: envPublicConfig.SITE_TITLE,
    description: envPublicConfig.APP_DESCRIPTION,

    logoUrl: envPublicConfig.LOGO_URL,
    ogImageUrl: envPublicConfig.OG_IMAGE_URL,

    theme: envPublicConfig.ACTIVE_THEME,
  },

  logging: {
    enabled: envAppConfig.NODE_ENV !== "production",
    stackTrace: envAppConfig.NODE_ENV !== "production",
  },

  headers: {
    requestId: "X-Request-Id",
    traceId: "X-Trace-Id",
    poweredBy: "X-Powered-By",
  },

  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },

  routes: {
    home: "/",
    about: "/about",

    policy: "/policy",
    privacy: "/privacy",

    robots: "/robots.txt",
    sitemap: "/sitemap.xml",
    favicon: "/favicon.ico",
  },

  keywords: [
    // Brand keywords
    "Vivekcse",
    "@vivekcse",

    // core keywords
    "seo",
    "ads",
    "marketing",
    "social media marketing",
    "digital marketing",
    "search engine optimization",
    "ppc",
    "google ads",
    "facebook ads",
    "media.net ads",
    "linkedin ads",
    "online advertising",
    "sem",

    // landing pages & paid campaigns
    "seo services for small business",
    "hire seo expert for website",
    "google ads management for ecommerce",
    "local seo services near me",
    "affordable ppc management",
    "seo and ads package for startups",
    "increase website traffic with seo and ads",
    "seo audit and google ads setup",
    "best seo company for lead generation",
    "ecommerce seo and paid ads services",

    // Service‑specific / Commercial (conversion-focused)
    "seo audit service",
    "on page seo services",
    "technical seo consultant",
    "local seo optimization",
    "google ads campaign setup",
    "facebook ads management",
    "remarketing ads setup",
    "landing page conversion optimization",
    "adwords management service",
    "seo + ppc management",
  ],
});

export type AppConfig = typeof appConfig;
