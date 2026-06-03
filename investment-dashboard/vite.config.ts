import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
