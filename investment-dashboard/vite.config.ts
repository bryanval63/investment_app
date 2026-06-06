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
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "InvestTrack",
        short_name: "Investments",
        description: "Mon application de suivi d'investissements",
        theme_color: "#ffffff", // Adapte selon ton thème Tailwind
        background_color: "#ffffff",
        display: "standalone", // 👈 Permet de masquer la barre d'adresse du navigateur !
        orientation: "any",
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
            src: "icon_512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
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
  optimizeDeps: {
    // On interdit à Vite d'essayer d'analyser ou d'embarquer Prisma dans le navigateur
    exclude: ["@prisma/client", ".prisma/client"],
  },
});
