import { describe, expect, it } from "vitest";
import { RUNEWORDS } from "./runewords";

describe("runewords", () => {
	it("should parse Obsession", () => {
		const rw = RUNEWORDS.find((x) => x.name === "Obsession");
		expect(rw).toBeDefined();
		expect(rw!.stats).toMatchObject({
			str: undefined,
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
});
