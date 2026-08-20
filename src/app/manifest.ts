import type { MetadataRoute } from "next";
import { appConfig } from "@/packages/configs/app.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appConfig.site.title,
    short_name: appConfig.app.name,
    description: appConfig.site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: appConfig.site.logoUrl,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
