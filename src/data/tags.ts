import type { Runeword, Stat, Tag } from "../types";

const statRec: Record<Stat, null> = {
	fcr: null,
	ias: null,
	ed: null,
	mf: null,
	gf: null,
	str: null,
	dex: null,
	ene: null,
	vit: null,
	fhr: null,
	frw: null,
	sockets: null,
	level: null,
	ll: null,
	ml: null,
	ds: null,
	cb: null,
	ow: null,
	life: null,
	mana: null,
} as const;

const tagReg: Record<Tag, null> = {
	...statRec,
	aura: null,
	pmh: null,
	itd: null,
	cbf: null,
} as const;

export const STATS: Stat[] = Object.keys(statRec) as Stat[];

export const TAGS: Tag[] = Object.keys(tagReg) as Tag[];

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
