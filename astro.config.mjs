import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [sitemap()],
  fonts: [
    {
      name: "DM Sans",
      cssVariable: "--font-dm-sans",
      provider: fontProviders.google(),
      weights: [400],
      styles: ["normal"],
    },
  ],
});
