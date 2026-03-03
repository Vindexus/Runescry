import { RUNES } from "./runes";
import type { RuneName } from "../types";

// Tier boundaries by clvl (inclusive start)
// Low:  El  (clvl 11) through Lem (clvl 43) — clvl < MID_START_CLVL
// Mid:  Pul (clvl 45) through Gul (clvl 53) — clvl < HIGH_START_CLVL
// High: Vex (clvl 55) through Zod (clvl 69)

const MID_START_CLVL = 45; // Pul
const HIGH_START_CLVL = 55; // Vex

// Tier bonuses are the cost of the maximum rune from the previous tier,
// making each tier's floor naturally higher than the previous tier's ceiling.
// Mid bonus  = cost(Lem) = Lem.clvl + 0   = 43
// High bonus = cost(Gul) = Gul.clvl + 43  = 96

const lemClvl = RUNES.find((r) => r.name === "Lem")!.clvl;
const gulClvl = RUNES.find((r) => r.name === "Gul")!.clvl;

const MID_TIER_BONUS = lemClvl;
const HIGH_TIER_BONUS = gulClvl + MID_TIER_BONUS;

function getRuneTierBonus(clvl: number): number {
	if (clvl >= HIGH_START_CLVL) {
		return HIGH_TIER_BONUS;
	}
	if (clvl >= MID_START_CLVL) {
		return MID_TIER_BONUS;
	}
	return 0;
}

function singleRuneCost(name: RuneName): number {
	const rune = RUNES.find((r) => r.name === name);
	if (!rune) {
		throw new Error(`Unknown rune: ${name}`);
	}
	return rune.clvl + getRuneTierBonus(rune.clvl);
}

export function runeCost(runes: RuneName[]): number {
	return runes.reduce((acc, name) => acc + singleRuneCost(name), 0);
}
