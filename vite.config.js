import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { buildContent } from "./src/content/build.js";

const CONTENT_DIR = resolve(import.meta.dirname, "content");

/** Serves content/*.md as JSON via `import content from "virtual:content"`; reloads the page when a file changes. */
function contentPlugin() {
  const id = "virtual:content", resolved = "\0" + id;
  return {
    name: "portfolio-content",
    resolveId: (source) => (source === id ? resolved : undefined),
    load(source) {
      if (source !== resolved) return;
      return `export default ${JSON.stringify(buildContent(CONTENT_DIR))};`;
    },
    configureServer(server) {
      server.watcher.add(CONTENT_DIR);
      const reload = (file) => {
        if (!file.startsWith(CONTENT_DIR) || !file.endsWith(".md")) return;
        const mod = server.moduleGraph.getModuleById(resolved);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", reload).on("change", reload).on("unlink", reload);
    },
  };
}

export default defineConfig({
  plugins: [contentPlugin(), react()],
  build: { chunkSizeWarningLimit: 800 },
});
