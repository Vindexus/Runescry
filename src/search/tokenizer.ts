import { STATS } from "../data/tags";
import type { Stat } from "../types";

export type NumOp = "=" | ">=" | "<=" | ">" | "<";

export type Token =
	| { type: "WORD"; value: string }
	| { type: "OR" }
	| { type: "LPAREN" }
	| { type: "RPAREN" }
	| { type: "MINUS" }
	| { type: "NUM_EXPR"; field: Stat; op: NumOp; value: number }
	| { type: "HAS"; value: string }
	| { type: "BASE_EXPR"; value: string };

// num expressions — os:4, os>=4, lvl<=20, str>=25, dex:15, etc.
const numPrefixes: Array<[string, Stat]> = [
	["os", "sockets"],
	["lvl", "level"],
	...STATS.map((s): [Stat, Stat] => [s, s]),
];

export function tokenize(input: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;

	while (i < input.length) {
		// Skip whitespace
		if (/\s/.test(input[i])) {
			i++;
			continue;
		}

		if (input[i] === "(") {
			tokens.push({ type: "LPAREN" });
			i++;
			continue;
		}

		if (input[i] === ")") {
			tokens.push({ type: "RPAREN" });
			i++;
			continue;
		}

		if (input[i] === "-") {
			tokens.push({ type: "MINUS" });
			i++;
			continue;
		}

		let matchedNum = false;
		for (const [prefix, field] of numPrefixes) {
			if (input.slice(i).toLowerCase().startsWith(prefix)) {
				const rest = input.slice(i + prefix.length);
				const opMatch = rest.match(/^(>=|<=|>|<|:|=)(\d+)/);
				if (opMatch) {
					const rawOp = opMatch[1];
					const op: NumOp = rawOp === ":" ? "=" : (rawOp as NumOp);
					const value = parseInt(opMatch[2], 10);
					tokens.push({ type: "NUM_EXPR", field, op, value });
					i += prefix.length + opMatch[0].length;
					matchedNum = true;
					break;
				}
			}
		}
		if (matchedNum) {
			continue;
		}

		// base: expressions — base:sword, base:melee
		if (input.slice(i).toLowerCase().startsWith("base:")) {
			i += 5;
			let value = "";
			while (i < input.length && !/[\s()]/.test(input[i])) {
				value += input[i];
				i++;
			}
			if (value) {
				tokens.push({ type: "BASE_EXPR", value: value.toLowerCase() });
			}
			continue;
		}

		if (input.slice(i).toLowerCase().startsWith("has:")) {
			i += 4;
			let value = "";
			while (i < input.length && !/[\s()]/.test(input[i])) {
				value += input[i];
				i++;
			}
			if (value) {
				tokens.push({ type: "HAS", value: value.toLowerCase() });
			}
			continue;
		}

		// Quoted phrase — treat everything inside quotes as a single keyword
		if (input[i] === '"') {
			i++; // skip opening quote
			let phrase = "";
			while (i < input.length && input[i] !== '"') {
				phrase += input[i];
				i++;
			}
			if (i < input.length) {
				i++; // skip closing quote
			}
			if (phrase) {
				tokens.push({ type: "WORD", value: phrase.toLowerCase() });
			}
			continue;
		}

		// Read a word (stops at whitespace, parens, or minus)
		let word = "";
		while (i < input.length && !/[\s()\-]/.test(input[i])) {
			word += input[i];
			i++;
		}
		if (word.toLowerCase() === "or") {
			tokens.push({ type: "OR" });
		} else if (word) {
			tokens.push({ type: "WORD", value: word.toLowerCase() });
		}
	}

	return tokens;
}
