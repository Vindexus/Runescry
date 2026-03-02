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
