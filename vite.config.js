import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 4000, // Thiết lập cổng tùy chỉnh ở đây
  },
  plugins: [react()],
});
