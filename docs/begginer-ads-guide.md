# Ads Setup — from scratch

Ads in this template are config-driven and provider-agnostic: the layout
doesn't know or care whether a rail is filled by Google AdSense or
Media.net — it asks `adsConfig` for a slot id and renders whichever
provider has one.

```
.env.local
   │  (validated by Zod)
   ▼
src/packages/env/ads.env.ts        ──►  typed, frozen envAdsConfig
   │
   ▼
src/packages/configs/ads.config.ts ──►  adsConfig  (single source of truth for ads)
   │
   ├──► src/app/layout.tsx                          (mounts loader <Script> tags once)
   │       ├── GoogleAdsScript   (src/components/features/ads-sense/google-ads)
   │       └── MediaNetScript    (src/components/features/ads-sense/media-net)
   │
   └──► src/components/layouts/AdsPageLayout.tsx     (3-column page shell)
           └── AdRail (left / right)
                 ├── GoogleAdUnit   (if a Google slot is configured for that side)
                 └── MediaNetAdUnit (fallback, if a Media.net slot is configured)
```

## 1. Get your provider credentials

### Google AdSense
1. Sign up / log in at [adsense.google.com](https://adsense.google.com).
2. Get your **publisher/client id** — looks like `ca-pub-1234567890123456`.
3. Create two **ad units** (one for the left rail, one for the right) —
   each gives you a numeric **slot id**.

### Media.net (optional — used as a fallback per side)
1. Sign up / log in at [media.net](https://www.media.net).
2. Get your **CID** (customer id).
3. Create two ad units for left/right — each gives you a **CRID** (slot id).

## 2. Set environment variables

Add these to `.env.local`:

```bash
# Master kill switch — set to "false" to disable ALL ads everywhere (dev/staging)
NEXT_PUBLIC_ADSENSE_ENABLED="true"

# Google AdSense
NEXT_PUBLIC_GOOGLE_ADS_ENABLED="true"
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"
NEXT_PUBLIC_GOOGlE_ADSENSE_SIDEBAR_LEFT_SLOT="1234567890"
NEXT_PUBLIC_GOOGLE_ADSENSE_SIDEBAR_RIGHT_SLOT="0987654321"

# Google Search Console site ownership verification (shared with SEO setup)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""

# Media.net (optional — fills a side only if that side has no Google slot)
NEXT_PUBLIC_MEDIANET_ADS_ENABLED="true"
NEXT_PUBLIC_MEDIANET_CID=""
NEXT_PUBLIC_MEDIANET_LEFT_CRID=""
NEXT_PUBLIC_MEDIANET_RIGHT_CRID=""
```

> **Note the typo-preserving casing** on
> `NEXT_PUBLIC_GOOGlE_ADSENSE_SIDEBAR_LEFT_SLOT` (lowercase `l` in
> `GOOGlE`) — that's the exact variable name defined in
> `src/packages/env/ads.env.ts`. Copy it exactly, or the Zod schema will
> silently fall back to the default empty string and your left rail
> won't render. If you'd rather fix the typo, rename it consistently in
> `ads.env.ts`, `.env.local`, and your hosting provider's env settings
> together.

All of these are validated by `adsEnvSchema` in `src/packages/env/ads.env.ts`
at startup — every var is optional with a safe default (`""` /
`"true"`), so the app never crashes for missing ad config; unconfigured
slots just render nothing (see §5).

## 3. How `ads.config.ts` shapes this

`src/packages/configs/ads.config.ts` turns the raw env vars into one
frozen object:

```ts
export const adsConfig = {
  enabled: envAdsConfig.enabled,          // master kill switch
  googleAds: {
    googleAdsEnabled: envAdsConfig.GOOGLE_ADS_ENABLED,
    clientId: envAdsConfig.GOOGLE_ADSENSE_CLIENT_ID,
    scriptSrc: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
    sidebar: {
      width: 160,
      height: 600,
      left:  { slot: envAdsConfig.GOOGLE_ADSENSE_SIDEBAR_LEFT_SLOT },
      right: { slot: envAdsConfig.GOOGLE_ADSENSE_SIDEBAR_RIGHT_SLOT },
    },
  },
  mediaNetAds: {
    enabled: envAdsConfig.MEDIANET_ADS_ENABLED,
    cid: envAdsConfig.MEDIANET_CID,
    left:  { slot: envAdsConfig.MEDIANET_LEFT_CRID },
    right: { slot: envAdsConfig.MEDIANET_RIGHT_CRID },
  },
} as const;
```

Every component that renders an ad reads from this object — never
from `process.env` directly. If you ever need to change the rail size,
swap providers, or add a third placement (e.g. a footer banner), this
is the one file to touch first.

## 4. The layout: `AdsPageLayout` + `AdRail`

`src/components/layouts/AdsPageLayout.tsx` is the 3-column shell used
by the homepage and every blog page:

```tsx
export const AdsPageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="ads-page-layout">
    <AdRail side="left" />
    <div className="ads-page-layout__content">{children}</div>
    <AdRail side="right" />
  </div>
);
```

The grid (`src/styles/utils/layouts.css`, `.ads-page-layout`) is:

- **Left/right rails**: fixed width (`--ad-rail-width: 160px`, matching
  the AdSense skyscraper size), `position: sticky; top: 6rem` — they
  stay in view while the center column scrolls, and never reflow when
  an ad finishes loading (fixed `width`/`height` reserved up front, so
  there's no layout shift).
- **Center column**: `overflow-y: auto` with a capped `max-height` — it
  scrolls independently of the rest of the page.
- **Below 1024px**: rails are hidden entirely (`display: none`) so ads
  never squeeze the reading column on mobile/tablet — center content
  goes full width and the page scrolls normally.

`AdRail` (`src/components/features/ads-sense/AdRail.tsx`) decides what
actually renders in a given side:

```tsx
export const AdRail = ({ side }: { side: "left" | "right" }) => {
  const googleSlot = adsConfig.googleAds.sidebar[side].slot;
  const mediaNetSlot = adsConfig.mediaNetAds[side].slot;

  if (!adsConfig.enabled) return null;

  return (
    <aside className={`ad-rail ad-rail--${side}`}>
      <div className="ad-rail__sticky">
        {googleSlot
          ? <GoogleAdUnit slot={googleSlot} width={160} height={600} />
          : <MediaNetAdUnit slot={mediaNetSlot} width={160} height={600} />}
      </div>
    </aside>
  );
};
```

**Google AdSense is primary, Media.net is the fallback per side** — if
you set a Google slot for the left rail, that's what renders there
regardless of whether a Media.net slot is also set. To run Media.net on
a side instead, leave that side's Google slot env var empty.

## 5. Ad units: how they actually render

### `GoogleAdUnit` (`src/components/features/ads-sense/google-ads/GoogleAdUnit.tsx`)
Renders a standard `<ins class="adsbygoogle">` reserving the exact
`width`/`height` you pass in, then calls `useAdsSense()` to push `{}`
into the `window.adsbygoogle` queue once mounted. Returns `null`
(nothing, not an empty box) if ads are disabled, the client id is
missing, or no slot is configured — so a fresh clone of this template
with no ad ids filled in doesn't ship broken-looking empty rails.

### `MediaNetAdUnit` (`src/components/features/ads-sense/media-net/MediaNetAdUnit.tsx`)
Media.net doesn't use a data-attribute `<ins>` like AdSense — it targets
a `<div>` by id via an inline script that calls
`window._mNDetails.loadTag(containerId, "WxH", slot)`. Each instance
gets a unique React-generated id so multiple rails never collide.

### `useAdsSense` hook (`src/packages/hooks/useAdsSense.ts`)
```ts
export const useAdsSense = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }, [pathname]);

  return ref;
};
```
Keyed on `pathname` so client-side navigation (e.g. blog list → a post)
re-triggers the push for the newly-mounted `<ins>`, instead of the ad
slot staying blank because AdSense already "filled" a now-unmounted
node.

### Loader scripts
`GoogleAdsScript` and `MediaNetScript` (mounted once, in
`src/app/layout.tsx`) inject the provider's SDK via `next/script`
(`strategy="afterInteractive"`) — each is gated behind
`adsConfig.enabled` and its own provider-level enabled flag, so setting
`NEXT_PUBLIC_ADSENSE_ENABLED="false"` removes every script tag and every
ad unit in one change, cleanly, for local dev or staging.

## 6. Adding a new ad placement (e.g. an in-article unit)

1. Add the new slot to `adsConfig` in `ads.config.ts` (and its env var
   in `ads.env.ts` if it should be configurable).
2. Reuse `GoogleAdUnit` / `MediaNetAdUnit` directly wherever you want it
   — they're generic, sized components, not rail-specific:
   ```tsx
   <GoogleAdUnit slot={adsConfig.googleAds.inArticle.slot} width={336} height={280} />
   ```
3. If it needs its own responsive/collapse behavior, add rules in
   `layouts.css` the same way `.ad-rail` collapses below 1024px.

## 7. Checklist before going live

- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is your real `ca-pub-...` id, not a placeholder
- [ ] Left and right slot ids are both set (or intentionally left blank to fall back to Media.net / show nothing)
- [ ] Your domain is added and approved in the AdSense dashboard (AdSense won't serve ads on unapproved domains)
- [ ] `NEXT_PUBLIC_ADSENSE_ENABLED="true"` in production, and you have a way to flip it to `"false"` quickly if needed (e.g. a Vercel/host env override)
- [ ] Verify in the browser devtools Network tab that `adsbygoogle.js` (and/or `dmedianet.js`) actually loads on the deployed site
- [ ] Confirm rails disappear cleanly below 1024px width and don't leave dead space
