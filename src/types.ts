export type BaseCategory =
	| "sword"
	| "axe"
	| "mace"
	| "hammer"
	| "scepter"
	| "polearm"
	| "spear"
	| "claw"
	| "bow"
	| "crossbow"
	| "staff"
	| "wand"
	| "orb"
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

export type Runeword = {
	name: string;
	runes: Rune[]; // e.g. ["Jah", "Ith", "Ber"]
	sockets: number;
	bases: BaseCategory[]; // item types this runeword can be made in
	description: string; // notable properties, auras, skills
	levelReq: number;
	ladderOnly?: boolean;
};
