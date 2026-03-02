import type { ASTNode } from "./parser";
import type { BaseCategory, BoolFilter, Rune, Runeword } from "../types";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";

// Each BaseCategory maps to its constituent leaf types (or itself if it is a leaf)
const BASE_CATEGORY_MEMBERS: Record<BaseCategory, BaseCategory[]> = {
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

function getLeafBases(cat: BaseCategory): BaseCategory[] {
	const members = BASE_CATEGORY_MEMBERS[cat];
	if (members.length === 1 && members[0] === cat) {
		return members;
	}
	return members.flatMap(getLeafBases);
}

function matchBase(runeword: Runeword, value: string): boolean {
	if (!(value in BASE_CATEGORY_MEMBERS)) {
		return false;
	}
	const searchLeaves = getLeafBases(value as BaseCategory);
	return runeword.bases.some((base) => {
		const baseLeaves = getLeafBases(base);
		return baseLeaves.some((leaf) => searchLeaves.includes(leaf));
	});
}

function matchKeyword(runeword: Runeword, keyword: string): boolean {
	const kw = keyword.toLowerCase();
	return (
		runeword.name.toLowerCase().includes(kw) ||
		runeword.attributes.join(" ").toLowerCase().includes(kw) ||
		runeword.runes.some((r) => r.toLowerCase().includes(kw))
	);
}

function matchRune(runeword: Runeword, rune: Rune): boolean {
	return runeword.runes.includes(rune);
}

function matchBool(runeword: Runeword, boolField: BoolFilter): boolean {
	if (boolField === "rotw") {
		return runeword.rotw === true;
	}

	if (boolField === "ladder") {
		return runeword.ladderOnly === true;
	}

	throw new Error(`Unrecognized bool field ${boolField}`);
}

export function matchNode(runeword: Runeword, node: ASTNode): boolean {
	switch (node.type) {
		case "AND":
			return node.children.every((child) => matchNode(runeword, child));
		case "OR":
			return node.children.some((child) => matchNode(runeword, child));
		case "NOT":
			return !matchNode(runeword, node.child);
		case "KEYWORD":
			return matchKeyword(runeword, node.value);
		case "RUNE":
			return matchRune(runeword, node.value);
		case "BOOL":
			return matchBool(runeword, node.value);
		case "OS_EXPR": {
			const s = runeword.runes.length;
			const v = node.value;
			switch (node.op) {
				case "=":
					return s === v;
				case ">":
					return s > v;
				case "<":
					return s < v;
				case ">=":
					return s >= v;
				case "<=":
					return s <= v;
				default:
					throw new Error(`Unexpected operator: ${node.op}`);
			}
		}
		case "BASE_EXPR":
			return matchBase(runeword, node.value);
	}
}

export function filterRunewords(
	runewords: Runeword[],
	query: string,
): Runeword[] {
	if (!query.trim()) {
		return runewords;
	}

	try {
		const tokens = tokenize(query);
		const ast = parse(tokens);
		if (!ast) {
			return runewords;
		}
		return runewords.filter((rw) => matchNode(rw, ast));
	} catch {
		// Return all results if the query is malformed/incomplete
		return runewords;
	}
}
