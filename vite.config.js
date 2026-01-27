import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-swa-config",
      closeBundle() {
        fs.copyFileSync(
          resolve(__dirname, "staticwebapp.config.json"),
          resolve(__dirname, "dist/staticwebapp.config.json")
        );
      },
    },
  ],
});
