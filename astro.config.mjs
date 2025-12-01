import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
    vite: {
        plugins: [tailwind()],
    },
    integrations: [react()],
});