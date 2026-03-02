import { describe, expect, it } from "vitest";
import { tokenize } from "./tokenizer";

describe("tokenize", () => {
	it("returns empty array for empty input", () => {
		expect(tokenize("")).toEqual([]);
	});

	it("tokenizes a plain keyword", () => {
		expect(tokenize("teleport")).toEqual([
			{ type: "WORD", value: "teleport" },
		]);
	});

	it("lowercases keywords", () => {
		expect(tokenize("Teleport")).toEqual([
			{ type: "WORD", value: "teleport" },
		]);
	});

	it("tokenizes OR operator", () => {
		expect(tokenize("jah or ber")).toEqual([
			{ type: "WORD", value: "jah" },
			{ type: "OR" },
			{ type: "WORD", value: "ber" },
		]);
	});

	it("tokenizes parentheses", () => {
		expect(tokenize("(jah)")).toEqual([
			{ type: "LPAREN" },
			{ type: "WORD", value: "jah" },
			{ type: "RPAREN" },
		]);
	});

	it("tokenizes minus prefix", () => {
		expect(tokenize("-ladder")).toEqual([
			{ type: "MINUS" },
			{ type: "WORD", value: "ladder" },
		]);
	});

	it("tokenizes base: expression", () => {
		expect(tokenize("base:sword")).toEqual([
			{ type: "BASE_EXPR", value: "sword" },
		]);
	});

	it("lowercases base: value", () => {
		expect(tokenize("base:Sword")).toEqual([
			{ type: "BASE_EXPR", value: "sword" },
		]);
	});

	it("tokenizes os: with colon as equality", () => {
		expect(tokenize("os:4")).toEqual([
			{ type: "NUM_EXPR", field: "sockets", op: "=", value: 4 },
		]);
	});

	it("tokenizes os>= expression", () => {
		expect(tokenize("os>=3")).toEqual([
			{ type: "NUM_EXPR", field: "sockets", op: ">=", value: 3 },
		]);
	});

	it("tokenizes os<= expression", () => {
		expect(tokenize("os<=2")).toEqual([
			{ type: "NUM_EXPR", field: "sockets", op: "<=", value: 2 },
		]);
	});

	it("tokenizes os> expression", () => {
		expect(tokenize("os>4")).toEqual([
			{ type: "NUM_EXPR", field: "sockets", op: ">", value: 4 },
		]);
	});

	it("tokenizes os< expression", () => {
		expect(tokenize("os<4")).toEqual([
			{ type: "NUM_EXPR", field: "sockets", op: "<", value: 4 },
		]);
	});

	it("tokenizes lvl: with colon as equality", () => {
		expect(tokenize("lvl:65")).toEqual([
			{ type: "NUM_EXPR", field: "level", op: "=", value: 65 },
		]);
	});

	it("tokenizes lvl<= expression", () => {
		expect(tokenize("lvl<=30")).toEqual([
			{ type: "NUM_EXPR", field: "level", op: "<=", value: 30 },
		]);
	});

	it("tokenizes lvl>= expression", () => {
		expect(tokenize("lvl>=25")).toEqual([
			{ type: "NUM_EXPR", field: "level", op: ">=", value: 25 },
		]);
	});

	it("tokenizes has: expression", () => {
		expect(tokenize("has:fcr")).toEqual([
			{ type: "HAS", value: "fcr" },
		]);
	});

	it("tokenizes multiple tokens", () => {
		expect(tokenize("jah base:armor")).toEqual([
			{ type: "WORD", value: "jah" },
			{ type: "BASE_EXPR", value: "armor" },
		]);
	});

	it("ignores extra whitespace", () => {
		expect(tokenize("  jah   ber  ")).toEqual([
			{ type: "WORD", value: "jah" },
			{ type: "WORD", value: "ber" },
		]);
	});

	it("tokenizes a quoted phrase as a single keyword", () => {
		expect(tokenize('"fire resistance"')).toEqual([
			{ type: "WORD", value: "fire resistance" },
		]);
	});

	it("lowercases quoted phrases", () => {
		expect(tokenize('"Fire Resistance"')).toEqual([
			{ type: "WORD", value: "fire resistance" },
		]);
	});

	it("handles quoted phrase alongside other tokens", () => {
		expect(tokenize('jah "fire resistance"')).toEqual([
			{ type: "WORD", value: "jah" },
			{ type: "WORD", value: "fire resistance" },
		]);
	});

	it("handles unclosed quote by consuming to end of input", () => {
		expect(tokenize('"fire resistance')).toEqual([
			{ type: "WORD", value: "fire resistance" },
		]);
	});

	it("tokenizes resistance aliases to the correct stat field", () => {
		const aliases: Array<[string, string]> = [
			["fireres>=30", "fres"],
			["coldres>=30", "cres"],
			["lightres>=30", "lres"],
			["lightningres>=30", "lres"],
			["poisonres>=30", "pres"],
			["psnres>=30", "pres"],
		];
		for (const [input, field] of aliases) {
			expect(tokenize(input)).toEqual([
				{ type: "NUM_EXPR", field, op: ">=", value: 30 },
			]);
		}
	});
});
