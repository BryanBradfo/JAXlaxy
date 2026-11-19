// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Deployed at https://jaxlaxy.bradfo.me (subdomain of bradfo.me,
  // pointing at Vercel via CNAME). `base` is intentionally unset — Vercel
  // serves the site at root, so `import.meta.env.BASE_URL` resolves to "/"
  // and all asset / fetch paths like `${BASE_URL}galaxy.json` work without
  // sub-path prefixing. `site` is used for canonical URLs in OG meta tags.
  site: "https://jaxlaxy.bradfo.me",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
