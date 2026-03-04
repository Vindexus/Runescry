// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
	Outlet,
	createRootRoute,
	HeadContent,
	Scripts,
	Link,
} from "@tanstack/react-router";

import "../App.css";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Runescry - Diablo II Runeword Searching",
			},
			{
				name: "description",
				content:
					'Search for runewords with text-based queries. EG: (base:sword or base:axe) os<=5 -jah "cast level"',
			},
		],
		links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
			<footer className="site-footer">
				<div className="site-footer-inner">
					<div className="site-footer-left">
						<Link to="/about">About</Link>
						<Link to="/syntax">Syntax Guide</Link>
						<a href="https://github.com/Vindexus/Runescry/">GitHub</a>
					</div>
					<div className="site-footer-right">
						Created by{" "}
						<a href="https://colinkierans.com">
							Colin &ldquo;Vindexus&rdquo; Kierans
						</a>
					</div>
				</div>
			</footer>
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
				{import.meta.env.VITE_ANALYTICS_DOMAIN &&
					import.meta.env.VITE_ANALYTICS_SRC && (
						<script
							defer
							data-domain={import.meta.env.VITE_ANALYTICS_DOMAIN}
							src={import.meta.env.VITE_ANALYTICS_SRC}
						/>
					)}
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
