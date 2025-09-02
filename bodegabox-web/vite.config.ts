import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [svgr(), react(), vanillaExtractPlugin()],
});
