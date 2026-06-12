import { defineConfig } from "astro/config";
import tailwindcss from "@astrojs/tailwindcss";

export default defineConfig({
  integrations: [tailwindcss()],
});
