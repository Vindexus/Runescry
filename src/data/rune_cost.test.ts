import { describe, expect, it } from "vitest";
import { runeCost } from "./rune_cost";

// Single rune costs:
//   Low  (clvl + 0):   El=11, Dol=31, Hel=33, Io=35, Lem=43
//   Mid  (clvl + 43):  Pul=88, Gul=96
//   High (clvl + 96):  Vex=151, Zod=165

describe("runeCost", () => {
	it("costs a low rune as clvl only", () => {
		expect(runeCost(["El"])).toBe(11);
		expect(runeCost(["Lem"])).toBe(43);
	});

	it("costs a mid rune as clvl + max-low-cost (43)", () => {
		expect(runeCost(["Pul"])).toBe(88); // 45 + 43
		expect(runeCost(["Gul"])).toBe(96); // 53 + 43
	});

	it("costs a high rune as clvl + max-mid-cost (96)", () => {
		expect(runeCost(["Vex"])).toBe(151); // 55 + 96
		expect(runeCost(["Zod"])).toBe(165); // 69 + 96
	});

	it("six El runes cost less than one Pul", () => {
		// 6 * 11 = 66 < 88
		expect(runeCost(["El", "El", "El", "El", "El", "El"])).toBeLessThan(
			runeCost(["Pul"]),
		);
	});

	it("six Lem runes (max low) cost more than one Pul (min mid)", () => {
		// 6 * 43 = 258 > 88 — quantity of high-low runes can beat a single low-mid
		expect(runeCost(["Lem", "Lem", "Lem", "Lem", "Lem", "Lem"])).toBeGreaterThan(
			runeCost(["Pul"]),
		);
	});

	it("higher clvl costs more within the same tier", () => {
		expect(runeCost(["Lem"])).toBeGreaterThan(runeCost(["El"]));
		expect(runeCost(["Gul"])).toBeGreaterThan(runeCost(["Pul"]));
		expect(runeCost(["Zod"])).toBeGreaterThan(runeCost(["Vex"]));
	});

	it("Hel costs between Dol and Io (uses ilvl 33 since it has no clvl requirement)", () => {
		expect(runeCost(["Hel"])).toBeGreaterThan(runeCost(["Dol"])); // 33 > 31
		expect(runeCost(["Hel"])).toBeLessThan(runeCost(["Io"])); // 33 < 35
	});

	it("more runes of the same kind cost more", () => {
		expect(runeCost(["Ber", "Ber"])).toBeGreaterThan(runeCost(["Ber"]));
	});

	it("mid rune always costs more than zero runes", () => {
		expect(runeCost(["Pul"])).toBeGreaterThan(runeCost([]));
	});
});
