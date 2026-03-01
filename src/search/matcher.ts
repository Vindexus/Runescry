import type { ASTNode } from "./parser";
import type { BaseCategory, Runeword } from "../types";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";

// Group aliases expand to lists of concrete BaseCategory values
const BASE_GROUPS: Record<string, BaseCategory[]> = {
	melee: [
		"sword",
		"axe",
		"mace",
		"hammer",
		"scepter",
		"polearm",
		"spear",
		"claw",
	],
	ranged: ["bow", "crossbow"],
	weapon: [
		"sword",
		"axe",
		"mace",
		"hammer",
		"scepter",
		"polearm",
		"spear",
		"claw",
		"bow",
		"crossbow",
		"staff",
		"wand",
		"orb",
	],
	all: [
		"sword",
		"axe",
		"mace",
		"hammer",
		"scepter",
		"polearm",
		"spear",
		"claw",
		"bow",
		"crossbow",
		"staff",
		"wand",
		"orb",
		"helm",
		"armor",
		"shield",
		"gloves",
		"boots",
		"belt",
	],
};

function matchBase(runeword: Runeword, value: string): boolean {
	const group = BASE_GROUPS[value];
	if (group) {
		return runeword.bases.some((b) => group.includes(b));
	}
	return runeword.bases.includes(value as BaseCategory);
}

function matchKeyword(runeword: Runeword, keyword: string): boolean {
	const kw = keyword.toLowerCase();
	return (
		runeword.name.toLowerCase().includes(kw) ||
		runeword.description.toLowerCase().includes(kw) ||
		runeword.runes.some((r) => r.toLowerCase().includes(kw))
	);
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
		case "OS_EXPR": {
			const s = runeword.sockets;
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
	if (!query.trim()) return runewords;

	try {
		const tokens = tokenize(query);
		const ast = parse(tokens);
		if (!ast) return runewords;
		return runewords.filter((rw) => matchNode(rw, ast));
	} catch {
		// Return all results if the query is malformed/incomplete
		return runewords;
	}
}
