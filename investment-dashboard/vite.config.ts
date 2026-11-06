/// <reference types="vitest/config" />
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "InvestTrack",
        short_name: "InvestTrack",
        description: "Mon application de suivi d'investissements",
        theme_color: "#ffffff", // Adapte selon ton thème Tailwind
        background_color: "#ffffff",
        display: "fullscreen", // Sur Android, privilégie le mode plein écran pour gagner de la place
        display_override: ["fullscreen", "standalone", "browser"],
        orientation: "any", // Autorise portrait et paysage
        icons: [
          {
            src: "icon_192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon_512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            // Fond plein bord : le lanceur Android le découpe à sa forme (cercle, squircle…).
            src: "icon_maskable_512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/*": path.resolve(__dirname, "./src/*"),
      "@investments/shared": path.resolve(__dirname, "../shared/src"),
      "@investments/shared/*": path.resolve(__dirname, "../shared/src/*"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  optimizeDeps: {
    // On interdit à Vite d'essayer d'analyser ou d'embarquer Prisma dans le navigateur
    exclude: ["@prisma/client", ".prisma/client"],
  },
});
