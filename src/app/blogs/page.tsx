import type { Metadata } from "next";
import Link from "next/link";
import { blogsConfig, getAllBlogPosts } from "@/packages/configs/blogs.config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical, no-fluff writing on SEO, ad layout, and building maintainable Next.js apps.",
  alternates: { canonical: blogsConfig.routes.list },
};

const BlogsPage = () => {
  const posts = getAllBlogPosts();

  return (
    <div className="prose max-w-none w-full py-8">
      <h1>Our latest Blogs...</h1>
      <p>
        Practical writing on SEO, ad layout, and maintainable config-driven
        apps.
      </p>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {posts.map((post) => (
          <li
            key={post.slug}
            style={{
              borderBottom: "1px solid var(--border)",
              paddingBottom: "1.5rem",
            }}
          >
            <h2 style={{ marginBottom: "0.25rem" }}>
              <Link href={blogsConfig.routes.detail(post.slug)}>
                {post.title}
              </Link>
            </h2>
            <small>
              {post.publishedAt} · {post.readingTime} min read
            </small>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogsPage;
