import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import oxlintPlugin from "vite-plugin-oxlint";

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte(), oxlintPlugin()],
	resolve: {
		alias: {
			$: resolve(__dirname, "src"),
			$backend: resolve(__dirname, "wailsjs/go/main/App.js"),
			$runtime: resolve(__dirname, "wailsjs/runtime/runtime.js"),
		},
	},
});
