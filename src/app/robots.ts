import type { MetadataRoute } from "next";
import { appConfig } from "@/packages/configs/app.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${appConfig.site.url}/sitemap.xml`,
  };
}
