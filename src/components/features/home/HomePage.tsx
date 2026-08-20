import Link from "next/link";
import KeywordsCopy from "@/components/ui/custom/KeywordsCopy";
import { appConfig } from "@/packages/configs/app.config";
import { blogsConfig, getAllBlogPosts } from "@/packages/configs/blogs.config";

const HomePage = () => {
  const { site, keywords } = appConfig;
  const latestPosts = getAllBlogPosts().slice(0, 3);

  return (
    <article className="prose max-w-none w-full py-8 gap-4">
      <h1>{site.title}</h1>
      <p>{site.description}</p>

      <section aria-labelledby="what-this-is">
        <h3 id="what-this-is">A single source of truth, top to bottom</h3>
        <p>
          {site.name} is a template for shipping SEO-ready, ad-monetized pages
          fast. App metadata, ad placements, and keyword targeting all read from
          the same typed config files — change a value once and it propagates to
          metadata, structured data, and every ad rail on the page.
        </p>
      </section>

      <KeywordsCopy keywords={keywords} />

      <section aria-labelledby="latest-posts" style={{ marginTop: "2rem" }}>
        <h3 id="latest-posts">Latest from the blog</h3>
        <ul>
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <Link href={blogsConfig.routes.detail(post.slug)}>
                {post.title}
              </Link>
              <p>{post.description}</p>
            </li>
          ))}
        </ul>
        <p>
          <Link href={blogsConfig.routes.list}>Browse all posts →</Link>
        </p>
      </section>
    </article>
  );
};

export default HomePage;
