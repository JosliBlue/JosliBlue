import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

export default defineConfig({
    output: "server",
    adapter: netlify(),
    vite: {
        plugins: [tailwind()],
    },
    integrations: [react()],
});