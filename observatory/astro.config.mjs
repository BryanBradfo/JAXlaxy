// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Deployed at https://bryanbradfo.github.io/JAXlaxy/ via GitHub Pages.
  // `base` feeds into `import.meta.env.BASE_URL` (trailing slash included)
  // — all client-side fetches (galaxy.json) must route through it so they
  // resolve correctly both in dev (base=/) and in production (base=/JAXlaxy/).
  site: "https://bryanbradfo.github.io",
  // Trailing slash required so `import.meta.env.BASE_URL` matches dev
  // behavior (which always resolves to "/"). Without it, string concat
  // like `${BASE_URL}galaxy.json` produces "/JAXlaxygalaxy.json".
  base: "/JAXlaxy/",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
