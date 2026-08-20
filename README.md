# create-seo-ads

A Next.js (App Router) template for shipping a keyword-driven, SEO-ready,
ad-monetized site fast — built around **one rule**: every piece of copy,
metadata, and ad placement is read from a small set of typed config files.
Nothing about SEO or ads is hardcoded inside a component.

```
Homepage / Blog list / Blog post
        │
        ▼
 AdsPageLayout  ──►  left AdRail   (sticky, static)
        │        ──►  center column (scrolls independently)
        │        ──►  right AdRail  (sticky, static)
        ▼
 reads from → app.config.ts · ads.config.ts · seo.config.ts · blogs.config.ts
```

## Stack

- **Next.js** (App Router, typed routes — `PageProps<'/route'>` / `LayoutProps<'/route'>`)
- **TypeScript**, strict mode
- **Zod** — validates every environment variable at startup, fails fast if misconfigured
- **Biome** — lint + format
- **Bun** (or npm/pnpm — package manager agnostic)

## Quick start

```bash
git clone https://github.com/vivekcsein/create-seo-ads.git
cd create-seo-ads
bun install        # or: npm install / pnpm install

cp .env.example .env.local   # see docs below for what to fill in
bun dev             # or: npm run dev
```

Open `http://localhost:3000`.

## Documentation

This repo's docs are split by concern, matching the config-file split in the
code itself:

| Doc                            | Covers                                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/SEO.md`](./docs/SEO.md) | Setting up `app.config.ts` + `seo.config.ts`, keywords, metadata, sitemap, robots, JSON-LD, adding new pages/blog posts           |
| [`docs/ADS.md`](./docs/ADS.md) | Setting up `ads.config.ts`, Google AdSense + Media.net env vars, the `AdsPageLayout` / `AdRail` system, adding a new ad placement |

Read `docs/SEO.md` first if your goal is "get this indexed and ranking."
Read `docs/ADS.md` first if your goal is "get ads live on the page."
Most people will want both, in that order — SEO gets you the traffic, ads
monetize it.

## Project layout (relevant parts)

```
src/
├── app/
│   ├── layout.tsx              # root layout — mounts ad loader scripts, fonts, theme
│   ├── page.tsx                # homepage (uses AdsPageLayout)
│   ├── sitemap.ts              # generates sitemap.xml from blogs.config.ts
│   ├── robots.ts               # generates robots.txt from app.config.ts
│   ├── manifest.ts             # PWA manifest from app.config.ts
│   └── blogs/
│       ├── page.tsx            # blog list (uses AdsPageLayout)
│       └── [slug]/page.tsx     # blog post (uses AdsPageLayout, generateMetadata, JSON-LD)
│
├── components/
│   ├── layouts/
│   │   ├── AppClientLayout.tsx  # header + footer + page shell
│   │   └── AdsPageLayout.tsx    # the 3-column ad rail + scrollable content shell
│   └── features/ads-sense/
│       ├── AdRail.tsx           # picks Google AdSense vs Media.net per side
│       ├── google-ads/          # GoogleAdsScript (loader) + GoogleAdUnit (<ins>)
│       └── media-net/           # MediaNetScript (loader) + MediaNetAdUnit
│
└── packages/
    ├── configs/
    │   ├── app.config.ts        # site identity, keywords, routes — SoT for SEO
    │   ├── ads.config.ts        # ad provider ids/slots — SoT for ads
    │   └── blogs.config.ts      # blog post data — SoT for blog content
    ├── env/                     # Zod-validated env schemas (app, public, ads)
    ├── seo/seo.config.ts        # base Next.js Metadata object, built from app.config
    └── hooks/useAdsSense.ts     # pushes AdSense <ins> units into the render queue
```

## License

See [`LICENSE`](./LICENSE).
