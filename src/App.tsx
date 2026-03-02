import { useState } from "react";
import { RUNEWORDS } from "./data/runewords";
import { filterRunewords, matchNode } from "./search/matcher";
import "./App.css";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";
import { parse } from "./search/parser";
import { tokenize } from "./search/tokenizer";
import { RunewordLI } from "./components/runeword";
import { ASTText } from "./components/ast";

function App() {
	const [query, setQuery] = useQueryState(
		"query",
		parseAsString.withDefault(""),
	);
	const tokens = tokenize(query);
	const ast = parse(tokens);
	const results = ast
		? RUNEWORDS.filter((rw) => matchNode(rw, ast))
		: RUNEWORDS;
	console.log("results", results);

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setQuery(e.currentTarget.query.value);
	};

	return (
		<div className="app">
			<header className="header">
				<h1>RuneScry</h1>
				<p className="subtitle">Diablo II Runeword Search</p>
			</header>

			<div className="search-bar">
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						name="query"
						className="search-input"
						placeholder="e.g. jah   base:melee   os:4   (ber or jah) -ladder"
						defaultValue={query}
						autoFocus
						spellCheck={false}
					/>
					<button type="submit">Go</button>
				</form>
			</div>

			<div className="results-meta">
				{results.length} result{results.length !== 1 ? "s" : ""}
				{ast && (
					<span>
						{" "}
						where <ASTText ast={ast} />
					</span>
				)}
			</div>

			<ul className="results">
				{results.map((rw) => {
					return <RunewordLI key={rw.name} rw={rw} />;
				})}
			</ul>

			{results.length === 0 && (
				<p className="no-results">No runewords match your query.</p>
			)}
		</div>
	);
}

export default App;
