import type { BaseCategory, Rune, RuneName } from "../types";

export const RUNE_NAMES: RuneName[] = [
	"El",
	"Eld",
	"Tir",
	"Nef",
	"Eth",
	"Ith",
	"Tal",
	"Ral",
	"Ort",
	"Thul",
	"Amn",
	"Sol",
	"Shael",
	"Dol",
	"Hel",
	"Io",
	"Lum",
	"Ko",
	"Fal",
	"Lem",
	"Pul",
	"Um",
	"Mal",
	"Ist",
	"Gul",
	"Vex",
	"Ohm",
	"Lo",
	"Sur",
	"Ber",
	"Jah",
	"Cham",
	"Zod",
];

export const RUNES: Rune[] = [
	{ name: "El", clvl: 11 },
	{ name: "Eld", clvl: 11 },
	{ name: "Tir", clvl: 13 },
	{ name: "Nef", clvl: 13 },
	{ name: "Eth", clvl: 15 },
	{ name: "Ith", clvl: 15 },
	{ name: "Tal", clvl: 17 },
	{ name: "Ral", clvl: 19 },
	{ name: "Ort", clvl: 21 },
	{ name: "Thul", clvl: 23 },
	{ name: "Amn", clvl: 25 },
	{ name: "Sol", clvl: 27 },
	{ name: "Shael", clvl: 29 },
	{ name: "Dol", clvl: 31 },
	{ name: "Hel", clvl: 33 }, // No clvl requirement, but ilvl 33 — used for scoring
	{ name: "Io", clvl: 35 },
	{ name: "Lum", clvl: 37 },
	{ name: "Ko", clvl: 39 },
	{ name: "Fal", clvl: 41 },
	{ name: "Lem", clvl: 43 },
	{ name: "Pul", clvl: 45 },
	{ name: "Um", clvl: 47 },
	{ name: "Mal", clvl: 49 },
	{ name: "Ist", clvl: 51 },
	{ name: "Gul", clvl: 53 },
	{ name: "Vex", clvl: 55 },
	{ name: "Ohm", clvl: 57 },
	{ name: "Lo", clvl: 59 },
	{ name: "Sur", clvl: 61 },
	{ name: "Ber", clvl: 63 },
	{ name: "Jah", clvl: 65 },
	{ name: "Cham", clvl: 67 },
	{ name: "Zod", clvl: 69 },
];

export const RUNE_VALUES: Record<RuneName, number> = {
	El: 1,
	Eld: 2,
	Tir: 3,
	Nef: 4,
	Eth: 5,
	Ith: 6,
	Tal: 7,
	Ral: 8,
	Ort: 9,
	Thul: 10,
	Amn: 12,
	Sol: 15,
	Shael: 19,
	Dol: 24,
	Hel: 30,
	Io: 38,
	Lum: 48,
	Ko: 61,
	Fal: 77,
	Lem: 97,
	Pul: 122,
	Um: 154,
	Mal: 194,
	Ist: 244,
	Gul: 308,
	Vex: 388,
	Ohm: 489,
	Lo: 616,
	Sur: 776,
	Ber: 977,
	Jah: 1231,
	Cham: 1551,
	Zod: 1953,
};

export function strToRune(str: string): RuneName | null {
	const lower = str.trim().toLowerCase();
	const rn = (lower.slice(0, 1).toUpperCase() + lower.slice(1)) as RuneName;
	if (RUNE_NAMES.includes(rn)) {
		return rn;
	}

	return null;
}

const BASE_ALIASES: Record<string, BaseCategory> = {
	armour: "armor",
	body: "armor",
	chest: "armor",
	head: "helm",
	hat: "helm",
};

export function strToBase(str: string): BaseCategory {
	return (BASE_ALIASES[str] ?? str) as BaseCategory;
}
