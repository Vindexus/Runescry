import { describe, expect, it } from "vitest";
import { RUNEWORDS } from "./runewords";

describe("runewords", () => {
	it("should parse Obsession", () => {
		const rw = RUNEWORDS.find((x) => x.name === "Obsession");
		expect(rw).toBeDefined();
		expect(rw!.stats).toMatchObject({
			str: null,
			vit: [10, 10],
			mf: [30, 30],
			fcr: [65, 65],
		});
	});
	it("should parse Spirit", () => {
		const rw = RUNEWORDS.find((x) => x.name === "Spirit (Sword)");
		expect(rw).toBeDefined();
		expect(rw!.stats).toMatchObject({
			fcr: [25, 35],
		});
	});
	it("should parse Pride", () => {
		const rw = RUNEWORDS.find((x) => x.name === "Pride");
		expect(rw).toBeDefined();
		expect(rw!.stats).toMatchObject({
			gf: [1, 185],
		});
	});
	it("Silence: allres +75 contributes to all individual resistances", () => {
		const rw = RUNEWORDS.find((x) => x.name === "Silence");
		expect(rw).toBeDefined();
		expect(rw!.stats).toMatchObject({
			allres: [75, 75],
			cres: [75, 75],
			fres: [75, 75],
			lres: [75, 75],
			pres: [75, 75],
			res: [300, 300],
		});
	});
	it("Duress: individual resistances sum correctly with no allres", () => {
		const rw = RUNEWORDS.find((x) => x.name === "Duress");
		expect(rw).toBeDefined();
		expect(rw!.stats).toMatchObject({
			allres: null,
			cres: [45, 45],
			fres: [15, 15],
			lres: [15, 15],
			pres: [15, 15],
			res: [90, 90],
		});
	});
});

describe("game version filtering", () => {
	it("og version includes og runewords", () => {
		const og = RUNEWORDS.filter((rw) => rw.versions.includes("og"));
		const names = og.map((rw) => rw.name);
		expect(names).toContain("Stealth");
		expect(names).toContain("Lore");
		expect(names).toContain("Ancient's Pledge");
	});

	it("og version does not include 1.10 runewords", () => {
		const og = RUNEWORDS.filter((rw) => rw.versions.includes("og"));
		const names = og.map((rw) => rw.name);
		expect(names).not.toContain("Enigma");
		expect(names).not.toContain("Grief");
		expect(names).not.toContain("Infinity");
	});

	it("1.10 version includes og and 1.10 runewords", () => {
		const v110 = RUNEWORDS.filter((rw) => rw.versions.includes("1.10"));
		const names = v110.map((rw) => rw.name);
		expect(names).toContain("Stealth");
		expect(names).toContain("Enigma");
		expect(names).toContain("Infinity");
	});

	it("1.10 version does not include 1.11+ runewords", () => {
		const v110 = RUNEWORDS.filter((rw) => rw.versions.includes("1.10"));
		const names = v110.map((rw) => rw.name);
		expect(names).not.toContain("Treachery");
		expect(names).not.toContain("Flickering Flame");
	});

	it("rotw version includes everything except version-locked runewords", () => {
		const rotw = RUNEWORDS.filter((rw) => rw.versions.includes("rotw"));
		const names = rotw.map((rw) => rw.name);
		expect(names).toContain("Stealth");
		expect(names).toContain("Enigma");
		expect(names).toContain("Mania");
		expect(names).toContain("Hysteria");
	});

	it("Hustle variants are not available in rotw", () => {
		const rotw = RUNEWORDS.filter((rw) => rw.versions.includes("rotw"));
		const names = rotw.map((rw) => rw.name);
		expect(names).not.toContain("Hustle (Weapon)");
		expect(names).not.toContain("Hustle (Armor)");
	});

	it("Hustle variants are available in 2.6", () => {
		const v26 = RUNEWORDS.filter((rw) => rw.versions.includes("2.6"));
		const names = v26.map((rw) => rw.name);
		expect(names).toContain("Hustle (Weapon)");
		expect(names).toContain("Hustle (Armor)");
	});

	it("Mania and Hysteria are only available in rotw", () => {
		const mania = RUNEWORDS.find((rw) => rw.name === "Mania");
		const hysteria = RUNEWORDS.find((rw) => rw.name === "Hysteria");
		expect(mania!.versions).toEqual(["rotw"]);
		expect(hysteria!.versions).toEqual(["rotw"]);
	});
});
