import { describe, expect, it } from "vitest";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";

function parseQuery(query: string) {
	return parse(tokenize(query));
}

describe("parse", () => {
	it("returns null for empty token list", () => {
		expect(parse([])).toBeNull();
	});

	it("parses a rune name as a RUNE node", () => {
		expect(parseQuery("jah")).toEqual({ type: "RUNE", value: "Jah" });
	});

	it("parses an unknown keyword as KEYWORD node", () => {
		expect(parseQuery("teleport")).toEqual({
			type: "KEYWORD",
			value: "teleport",
		});
	});

	it("parses 'ladder' as a BOOL node", () => {
		expect(parseQuery("ladder")).toEqual({ type: "BOOL", value: "ladder" });
	});

	it("parses 'rotw' as a BOOL node", () => {
		expect(parseQuery("rotw")).toEqual({ type: "BOOL", value: "rotw" });
	});

	it("parses base: as BASE_EXPR node", () => {
		expect(parseQuery("base:sword")).toEqual({
			type: "BASE_EXPR",
			value: "sword",
		});
	});

	it("parses has: as HAS node", () => {
		expect(parseQuery("has:fcr")).toEqual({ type: "HAS", value: "fcr" });
	});

	it("parses os: as OS_EXPR node", () => {
		expect(parseQuery("os:4")).toEqual({
			type: "OS_EXPR",
			op: "=",
			value: 4,
		});
	});

	it("parses implicit AND between two terms", () => {
		expect(parseQuery("jah ber")).toEqual({
			type: "AND",
			children: [
				{ type: "RUNE", value: "Jah" },
				{ type: "RUNE", value: "Ber" },
			],
		});
	});

	it("parses OR between two terms", () => {
		expect(parseQuery("jah or ber")).toEqual({
			type: "OR",
			children: [
				{ type: "RUNE", value: "Jah" },
				{ type: "RUNE", value: "Ber" },
			],
		});
	});

	it("parses negation with minus", () => {
		expect(parseQuery("-ladder")).toEqual({
			type: "NOT",
			child: { type: "BOOL", value: "ladder" },
		});
	});

	it("parses grouped OR with implicit AND", () => {
		expect(parseQuery("(jah or ber) base:armor")).toEqual({
			type: "AND",
			children: [
				{
					type: "OR",
					children: [
						{ type: "RUNE", value: "Jah" },
						{ type: "RUNE", value: "Ber" },
					],
				},
				{ type: "BASE_EXPR", value: "armor" },
			],
		});
	});
});
