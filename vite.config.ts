import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/lit-force-graph/",
  build: {
    lib: {
      entry: "src/lit-force-graph.ts",
      formats: ["es"],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
