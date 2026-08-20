// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { appConfig } from "@/packages/configs/app.config";
import { blogsConfig, getAllBlogPosts } from "@/packages/configs/blogs.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const postEntries: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${appConfig.site.url}${blogsConfig.routes.detail(post.slug)}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: appConfig.site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${appConfig.site.url}${blogsConfig.routes.list}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postEntries,
  ];
}
