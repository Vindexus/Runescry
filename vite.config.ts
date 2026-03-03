import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tsConfigPaths(),
		tanstackStart({
			pages: [{ path: "/" }, { path: "/about" }, { path: "/syntax" }],
			prerender: {
				enabled: true,
				crawlLinks: true,
			},
		}),
		react(),
	],
	base: "/",
});
