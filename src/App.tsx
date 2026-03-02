import React, { useEffect, useState } from "react";
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
	const [inputValue, setInputValue] = useState(query);
	const [showSyntax, setShowSyntax] = useState(false);

	useEffect(() => {
		setInputValue(query);
	}, [query]);
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
	const { parsed: ast, invalid } = parse(tokens);
	const filtered = ast
		? RUNEWORDS.filter((rw) => matchNode(rw, ast))
		: RUNEWORDS;
	let finalDir: "asc" | "desc" = direction as "asc" | "desc";
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
							placeholder="e.g. os>=3 (base:sword or base:hammer) -berI has:aura ias>10"
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
						<button
							type="button"
							className="syntax-toggle"
							onClick={() => setShowSyntax(!showSyntax)}
						>
							{showSyntax ? "hide syntax" : "syntax guide"}
						</button>
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

			{showSyntax && (
				<div className="syntax-guide">
					<div className="syntax-section">
						<div className="syntax-title">Keywords</div>
						<div className="syntax-desc">
							Match name, runes, or attributes. Quotes for multi-word phrases.
						</div>
						<div className="syntax-examples">
							<code className="syntax-example">teleport</code>
							<code className="syntax-example">"enemy lightning res"</code>
						</div>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">Rune Filter</div>
						<div className="syntax-desc">
							Find runewords containing a rune. Prefix{" "}
							<span className="syntax-mono">-</span> to exclude.
						</div>
						<div className="syntax-examples">
							<code className="syntax-example">ist</code>
							<code className="syntax-example">-jah</code>
						</div>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">
							Base — <span className="syntax-mono">base:</span>
						</div>
						<div className="syntax-desc">
							Filter by item type. Categories expand —{" "}
							<span className="syntax-mono">base:melee</span> includes swords,
							axes, etc.
						</div>
						<div className="syntax-examples">
							<code className="syntax-example">base:sword</code>
							<code className="syntax-example">base:melee</code>
							<code className="syntax-example">base:weapon</code>
							<code className="syntax-example">base:shield</code>
							<code className="syntax-example">base:armor</code>
						</div>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">
							Tags — <span className="syntax-mono">has:</span>
						</div>
						<div className="syntax-desc">Filter by special properties.</div>
						<div className="syntax-examples">
							<code className="syntax-example">has:aura</code>
							<code className="syntax-example">has:mf</code>
							<code className="syntax-example">has:itd</code>
							<code className="syntax-example">has:cbf</code>
							<code className="syntax-example">has:pmh</code>
							<code className="syntax-example">has:str</code>
						</div>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">Number Expressions</div>
						<div className="syntax-desc">
							Filter stats by value. Supports{" "}
							<span className="syntax-mono">:</span>{" "}
							<span className="syntax-mono">=</span>{" "}
							<span className="syntax-mono">&gt;</span>{" "}
							<span className="syntax-mono">&gt;=</span>{" "}
							<span className="syntax-mono">&lt;</span>{" "}
							<span className="syntax-mono">&lt;=</span>
						</div>
						<div className="syntax-examples">
							<code className="syntax-example">os:4</code>
							<code className="syntax-example">lvl&lt;=65</code>
							<code className="syntax-example">fcr&gt;=25</code>
							<code className="syntax-example">ias:30</code>
							<code className="syntax-example">fhr&gt;=10</code>
							<code className="syntax-example">ll&gt;2</code>
							<code className="syntax-example">str&lt;=40</code>
							<code className="syntax-example">mf&gt;=50</code>
							<code className="syntax-example">ed&gt;=200</code>
							<code className="syntax-example">cb&gt;20</code>
						</div>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">Flags</div>
						<div className="syntax-desc">Filter by special flags.</div>
						<div className="syntax-examples">
							<code className="syntax-example">ladder</code>
							<code className="syntax-example">rotw</code>
						</div>
					</div>
					<div className="syntax-section">
						<div className="syntax-title">Boolean Logic</div>
						<div className="syntax-desc">
							Space = AND. Use <span className="syntax-mono">or</span> for OR,{" "}
							<span className="syntax-mono">-</span> to negate, parens to group.
						</div>
						<div className="syntax-examples">
							<code className="syntax-example">jah base:armor</code>
							<code className="syntax-example">(ber or jah) -ladder</code>
							<code className="syntax-example">base:melee -base:sword</code>
						</div>
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
