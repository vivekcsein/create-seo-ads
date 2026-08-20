import { AdRail } from "@/components/features/ads-sense/AdRail";

type AdsPageLayoutProps = {
  children: React.ReactNode;
};

/**
 * The blog-style 3-column shell used by both the homepage and the blog
 * routes: a fixed-width ad rail on each side, and a center content
 * column that scrolls independently. Ad rails stay `sticky` so they
 * remain visible while long-form content in the center scrolls past —
 * "static" in the ad-industry sense (never reflows), not `position: static`.
 */
export const AdsPageLayout = ({ children }: AdsPageLayoutProps) => {
  return (
    <div className="ads-page-layout">
      <AdRail side="left" />
      <main className="ads-page-layout__content">
        <div className="ads-page-layout__content-inner">{children}</div>
      </main>
      <AdRail side="right" />
    </div>
  );
};
