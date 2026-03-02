import React, { useState } from "react";
import { RUNEWORDS } from "./data/runewords";
import { matchNode } from "./search/matcher";
import "./App.css";
import { useQueryState } from "nuqs";
import { parse } from "./search/parser";
import { tokenize } from "./search/tokenizer";
import { RunewordLI } from "./components/runeword";
import { ASTText } from "./components/ast";
import type { Runeword } from "./types";

function App() {
	const [query, setQuery] = useQueryState("query", {
		defaultValue: "",
		clearOnDefault: true,
		history: "push",
	});
	const [showSyntax, setShowSyntax] = useState(false);
	const [sortBy, setSortBy] = useQueryState("sort", {
		defaultValue: "level",
		clearOnDefault: true,
		history: "push",
	});
	const [direction, setDirection] = useQueryState("dir", {
		defaultValue: "auto",
		clearOnDefault: true,
		history: "push",
	});
	const tokens = tokenize(query);
	const ast = parse(tokens);
	const filtered = ast
		? RUNEWORDS.filter((rw) => matchNode(rw, ast))
		: RUNEWORDS;
	let finalDir: "asc" | "desc" = "asc";
	if (direction === "auto") {
		finalDir = "asc";
		if (sortBy === "level") {
			finalDir = "asc";
		}
		if (sortBy === "value") {
			finalDir = "desc";
		}
	}
	const results = filtered.sort((a, b) => {
		const val1 = a[sortBy as keyof Runeword];
		const val2 = b[sortBy as keyof Runeword];
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
		setQuery(data.query);
		setDirection(data.dir);
		setSortBy(data.sort);
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
							placeholder='e.g. "fire resistance" has:ed os>=3 (base:sword or base:hammer) -jah'
							defaultValue={query}
							key={query}
							autoFocus
							spellCheck={false}
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
							<option value="value">Rune Value</option>
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
						<button type="button" onClick={() => setShowSyntax(!showSyntax)}>
							Syntax Guide
						</button>
					</div>
				</form>
			</div>

			{showSyntax && (
				<div className="syntax-guide">
					<div className="syntax-section">
						<div className="syntax-title">Keywords</div>
						<div className="syntax-desc">
							Match runeword name, rune names, or attributes. Use quotes for
							multi-word phrases.
						</div>
						<code className="syntax-example">teleport</code>
						<code className="syntax-example">"fire resistance"</code>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">Rune Filter</div>
						<div className="syntax-desc">
							Find runewords containing a specific rune.
							<br />
							Use <span className="syntax-mono">-</span> to exclude.
						</div>
						<code className="syntax-example">ist</code>
						<code className="syntax-example">-jah</code>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">
							Base Filter — <span className="syntax-mono">base:</span>
						</div>
						<div className="syntax-desc">
							Filter by item type. Categories expand automatically —{" "}
							<span className="syntax-mono">base:melee</span> includes swords,
							axes, etc.
						</div>
						<code className="syntax-example">base:sword</code>
						<code className="syntax-example">base:melee</code>
						<code className="syntax-example">base:weapon</code>
						<code className="syntax-example">base:shield</code>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">
							Open Sockets — <span className="syntax-mono">os:</span>
						</div>
						<div className="syntax-desc">
							Filter by number of runes in the word.
						</div>
						<code className="syntax-example">os:4</code>
						<code className="syntax-example">os&gt;=3</code>
						<code className="syntax-example">os&lt;=2</code>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">
							Tag Filter — <span className="syntax-mono">has:</span>
						</div>
						<div className="syntax-desc">Filter by notable attribute tags.</div>
						<code className="syntax-example">has:fcr</code>
						<code className="syntax-example">has:ias</code>
						<code className="syntax-example">has:aura</code>
						<code className="syntax-example">has:mf</code>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">Flags</div>
						<div className="syntax-desc">Filter by special flags.</div>
						<code className="syntax-example">ladder</code>
						<code className="syntax-example">rotw</code>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">Boolean Logic</div>
						<div className="syntax-desc">
							Combine filters. Space = AND, use{" "}
							<span className="syntax-mono">or</span> for OR, prefix{" "}
							<span className="syntax-mono">-</span> to negate.
						</div>
						<code className="syntax-example">jah base:armor</code>
						<code className="syntax-example">(ber or jah) -ladder</code>
						<code className="syntax-example">base:melee -base:sword</code>
					</div>
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
		</div>
	);
}

export default App;
