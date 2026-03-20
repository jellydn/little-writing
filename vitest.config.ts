import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		include: [
			"tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}",
			"tests/component/**/*.{test,spec}.{js,ts,jsx,tsx}",
			"tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}",
		],
		exclude: ["tests/e2e/**"],
		// All tests use jsdom since we have DOM-reliant utilities
		css: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: ["node_modules/", "tests/", "dist/"],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	// Ensure all files can access the DOM environment
	define: {
		"process.env.NODE_ENV": '"test"',
	},
});
