import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { photoSizes } from "./photo-sizes.plugin";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  vite: { plugins: [photoSizes(), imagetools()] },
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
      },
    },
    server: { entry: "server" },
  },
});
