import type { BaseCategory, Rune } from "../types";

export const RUNES: Rune[] = [
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

export const RUNE_VALUES: Record<Rune, number> = {
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

export function strToRune(str: string): Rune | null {
	const lower = str.trim().toLowerCase();
	const rn = (lower.slice(0, 1).toUpperCase() + lower.slice(1)) as Rune;
	if (RUNES.includes(rn)) {
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
