import path from "path"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from 'unocss/vite'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [UnoCSS(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({}) // add options if needed
      ],
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    host: "0.0.0.0",
    port: 1420,
    strictPort: true,
    proxy: {
      '/api/': {
        target: "http://192.168.2.108:5260",
        changeOrigin: true,
        secure: false,
      },
    }
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
}));
