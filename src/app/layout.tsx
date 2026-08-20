import "@/styles/globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAdsScript } from "@/components/features/ads-sense/google-ads";
import { MediaNetScript } from "@/components/features/ads-sense/media-net";
import AppClientLayout from "@/components/layouts/AppClientLayout";
import { monoFont, sansFont, serifFont } from "@/packages/configs/fonts.config";
import { seoConfig } from "@/packages/seo/seo.config";
import { themeInitScript } from "@/packages/utils/apply-theme";

export const metadata: Metadata = seoConfig;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <head>
        {/* Runs before hydration so the correct .dark class is applied
            before first paint — prevents a flash of the wrong theme. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <GoogleAdsScript />
        <MediaNetScript />
      </head>
      <body className="min-h-full flex flex-col">
        <AppClientLayout>{children}</AppClientLayout>
      </body>
    </html>
  );
}
