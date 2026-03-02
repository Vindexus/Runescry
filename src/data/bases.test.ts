import { describe, expect, it } from "vitest";
import { getLeafBases } from "./bases";

describe("getLeafBases", () => {
	it("returns itself for a leaf node", () => {
		expect(getLeafBases("sword")).toEqual(["sword"]);
	});

	it("expands melee to all melee weapon types", () => {
		const leaves = getLeafBases("melee");
		expect(leaves).toContain("sword");
		expect(leaves).toContain("axe");
		expect(leaves).toContain("polearm");
		expect(leaves).toContain("claw");
		expect(leaves).toContain("dagger");
		expect(leaves).not.toContain("bow");
		expect(leaves).not.toContain("staff");
	});

	it("expands ranged to bow and crossbow", () => {
		expect(getLeafBases("ranged")).toEqual(["bow", "crossbow"]);
	});

	it("expands weapon to all melee, ranged, and caster weapon types", () => {
		const leaves = getLeafBases("weapon");
		// melee
		expect(leaves).toContain("sword");
		expect(leaves).toContain("axe");
		// ranged
		expect(leaves).toContain("bow");
		expect(leaves).toContain("crossbow");
		// caster
		expect(leaves).toContain("staff");
		expect(leaves).toContain("wand");
		expect(leaves).toContain("orb");
		// not armor
		expect(leaves).not.toContain("helm");
		expect(leaves).not.toContain("armor");
	});

	it("contains no duplicates for weapon expansion", () => {
		const leaves = getLeafBases("weapon");
		expect(leaves.length).toBe(new Set(leaves).size);
	});

	it("returns itself for armor leaf", () => {
		expect(getLeafBases("armor")).toEqual(["armor"]);
	});
});
