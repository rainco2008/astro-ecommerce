import { defineConfig } from 'astro/config';

// https://astro.build/config
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough"
  }),
  site: "https://astro-ecommerce.rainco2008.workers.dev"
});
