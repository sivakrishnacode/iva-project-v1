import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {},
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
