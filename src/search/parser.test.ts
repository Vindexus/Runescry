import { describe, expect, it } from "vitest";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";

function parseQuery(query: string) {
	return parse(tokenize(query)).parsed;
}

function parseResult(query: string) {
	return parse(tokenize(query));
}

describe("parse", () => {
	it("returns null parsed for empty token list", () => {
		expect(parse([]).parsed).toBeNull();
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

	it("parses fcr comparison", () => {
		expect(parseQuery("fcr>=65")).toEqual({
			type: "NUM_EXPR",
			field: "fcr",
			value: 65,
			op: ">=",
		});
	});

	it("parses os: as NUM_EXPR node with sockets field", () => {
		expect(parseQuery("os:4")).toEqual({
			type: "NUM_EXPR",
			field: "sockets",
			op: "=",
			value: 4,
		});
	});

	it("parses lvl: as NUM_EXPR node with level field", () => {
		expect(parseQuery("lvl:65")).toEqual({
			type: "NUM_EXPR",
			field: "level",
			op: "=",
			value: 65,
		});
	});

	it("parses lvl<= as NUM_EXPR node with level field", () => {
		expect(parseQuery("lvl<=30")).toEqual({
			type: "NUM_EXPR",
			field: "level",
			op: "<=",
			value: 30,
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

	it("partially parses valid has: and records invalid has: as an error", () => {
		const result = parseResult("has:ds has:solarpanels");
		expect(result.parsed).toEqual({ type: "HAS", value: "ds" });
		expect(result.invalid).toHaveLength(1);
		expect(result.invalid[0].expression).toBe("has:solarpanels");
		expect(result.invalid[0].message).toContain("solarpanels");
	});

	it("rejects os value above max (6)", () => {
		const result = parseResult("os:7");
		expect(result.parsed).toBeNull();
		expect(result.invalid).toHaveLength(1);
		expect(result.invalid[0].expression).toBe("os:7");
	});

	it("rejects os value below min (2)", () => {
		const result = parseResult("os:1");
		expect(result.parsed).toBeNull();
		expect(result.invalid).toHaveLength(1);
		expect(result.invalid[0].expression).toBe("os:1");
	});

	it("rejects lvl value above max (99)", () => {
		const result = parseResult("lvl:100");
		expect(result.parsed).toBeNull();
		expect(result.invalid).toHaveLength(1);
		expect(result.invalid[0].expression).toBe("lvl:100");
	});

	it("rejects lvl value below min (1)", () => {
		const result = parseResult("lvl:0");
		expect(result.parsed).toBeNull();
		expect(result.invalid).toHaveLength(1);
		expect(result.invalid[0].expression).toBe("lvl:0");
	});

	it("accepts os value within valid range", () => {
		const result = parseResult("os:4");
		expect(result.parsed).not.toBeNull();
		expect(result.invalid).toHaveLength(0);
	});

	it("records an error for an unclosed opening parenthesis", () => {
		const result = parseResult("(coldres>10 or (psnres>20 psnres<70)");
		expect(result.parsed).not.toBeNull();
		expect(result.invalid).toHaveLength(1);
		expect(result.invalid[0].expression).toBe("(");
		expect(result.invalid[0].message).toContain("Missing closing )");
	});
});
