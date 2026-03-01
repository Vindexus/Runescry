import { useState } from "react";
import { RUNEWORDS } from "./data/runewords";
import { filterRunewords, matchNode } from "./search/matcher";
import "./App.css";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";
import { parse } from "./search/parser";
import { tokenize } from "./search/tokenizer";

function App() {
	const [query, setQuery] = useQueryState(
		"query",
		parseAsString.withDefault(""),
	);
	const tokens = tokenize(query);
	const ast = parse(tokens);
	const results = ast ? RUNEWORDS.filter((rw) => matchNode(rw, ast)) : [];

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

			<div>
				{ast ? <pre>{JSON.stringify(ast, null, 2)}</pre> : <p>Invalid query</p>}
			</div>

			<div className="results-meta">
				{query.trim()
					? `${results.length} result${results.length !== 1 ? "s" : ""}`
					: `${RUNEWORDS.length} runewords`}
			</div>

			<ul className="results">
				{results.map((rw) => (
					<li key={rw.name} className="card">
						<div className="card-header">
							<span className="rw-name">{rw.name}</span>
							<span className="rw-runes">{rw.runes.join(" + ")}</span>
							{rw.ladderOnly && <span className="badge-ladder">Ladder</span>}
						</div>
						<div className="card-meta">
							<span>{rw.sockets} sockets</span>
							<span>·</span>
							<span className="rw-bases">{rw.bases.join(", ")}</span>
							<span>·</span>
							<span>Req level {rw.levelReq}</span>
						</div>
						<p className="rw-desc">{rw.description}</p>
					</li>
				))}
			</ul>

			{results.length === 0 && (
				<p className="no-results">No runewords match your query.</p>
			)}
		</div>
	);
}

export default App;
