import { z } from "zod";

const publicEnvSchema = z.object({
  // App
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("create-seo-ads"),

  NEXT_PUBLIC_APP_VERSION: z.string().trim().default("1.0.4"),

  NEXT_PUBLIC_APP_DESCRIPTION: z
    .string()
    .trim()
    .min(1)
    .default("A template for creating SEO-optimized ads pages with Next.js"),

  // Site
  NEXT_PUBLIC_SITE_URL: z.url().trim().default("http://localhost:3000"),

  NEXT_PUBLIC_SITE_TITLE: z
    .string()
    .trim()
    .min(1)
    .default("Top 1% Seo And Ads Template by vivekcsein"),

  NEXT_PUBLIC_LOGO_URL: z.string().trim().default("/logo.png"),

  NEXT_PUBLIC_OG_IMAGE_URL: z.string().trim().optional(),

  // Theme

  NEXT_PUBLIC_ACTIVE_THEME: z.enum(["system", "light", "dark"]).default("dark"),
});

const parsedPublicEnv = publicEnvSchema.safeParse(process.env);

if (!parsedPublicEnv.success) {
  console.error("❌ Invalid public environment variables:");

  for (const issue of parsedPublicEnv.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  throw new Error("Public environment validation failed");
}

export const envPublicConfig = Object.freeze({
  APP_NAME: parsedPublicEnv.data.NEXT_PUBLIC_APP_NAME,
  APP_VERSION: parsedPublicEnv.data.NEXT_PUBLIC_APP_VERSION,
  APP_DESCRIPTION: parsedPublicEnv.data.NEXT_PUBLIC_APP_DESCRIPTION,

  SITE_URL: parsedPublicEnv.data.NEXT_PUBLIC_SITE_URL,
  SITE_TITLE: parsedPublicEnv.data.NEXT_PUBLIC_SITE_TITLE,

  LOGO_URL: parsedPublicEnv.data.NEXT_PUBLIC_LOGO_URL,
  OG_IMAGE_URL: parsedPublicEnv.data.NEXT_PUBLIC_OG_IMAGE_URL,

  ACTIVE_THEME: parsedPublicEnv.data.NEXT_PUBLIC_ACTIVE_THEME,
});

export type EnvPublicConfig = typeof envPublicConfig;
