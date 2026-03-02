import type { ASTNode } from "./parser";
import type { BaseCategory, BoolFilter, Rune, Runeword } from "../types";
import { BASE_CATEGORY_MEMBERS, getLeafBases } from "../data/bases";
import { matchTag, stringToTag } from "../data/tags";

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
	if (node.type === "AND") {
		return node.children.every((child) => matchNode(runeword, child));
	} else if (node.type === "OR") {
		return node.children.some((child) => matchNode(runeword, child));
	} else if (node.type === "NOT") {
		return !matchNode(runeword, node.child);
	} else if (node.type === "KEYWORD") {
		return matchKeyword(runeword, node.value);
	} else if (node.type === "RUNE") {
		return matchRune(runeword, node.value);
	} else if (node.type === "BOOL") {
		return matchBool(runeword, node.value);
	} else if (node.type === "HAS") {
		const tag = stringToTag(node.value);
		if (tag) {
			return matchTag(runeword, tag);
		}
		throw new Error(`Has got bad tag: ${node.value}`);
	} else if (node.type === "OS_EXPR") {
		const s = runeword.runes.length;
		const v = node.value;
		if (node.op === "=") {
			return s === v;
		} else if (node.op === ">") {
			return s > v;
		} else if (node.op === "<") {
			return s < v;
		} else if (node.op === ">=") {
			return s >= v;
		} else if (node.op === "<=") {
			return s <= v;
		} else {
			throw new Error(`Unexpected operator: ${node.op}`);
		}
	} else if (node.type === "BASE_EXPR") {
		return matchBase(runeword, node.value);
	} else {
		throw new Error(`Unexpected node type: ${(node as ASTNode).type}`);
	}
}
