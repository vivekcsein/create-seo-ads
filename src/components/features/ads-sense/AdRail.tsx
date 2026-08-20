import { adsConfig } from "@/packages/configs/ads.config";
import { GoogleAdUnit } from "./google-ads/GoogleAdUnit";
import { MediaNetAdUnit } from "./media-net/MediaNetAdUnit";

type AdRailProps = {
  side: "left" | "right";
  className?: string;
};

/**
 * One vertical ad rail. Renders Google AdSense first (primary demand),
 * falling back to Media.net when Google has no slot configured for this
 * side — both driven entirely by `adsConfig`, so swapping providers or
 * disabling ads is a config change, not a component change.
 */
export const AdRail = ({ side, className }: AdRailProps) => {
  const { width, height } = adsConfig.googleAds.sidebar;
  const googleSlot = adsConfig.googleAds.sidebar[side].slot;
  const mediaNetSlot = adsConfig.mediaNetAds[side].slot;

  if (!adsConfig.enabled) return null;

  return (
    <aside
      aria-label={`${side} advertisement`}
      className={`ad-rail ad-rail--${side} ${className ?? ""}`.trim()}
    >
      <div className="ad-rail__sticky">
        {googleSlot ? (
          <GoogleAdUnit slot={googleSlot} width={width} height={height} />
        ) : (
          <MediaNetAdUnit slot={mediaNetSlot} width={width} height={height} />
        )}
      </div>
    </aside>
  );
};
