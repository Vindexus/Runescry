import type { Runeword, Tag } from "../types";

export const TAGS: Tag[] = ["fcr", "ias", "aura", "ed", "mf"];

export function stringToTag(str: string): Tag | null {
	const check = str.trim().toLowerCase() as Tag;
	if (!TAGS.includes(check)) {
		return null;
	}
	return check;
}

export function matchTag(runeword: Runeword, tag: Tag) {
	return runeword.tags.includes(tag);
}
