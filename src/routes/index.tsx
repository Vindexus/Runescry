import React, { useEffect, useState } from "react";
import { RUNEWORDS } from "../data/runewords";
import { matchNode } from "../search/matcher";
import { parse } from "../search/parser";
import { tokenize } from "../search/tokenizer";
import { RunewordLI } from "../components/runeword";
import { ASTText } from "../components/ast";
import type { Runeword } from "../types";

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

const SORT_DEFAULT = "level";
const DIR_DEFAULT = "auto";

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>) => ({
		query: typeof search.query === "string" ? search.query : undefined,
		sort: typeof search.sort === "string" ? search.sort : undefined,
		dir: typeof search.dir === "string" ? search.dir : undefined,
	}),
	component: Home,
});

function useSearch() {
	const { query, sort, dir } = Route.useSearch();
	return {
		query: query ?? "",
		sort: sort ?? SORT_DEFAULT,
		dir: dir ?? DIR_DEFAULT,
	};
}

function Home() {
	const { query, sort: sortBy, dir: direction } = useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [inputValue, setInputValue] = useState(query);
	const [showTop, setShowTop] = useState(false);

	useEffect(() => {
		setInputValue(query);
	}, [query]);

	useEffect(() => {
		function onScroll() {
			setShowTop(window.scrollY > 300);
		}
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const tokens = tokenize(query);
	const { parsed: ast, invalid } = parse(tokens);
	const filtered = ast
		? RUNEWORDS.filter((rw) => matchNode(rw, ast))
		: RUNEWORDS;
	let finalDir: "asc" | "desc" = direction as "asc" | "desc";
	if (direction === "auto") {
		finalDir = "asc";
		if (sortBy === "cost") {
			finalDir = "desc";
		}
	}
	const results = [...filtered].sort((a, b) => {
		const val1 = a[sortBy as keyof Runeword];
		const val2 = b[sortBy as keyof Runeword];
		if (val1 === val2) {
			return 0;
		}
		const lower = val1 < val2;
		if (finalDir === "asc") {
			return lower ? -1 : 1;
		}
		return lower ? 1 : -1;
	});

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		submit();
	};

	function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
		e.preventDefault();
		submit();
	}

	function submit() {
		const form = document.getElementById("search-form") as HTMLFormElement;
		const data = Object.fromEntries(new FormData(form).entries()) as Record<
			string,
			string
		>;
		navigate({
			search: {
				query: data.query || undefined,
				sort: data.sort !== SORT_DEFAULT ? data.sort : undefined,
				dir: data.dir !== DIR_DEFAULT ? data.dir : undefined,
			},
		});
	}

	return (
		<div className="app">
			<div className="search-bar">
				<form id="search-form" onSubmit={handleSubmit}>
					<div className="text-container">
						<input
							type="text"
							name="query"
							className="search-input"
							placeholder="e.g. os>=3 (base:sword or base:hammer) -ber has:aura ias>10"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							autoFocus
							spellCheck={false}
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="none"
							enterKeyHint="search"
						/>
						<button type="submit">Go</button>
					</div>
					<div className="sort-controls">
						<span className="sort-label">Sort By</span>
						<select
							defaultValue={sortBy}
							key={sortBy}
							name="sort"
							onChange={handleSelectChange}
						>
							<option value="level">Level</option>
							<option value="cost">Rune Cost</option>
							<option value="name">Name</option>
						</select>
						<select
							defaultValue={direction}
							key={direction}
							name="dir"
							onChange={handleSelectChange}
						>
							<option value="auto">Auto</option>
							<option value="asc">Asc</option>
							<option value="desc">Desc</option>
						</select>
						<Link to="/syntax" className="syntax-toggle">
							syntax guide
						</Link>
					</div>
				</form>
			</div>

			{invalid && invalid.length > 0 && (
				<div className="errors">
					{invalid.length > 1 && (
						<div className="errors-header">Found {invalid.length} issues</div>
					)}
					<ul className="errors-list">
						{invalid.map((x) => {
							const key = x.expression + x.message;
							return (
								<li key={key} className="error-item">
									<span className="error-expression">{x.expression}</span>
									<span className="error-message">{x.message}</span>
								</li>
							);
						})}
					</ul>
				</div>
			)}

			<div className="results-meta">
				<span className="num-results">
					{results.length} result{results.length !== 1 ? "s" : ""}
				</span>
				{ast && <span> where it {ASTText({ ast })}</span>}
			</div>

			<ul className="results">
				{results.map((rw) => {
					return <RunewordLI key={rw.id} rw={rw} />;
				})}
			</ul>

			{results.length === 0 && (
				<p className="no-results">No runewords match your query.</p>
			)}

			<button
				className={`back-to-top${showTop ? " back-to-top--visible" : ""}`}
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				aria-label="Back to top"
				type="button"
			>
				<svg
					viewBox="0 0 10 6"
					width="15"
					height="9"
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
					strokeLinecap="round"
					strokeLinejoin="round"
					role="graphics-symbol"
				>
					<polyline points="0,6 5,0 10,6" />
				</svg>
			</button>
		</div>
	);
}
