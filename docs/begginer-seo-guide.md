# SEO Setup — from scratch

Everything SEO-related in this template flows from **one config file**:
`src/packages/configs/app.config.ts`. Change a value there and it
propagates to page titles, meta descriptions, Open Graph tags, the
sitemap, robots.txt, and the manifest — you never edit those files
directly for day-to-day content changes.

```
.env.local
   │  (validated by Zod)
   ▼
src/packages/env/public.env.ts   ──►  typed, frozen envPublicConfig
src/packages/env/ads.env.ts      ──►  typed, frozen envAdsConfig (site verification)
   │
   ▼
src/packages/configs/app.config.ts   ──►  appConfig  (site identity + keywords, SoT)
   │
   ▼
src/packages/seo/seo.config.ts       ──►  seoConfig   (Next.js `Metadata` object)
   │
   ├──► src/app/layout.tsx           (root metadata — applies site-wide)
   ├──► src/app/sitemap.ts           (sitemap.xml)
   ├──► src/app/robots.ts            (robots.txt)
   ├──► src/app/manifest.ts          (manifest.webmanifest)
   └──► src/app/blogs/[slug]/page.tsx (generateMetadata — per-post overrides)
```

## 1. Set your site identity

Copy `.env.example` to `.env.local` (create `.env.local` if no example
exists yet) and fill in:

```bash
NEXT_PUBLIC_APP_NAME="Your Site Name"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_DESCRIPTION="One sentence describing what this site is."

NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_TITLE="Your Site Name — What It Does"

NEXT_PUBLIC_LOGO_URL="/logo.png"
NEXT_PUBLIC_OG_IMAGE_URL="/og-image.png"

NEXT_PUBLIC_ACTIVE_THEME="dark"   # "system" | "light" | "dark"

# Google Search Console ownership verification (optional but recommended)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""
```

These are read and validated by `src/packages/env/public.env.ts` (Zod
schema — the app throws a clear error at boot if something required is
missing or malformed, instead of silently shipping broken metadata).

`NEXT_PUBLIC_SITE_URL` matters most: it's used as `metadataBase` for
resolving every relative OG/canonical URL, and as the base for every
`<loc>` in the generated sitemap. Get this wrong and every social share
card and sitemap entry breaks.

## 2. Set your keywords

Open `src/packages/configs/app.config.ts` and edit the `keywords` array:

```ts
export const appConfig = Object.freeze({
  // ...
  keywords: [
    "your brand name",
    "your product category",
    "your core topic",
    // ...
  ],
});
```

This single array is used in two places automatically:

- `seoConfig.keywords` (the `<meta name="keywords">` tag, plus it's the
  base list every blog post's keywords are merged with)
- `getBlogKeywords(post)` in `blogs.config.ts`, which does
  `[...appConfig.keywords, ...post.keywords]` — so every post inherits
  the site-wide keyword set plus its own long-tail terms

You don't need to repeat brand keywords in every blog post — put them
here once.

## 3. How page metadata is generated

`src/packages/seo/seo.config.ts` builds a base Next.js `Metadata` object
from `appConfig`:

- `title.default` / `title.template` — every page's `<title>` unless
  overridden
- `description`, `openGraph`, `twitter` — from `site.title` /
  `site.description` / the OG image
- `robots` — `index: true, follow: true` with Google-specific
  large-image/snippet preview flags
- `verification.google` — only rendered if
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is set (omitted entirely
  otherwise, rather than rendering an empty tag)

This object is spread into `src/app/layout.tsx`'s exported `metadata`,
so it applies to every route by default.

### Overriding metadata per page

Any route can export its own `metadata` (static) or `generateMetadata`
(dynamic) to override specific fields — Next.js merges it with the root
metadata. The blog list page does this statically:

```ts
// src/app/blogs/page.tsx
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical, no-fluff writing on SEO, ad layout, and building maintainable Next.js apps.",
  alternates: { canonical: blogsConfig.routes.list },
};
```

The blog detail page does it dynamically, per post:

```ts
// src/app/blogs/[slug]/page.tsx
export const generateMetadata = async ({
  params,
}: PageProps<"/blogs/[slug]">) => {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: getBlogKeywords(post),
    alternates: { canonical: blogsConfig.routes.detail(post.slug) },
    openGraph: { type: "article", title: post.title /* ... */ },
  };
};
```

Follow this pattern for any new route: read from a config, don't
hardcode strings in the component.

## 4. Sitemap & robots.txt

Both are generated files, not static ones — Next.js's file-convention
routes (`sitemap.ts`, `robots.ts`) run at build/request time and read
live data.

**`src/app/sitemap.ts`** includes the homepage, the blog list, and one
entry per post from `getAllBlogPosts()`. Add a new static route (e.g.
`/about`) by adding another object to the returned array; new blog
posts are picked up automatically since the list is generated from
`blogsConfig.posts`.

**`src/app/robots.ts`** reads `appConfig.site.url` to build the
`sitemap:` directive. If you need to disallow specific paths (e.g. a
draft-preview route), add rules to the `rules` array there.

## 5. Structured data (JSON-LD)

Blog posts render a `BlogPosting` JSON-LD block inline
(`src/app/blogs/[slug]/page.tsx`):

```ts
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
```

This tells search engines unambiguously "this is a blog post, published
on this date, by this author" — it's what enables article rich results.
If you add a different content type (product, FAQ, local business),
follow the same pattern: build a plain object matching the relevant
schema.org type, then render it as
`<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />`.

## 6. Adding a new blog post

Blog content lives in one place: `src/packages/configs/blogs.config.ts`.
No new files, no CMS — add an entry to the `posts` array:

```ts
{
  slug: "my-new-post",
  title: "My New Post Title",
  description: "One or two sentences — this becomes the meta description.",
  keywords: ["extra", "post-specific", "keywords"],
  author: appConfig.app.name,
  publishedAt: "2025-06-01",
  readingTime: 5,
  content: [
    "First paragraph.",
    "Second paragraph.",
  ],
},
```

That's it — the post is automatically:

- listed on `/blogs`
- rendered at `/blogs/my-new-post` (via `generateStaticParams`)
- included in `sitemap.xml`
- given its own `<title>`, meta description, canonical URL, OG tags,
  and `BlogPosting` JSON-LD

## 7. Adding a brand-new page

1. Create `src/app/your-route/page.tsx`.
2. Export `metadata` (static) or `generateMetadata` (dynamic), building
   off `appConfig` / `seoConfig` rather than hardcoding strings.
3. Add the route's canonical URL to `src/app/sitemap.ts` if it should be
   indexed.
4. If it's reader-facing long-form content, wrap it in `AdsPageLayout`
   (see `docs/ADS.md`) to get the same left/center/right shell as the
   homepage and blog pages.

## 8. Checklist before going live

- [ ] `NEXT_PUBLIC_SITE_URL` set to your real production domain
- [ ] `NEXT_PUBLIC_SITE_TITLE` / `NEXT_PUBLIC_APP_DESCRIPTION` are real, not placeholders
- [ ] `keywords` array in `app.config.ts` reflects your actual topic, no leftover template keywords
- [ ] OG image (`NEXT_PUBLIC_OG_IMAGE_URL`) exists and is at least 1200×630
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` set once you've added the property in Search Console
- [ ] `robots.txt` and `sitemap.xml` load correctly on the deployed URL (`/robots.txt`, `/sitemap.xml`)
- [ ] Submit the sitemap URL in Google Search Console
