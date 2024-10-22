import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    copy({
      targets: [
        { src: "src/assets/**/*", dest: "dist/assets/"},
      ],
      hook: "generateBundle",
    }),
  ],
  server: {
    open: true,
    port: 3000,
    host: "0.0.0.0",
    // 配置 WebContainer/api 跨源隔离
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  build: {
    outDir: 'dist',
  },
});
