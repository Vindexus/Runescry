import type {
	Stats,
	Runeword,
	RunewordDef,
	StatRange,
	Tag,
	Stat,
} from "../types";
import { RUNE_VALUES } from "./runes";
import { runewordDefs } from "./runeword_defs";

function parseStatRange(
	attributes: string[],
	statName: string,
): StatRange | null {
	const pattern = new RegExp(
		`\\+?(\\d+|\\((\\d+)-(\\d+)\\))%? ${statName}\\b`,
		"i",
	);
	for (const attr of attributes) {
		if (attr.includes("(Based on Character Level)")) {
			if (new RegExp(statName, "i").test(attr)) {
				const clvlMatch = attr.match(/\(([\d.]+)\*Clvl\)/i);
				if (clvlMatch) {
					const multiplier = parseFloat(clvlMatch[1]);
					return [Math.floor(multiplier * 1), Math.floor(multiplier * 99)];
				}
			}
			continue;
		}
		const match = attr.match(pattern);
		if (match) {
			if (match[2] && match[3]) {
				return [parseInt(match[2], 10), parseInt(match[3], 10)];
			}
			const val = parseInt(match[1], 10);
			return [val, val];
		}
	}
	return null;
}

export function rwDefToRuneword(d: RunewordDef): Runeword {
	const tags: Tag[] = [];

	if (d.attributes.some((x) => x.match(/Aura When Equipped/))) {
		tags.push("aura");
	}

	if (d.attributes.some((x) => x.match(/Ignore Target's Defense/))) {
		tags.push("itd");
	}
	if (d.attributes.some((x) => x.match(/Cannot Be Frozen/))) {
		tags.push("cb");
	}

	const id =
		d.name
			.toLowerCase()
			.split(/[^\w]+/)
			.join("_") + d.bases.join("_");

	const sockets = d.runes.length;

	const stats: Stats = {
		str: parseStatRange(d.attributes, "to Strength"),
		dex: parseStatRange(d.attributes, "to Dexterity"),
		vit: parseStatRange(d.attributes, "to Vitality"),
		ene: parseStatRange(d.attributes, "to Energy"),
		ed: parseStatRange(d.attributes, "Enhanced Damage"),
		ias: parseStatRange(d.attributes, "increased attack speed"),
		fcr: parseStatRange(d.attributes, "faster cast rate"),
		gf: parseStatRange(d.attributes, "Extra Gold From Monsters"),
		mf: parseStatRange(d.attributes, "better chance of getting magic items"),
		fhr: parseStatRange(d.attributes, "Faster Hit Recovery"),
		frw: parseStatRange(d.attributes, "faster run/walk"),
		ll: parseStatRange(d.attributes, "Life Stolen per Hit"),
		ml: parseStatRange(d.attributes, "Mana Stolen per Hit"),
		ds: parseStatRange(d.attributes, "Deadly Strike"),
		cb: parseStatRange(d.attributes, "Chance of Crushing Blow"),
		ow: parseStatRange(d.attributes, "Chance of Open Wounds"),
		life: parseStatRange(d.attributes, "to Life"),
		mana: parseStatRange(d.attributes, "to mana"),
		level: [d.level, d.level],
		sockets: [sockets, sockets],
	};

	const allAttributes = parseStatRange(d.attributes, "to all attributes");
	if (allAttributes) {
		const atts: Stat[] = ["str", "dex", "ene", "vit"];
		for (const stat of atts) {
			stats[stat] = stats[stat] ?? allAttributes;
		}
	}

	for (const ent of Object.entries(stats)) {
		const stat = ent[0] as Stat;
		const value = ent[1] as undefined | StatRange;
		if (value && !["level", "sockets"].includes(stat)) {
			tags.push(stat as Tag);
		}
	}

	const rw: Runeword = {
		...d,
		rotw: !!d.rotw,
		ladderOnly: !!d.ladderOnly,
		id,
		value: d.runes.reduce((acc, r) => {
			return acc + RUNE_VALUES[r];
		}, 0),
		tags,
		sockets,
		stats,
	};
	return rw;
}

export const RUNEWORDS: Runeword[] = runewordDefs.map(rwDefToRuneword);
