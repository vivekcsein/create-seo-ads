"use client";

import Script from "next/script";
import { useId } from "react";
import { adsConfig } from "@/packages/configs/ads.config";

type MediaNetAdUnitProps = {
  slot: string | undefined;
  width: number;
  height: number;
  className?: string;
};

/**
 * Media.net renders into a div matched by id via an inline `_mNHandle`
 * config, rather than a data-attribute `<ins>` like AdSense. Each unit
 * gets its own React-generated id so multiple rails never collide.
 */
export const MediaNetAdUnit = ({
  slot,
  width,
  height,
  className,
}: MediaNetAdUnitProps) => {
  const { enabled, cid } = adsConfig.mediaNetAds;
  const reactId = useId().replace(/[:]/g, "");
  const containerId = `mnet-${reactId}`;

  if (!adsConfig.enabled || !enabled || !cid || !slot) return null;

  return (
    <div id={containerId} className={className} style={{ width, height }}>
      <Script id={`${containerId}-init`} strategy="afterInteractive">
        {`
          window._mNHandle = window._mNHandle || {};
          window._mNHandle.queue = window._mNHandle.queue || [];
          window._mNDetails = window._mNDetails || {};
          try {
            window._mNHandle.queue.push(function () {
              (window._mNDetails.loadTag("${containerId}", "${width}x${height}", "${slot}"));
            });
          } catch (error) {}
        `}
      </Script>
    </div>
  );
};
