import { describe, expect, it } from "vitest";
import { matchNode } from "./matcher";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";
import type { Runeword } from "../types";
import { RUNEWORDS, rwDefToRuneword } from "../data/runewords";

function filterRunewords(runewords: Runeword[], query: string): Runeword[] {
	if (!query.trim()) {
		return runewords;
	}
	const { parsed } = parse(tokenize(query));
	if (!parsed) {
		return runewords;
	}
	return runewords.filter((rw) => matchNode(rw, parsed));
}

function makeRuneword(overrides: Partial<Runeword>): Runeword {
	return rwDefToRuneword({
		id: "test",
		name: "Test",
		runes: [],
		bases: ["sword"],
		attributes: [],
		level: 1,
		ladderOnly: false,
		rotw: false,
		tags: [],
		value: 0,
		...overrides,
	});
}

const enigma = makeRuneword({
	id: "enigma",
	name: "Enigma",
	runes: ["Jah", "Ith", "Ber"],
	bases: ["armor"],
	attributes: ["+1 To Teleport", "45% Faster Run/Walk"],
	level: 65,
	ladderOnly: true,
	tags: [],
});

const spirit = makeRuneword({
	id: "spirit",
	name: "Spirit",
	runes: ["Tal", "Thul", "Ort", "Amn"],
	bases: ["sword", "shield"],
	attributes: ["+2 To All Skills", "+25-35% Faster Cast Rate"],
	level: 25,
	tags: ["fcr"],
});

const insight = makeRuneword({
	id: "insight",
	name: "Insight",
	runes: ["Ral", "Tir", "Tal", "Sol"],
	bases: ["polearm", "staff"],
	attributes: ["Level 12-17 Meditation Aura When Equipped"],
	level: 27,
	tags: ["aura"],
});

const grief = makeRuneword({
	id: "grief",
	name: "Grief",
	runes: ["Eth", "Tir", "Lo", "Mal", "Ral"],
	bases: ["melee"],
	attributes: ["+340-400 Damage", "35% Chance of Deadly Strike"],
	level: 59,
	ladderOnly: true,
	tags: [],
});

const testRunewords = [enigma, spirit, insight, grief];

describe("filterRunewords", () => {
	it("returns all runewords for empty query", () => {
		expect(filterRunewords(testRunewords, "")).toHaveLength(4);
	});

	it("filters by keyword in name", () => {
		const results = filterRunewords(testRunewords, "enigma");
		expect(results[0].name).toBe("Enigma");
	});

	it("filters by keyword in attributes", () => {
		const results = filterRunewords(testRunewords, "teleport");
		expect(results[0].name).toBe("Enigma");
	});

	it("filters by rune name", () => {
		const results = filterRunewords(testRunewords, "jah");
		expect(results[0].name).toBe("Enigma");
	});

	it("filters by rune shared across multiple runewords", () => {
		const results = filterRunewords(testRunewords, "tal");
		expect(results.length).toBeGreaterThan(1);
	});

	it("filters by exact base", () => {
		const results = filterRunewords(testRunewords, "base:armor");
		expect(results[0].name).toBe("Enigma");
	});

	it("finds runeword with category base via concrete type search", () => {
		// grief has bases: ["melee"], searching base:sword should find it
		const results = filterRunewords(testRunewords, "base:sword");
		expect(results.map((r) => r.name)).toContain("Grief");
	});

	it("finds concrete-base runeword via category search", () => {
		// insight has bases: ["polearm"], searching base:melee should find it
		const results = filterRunewords(testRunewords, "base:melee");
		expect(results.map((r) => r.name)).toContain("Insight");
	});

	it("filters by ladder flag", () => {
		const results = filterRunewords(testRunewords, "ladder");
		expect(results.map((r) => r.name)).toEqual(
			expect.arrayContaining(["Enigma", "Grief"]),
		);
	});

	it("negates ladder flag", () => {
		const results = filterRunewords(testRunewords, "-ladder");
		expect(results.map((r) => r.name)).toEqual(
			expect.arrayContaining(["Spirit", "Insight"]),
		);
	});

	it("filters by has: tag", () => {
		const results = filterRunewords(testRunewords, "has:fcr");
		expect(results[0].name).toBe("Spirit");
	});

	it("filters by has: aura tag", () => {
		const results = filterRunewords(testRunewords, "has:aura");
		expect(results[0].name).toBe("Insight");
	});

	it("combines filters with implicit AND", () => {
		const results = filterRunewords(testRunewords, "jah base:armor");
		expect(results[0].name).toBe("Enigma");
	});

	it("handles OR between runes", () => {
		const results = filterRunewords(testRunewords, "jah or ber");
		// Enigma has both; no other runeword has either
		expect(results[0].name).toBe("Enigma");
	});

	it("handles NOT negation", () => {
		const results = filterRunewords(testRunewords, "base:sword -ladder");
		expect(results.map((r) => r.name)).toContain("Spirit");
		expect(results.map((r) => r.name)).not.toContain("Enigma");
	});

	it("returns all runewords for malformed query", () => {
		// Parser should handle gracefully and return all
		expect(filterRunewords(testRunewords, "or or")).toHaveLength(4);
	});

	it("filters by level with lvl:= ", () => {
		const results = filterRunewords(testRunewords, "lvl:65");
		expect(results.map((r) => r.name)).toContain("Enigma");
	});

	it("filters by has gold find", () => {
		const prides = RUNEWORDS.filter((x) => x.name === "Pride");
		const results = filterRunewords(prides, "has:gf");
		expect(results.map((r) => r.name)).toContain("Pride");
	});

	it("filters by level with lvl<=", () => {
		const results = filterRunewords(testRunewords, "lvl<=27");
		expect(results.map((r) => r.name)).toEqual(
			expect.arrayContaining(["Spirit", "Insight"]),
		);
	});

	it("filters by sockets with os:4", () => {
		// spirit has 4 runes, insight has 4 runes
		const results = filterRunewords(testRunewords, "os:4");
		expect(results.map((r) => r.name)).toEqual(
			expect.arrayContaining(["Spirit", "Insight"]),
		);
	});

	it("filters by sockets with os>=5", () => {
		// grief has 5 runes
		const results = filterRunewords(testRunewords, "os>=5");
		expect(results.map((r) => r.name)).toContain("Grief");
	});

	it("find Obsession by fcr", () => {
		const results = filterRunewords(RUNEWORDS, "fcr>=65");
		expect(results.map((r) => r.name)).toContain("Obsession");
	});

	it("find Honor by ll", () => {
		const results = filterRunewords(RUNEWORDS, "ll>=6 ll<=7");
		expect(results.map((r) => r.name)).toContain("Honor");
	});

	describe("test cases that came up while debugging", () => {
		it("find Destruction", () => {
			const results = filterRunewords(
				RUNEWORDS,
				"has:itd ed>=200 has:ml has:cb",
			);
			expect(results.map((r) => r.name)).toEqual(["Destruction"]);
		});
	});
});
