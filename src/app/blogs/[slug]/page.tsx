// src/app/blogs/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocsTemplate from "@/components/features/docs-app/DocsTemplate";
import {
  blogsConfig,
  getAllBlogPosts,
  getBlogKeywords,
  getBlogPostBySlug,
} from "@/packages/configs/blogs.config";

export const generateStaticParams = () =>
  getAllBlogPosts().map((post) => ({ slug: post.slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: getBlogKeywords(post),
    alternates: { canonical: blogsConfig.routes.detail(post.slug) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
  };
};

const BlogSlugPage = async ({ params }: PageProps<"/blogs/[slug]">) => {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    keywords: getBlogKeywords(post).join(", "),
  };

  return (
    <article className="prose max-w-none w-full py-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex justify-between">
        <Link href={blogsConfig.routes.list} className="docs-back-link">
          ← Back to Docs
        </Link>
        <small>
          By {post.author} · {post.publishedAt} · {post.readingTime} min read
        </small>
      </div>

      <DocsTemplate slug={post.path.split("/")} />
    </article>
  );
};

export default BlogSlugPage;
