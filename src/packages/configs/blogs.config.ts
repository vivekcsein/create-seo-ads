// src/packages/configs/blogs.config.ts
import { getFilePath } from "../utils/get-file";
import { appConfig } from "./app.config";

/**
 * Single source of truth for blog content.
 *
 * Each post points at a markdown file (`file`) rendered on demand —
 * this config only carries metadata (title, dates, routing), never the
 * article body itself. See `getBlogPostMarkdown` for reading the file.
 */
export type BlogPost = {
  key: string;
  slug: string;
  author: string;
  publishedAt: string;
  /** Optional — only set this when a post is actually revised after publishing. */
  updatedAt?: string;
  readingTime: number;
  title: string;
  description: string;
  path: string;
  file: string;
};

export const blogsConfig = Object.freeze({
  routes: {
    list: "/blogs",
    detail: (slug: string) => `/blogs/${slug}`,
  },

  posts: [
    {
      key: "BEGGINER-ADS-GUIDE",
      slug: "begginer-ads-guide",
      author: appConfig.app.name,
      publishedAt: "2025-02-04",
      readingTime: 5,
      title: "Begginer Ads Guide",
      description: "",
      path: "begginer-ads-guide.md",
      file: getFilePath("begginer-ads-guide.md"),
    },

    {
      key: "BEGGINER-SEO-GUIDE",
      slug: "begginer-seo-guide",
      author: appConfig.app.name,
      publishedAt: "2025-02-04",
      readingTime: 5,
      title: "Begginer SEO Guide",
      description: "",
      path: "begginer-seo-guide.md",
      file: getFilePath("begginer-seo-guide.md"),
    },
  ] satisfies BlogPost[],
});

export type BlogsConfig = typeof blogsConfig;

export const getAllBlogPosts = (): BlogPost[] => blogsConfig.posts;

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  blogsConfig.posts.find((post) => post.slug === slug);

/** Site-wide keywords only — posts don't carry their own keyword list
 *  now that content lives in markdown files instead of inline arrays. */
export const getBlogKeywords = (_post: BlogPost): string[] => [
  ...appConfig.keywords,
];
