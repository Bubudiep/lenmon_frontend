import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 4000, // Thiết lập cổng tùy chỉnh ở đây
  },
  plugins: [react()],
  // plugins: [react(), basicSsl()],
});
