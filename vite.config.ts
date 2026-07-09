import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  base: process.env.GITHUB_PAGES === 'true' ? '/drkherbinventory/' : '/',
  server: {
    host: "::",
    port: 8080,
    // Voice input (Web Speech API) needs a secure context to reach the
    // browser's cloud recognition backend. Chrome/Edge special-case
    // localhost as secure even over HTTP, but DuckDuckGo Browser doesn't —
    // so `npm run dev:https` opts into a self-signed cert for local testing.
    https: command === 'serve' && process.env.VITE_HTTPS === 'true' ? {} : undefined,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    command === 'serve' && process.env.VITE_HTTPS === 'true' && basicSsl(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
