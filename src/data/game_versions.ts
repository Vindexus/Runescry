import type { GameVersion } from "../types";

export const GAME_VERSIONS: GameVersion[] = [
	"og",
	"1.10",
	"1.11",
	"2.4",
	"2.6",
	"rotw",
];

export const GAME_VERSION_LABELS: Partial<Record<GameVersion, string>> = {
	og: "Original",
	rotw: "Reign of the Warlock",
};

export function getGameVersionLabel(gv: GameVersion): string {
	return GAME_VERSION_LABELS[gv] ?? gv;
}
