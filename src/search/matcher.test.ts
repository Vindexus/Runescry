import { describe, expect, it } from "vitest";
import { matchNode } from "./matcher";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";
import type { Runeword } from "../types";

function filterRunewords(runewords: Runeword[], query: string): Runeword[] {
	if (!query.trim()) {
		return runewords;
	}
	try {
		const ast = parse(tokenize(query));
		if (!ast) {
			return runewords;
		}
		return runewords.filter((rw) => matchNode(rw, ast));
	} catch {
		return runewords;
	}
}

function makeRuneword(overrides: Partial<Runeword>): Runeword {
	return {
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
	};
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

const allRunewords = [enigma, spirit, insight, grief];

describe("filterRunewords", () => {
	it("returns all runewords for empty query", () => {
		expect(filterRunewords(allRunewords, "")).toHaveLength(4);
	});

	it("filters by keyword in name", () => {
		const results = filterRunewords(allRunewords, "enigma");
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Enigma");
	});

	it("filters by keyword in attributes", () => {
		const results = filterRunewords(allRunewords, "teleport");
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Enigma");
	});

	it("filters by rune name", () => {
		const results = filterRunewords(allRunewords, "jah");
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Enigma");
	});

	it("filters by rune shared across multiple runewords", () => {
		const results = filterRunewords(allRunewords, "tal");
		expect(results).toHaveLength(2);
	});

	it("filters by exact base", () => {
		const results = filterRunewords(allRunewords, "base:armor");
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Enigma");
	});

	it("finds runeword with category base via concrete type search", () => {
		// grief has bases: ["melee"], searching base:sword should find it
		const results = filterRunewords(allRunewords, "base:sword");
		expect(results.map((r) => r.name)).toContain("Grief");
	});

	it("finds concrete-base runeword via category search", () => {
		// insight has bases: ["polearm"], searching base:melee should find it
		const results = filterRunewords(allRunewords, "base:melee");
		expect(results.map((r) => r.name)).toContain("Insight");
	});

	it("filters by ladder flag", () => {
		const results = filterRunewords(allRunewords, "ladder");
		expect(results.map((r) => r.name)).toEqual(
			expect.arrayContaining(["Enigma", "Grief"]),
		);
		expect(results).toHaveLength(2);
	});

	it("negates ladder flag", () => {
		const results = filterRunewords(allRunewords, "-ladder");
		expect(results.map((r) => r.name)).toEqual(
			expect.arrayContaining(["Spirit", "Insight"]),
		);
		expect(results).toHaveLength(2);
	});

	it("filters by has: tag", () => {
		const results = filterRunewords(allRunewords, "has:fcr");
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Spirit");
	});

	it("filters by has: aura tag", () => {
		const results = filterRunewords(allRunewords, "has:aura");
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Insight");
	});

	it("combines filters with implicit AND", () => {
		const results = filterRunewords(allRunewords, "jah base:armor");
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Enigma");
	});

	it("handles OR between runes", () => {
		const results = filterRunewords(allRunewords, "jah or ber");
		// Enigma has both; no other runeword has either
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("Enigma");
	});

	it("handles NOT negation", () => {
		const results = filterRunewords(allRunewords, "base:sword -ladder");
		expect(results.map((r) => r.name)).toContain("Spirit");
		expect(results.map((r) => r.name)).not.toContain("Enigma");
	});

	it("returns all runewords for malformed query", () => {
		// Parser should handle gracefully and return all
		expect(filterRunewords(allRunewords, "or or")).toHaveLength(4);
	});
});
