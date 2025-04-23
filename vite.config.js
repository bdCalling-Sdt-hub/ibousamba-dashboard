import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "10.0.60.210",
    // host: "tanvir4001.binarybards.online",
    port: 4001,
  },
});
