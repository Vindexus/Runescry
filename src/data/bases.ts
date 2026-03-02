import type { BaseCategory } from "../types";

// Each BaseCategory maps to its constituent leaf types (or itself if it is a leaf)
export const BASE_CATEGORY_MEMBERS: Record<BaseCategory, BaseCategory[]> = {
	// Category nodes
	weapon: ["melee", "ranged", "staff", "wand", "orb"],
	melee: [
		"sword",
		"axe",
		"mace",
		"hammer",
		"scepter",
		"polearm",
		"spear",
		"claw",
		"dagger",
		"club",
	],
	ranged: ["bow", "crossbow"],
	// Leaf nodes — concrete weapon types
	sword: ["sword"],
	axe: ["axe"],
	mace: ["mace"],
	hammer: ["hammer"],
	scepter: ["scepter"],
	polearm: ["polearm"],
	spear: ["spear"],
	claw: ["claw"],
	dagger: ["dagger"],
	club: ["club"],
	bow: ["bow"],
	crossbow: ["crossbow"],
	staff: ["staff"],
	wand: ["wand"],
	orb: ["orb"],
	// Leaf nodes — armor / other
	helm: ["helm"],
	armor: ["armor"],
	shield: ["shield"],
	gloves: ["gloves"],
	boots: ["boots"],
	belt: ["belt"],
};

export function getLeafBases(cat: BaseCategory): BaseCategory[] {
	const members = BASE_CATEGORY_MEMBERS[cat];
	if (members.length === 1 && members[0] === cat) {
		return members;
	}
	return members.flatMap(getLeafBases);
}
