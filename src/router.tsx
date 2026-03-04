// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function stringifySearch(search: Record<string, unknown>): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(search)) {
		if (value !== undefined && value !== null) {
			params.set(key, String(value));
		}
	}
	const str = params.toString();
	return str ? `?${str}` : "";
}

function parseSearch(searchStr: string): Record<string, unknown> {
	const params = new URLSearchParams(searchStr);
	const result: Record<string, unknown> = {};
	for (const [key, value] of params.entries()) {
		result[key] = value;
	}
	return result;
}

export function getRouter() {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		stringifySearch,
		parseSearch,
	});

	return router;
}
