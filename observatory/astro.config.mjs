// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Deployed at https://jaxlaxy.vercel.app via Vercel (Hobby tier, free).
  // `base` is intentionally unset — Vercel serves the site at root, so
  // `import.meta.env.BASE_URL` resolves to "/" and all asset / fetch paths
  // like `${BASE_URL}galaxy.json` work without sub-path prefixing.
  site: "https://jaxlaxy.vercel.app",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
