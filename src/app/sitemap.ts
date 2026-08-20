import type { MetadataRoute } from "next";
import { appConfig } from "@/packages/configs/app.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: appConfig.site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${appConfig.site.url}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
