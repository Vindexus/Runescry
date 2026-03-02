export type BoolFilter = "ladder" | "rotw";

export type BaseCategory =
	// Category aliases (expand to multiple concrete types)
	| "weapon" // all weapons
	| "melee" // all melee weapons
	| "ranged" // all ranged weapons
	// Concrete weapon types
	| "sword"
	| "axe"
	| "mace"
	| "hammer"
	| "scepter"
	| "polearm"
	| "spear"
	| "claw"
	| "dagger"
	| "club"
	| "bow"
	| "crossbow"
	| "staff"
	| "wand"
	| "orb"
	// Armor / other
	| "helm"
	| "armor" // body armor
	| "shield"
	| "gloves"
	| "boots"
	| "belt";

export type Rune =
	| "El"
	| "Eld"
	| "Tir"
	| "Nef"
	| "Eth"
	| "Ith"
	| "Tal"
	| "Ral"
	| "Ort"
	| "Thul"
	| "Amn"
	| "Sol"
	| "Shael"
	| "Dol"
	| "Hel"
	| "Io"
	| "Lum"
	| "Ko"
	| "Fal"
	| "Lem"
	| "Pul"
	| "Um"
	| "Mal"
	| "Ist"
	| "Gul"
	| "Vex"
	| "Ohm"
	| "Lo"
	| "Sur"
	| "Ber"
	| "Jah"
	| "Cham"
	| "Zod";

export type RunewordDef = {
	name: string;
	runes: Rune[]; // e.g. ["Jah", "Ith", "Ber"]
	bases: BaseCategory[];
	attributes: string[];
	level: number;
	ladderOnly?: boolean;
	rotw?: boolean;
};

export type Tag = "fcr" | "ias" | "aura" | "ed" | "mf";

export type Runeword = Required<RunewordDef> & {
	id: string;
	tags: Tag[];
	value: number;
};
