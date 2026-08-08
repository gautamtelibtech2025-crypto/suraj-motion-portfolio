import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VERCEL ? "/" : "/suraj-motion-portfolio/",
  plugins: [react()],
});
