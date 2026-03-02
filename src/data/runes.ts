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

export function strToRune(str: string): Rune | null {
	const lower = str.trim().toLowerCase();
	const rn = (lower.slice(0, 1).toUpperCase() + lower.slice(1)) as Rune;
	if (RUNES.includes(rn)) {
		return rn;
	}

	return null;
}

// TODO: Move this. Then have some actual data validation.
export function strToBase(str: string): BaseCategory {
	return str as BaseCategory;
}
