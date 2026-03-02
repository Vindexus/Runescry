import type { Runeword } from "../types";

export const RunewordLI = ({ rw }: { rw: Runeword }) => {
	const badges: [string, string, string?][] = [];
	if (rw.ladderOnly) {
		badges.push(["Ladder Only", "ladder"]);
	}
	if (rw.rotw) {
		badges.push(["RotW", "rotw", "Reign of the Warlock"]);
	}
	return (
		<li className="card">
			<div className="card-body">
				<div className="card-meta">
					<div className="card-header">
						<span className="rw-name">{rw.name}</span>
					</div>
					<div className="rw-runes">{rw.runes.join(" + ")}</div>
					{badges.length > 0 && (
						<div className="badges">
							{badges.map((b) => {
								return (
									<abbr className={`badge badge-${b[1]}`} key={b[0]}>
										{b[0]}
									</abbr>
								);
							})}
						</div>
					)}
					<div>{rw.runes.length} sockets</div>
					<div className="rw-bases">{rw.bases.join(", ")}</div>
					<div>Req level {rw.level}</div>
					<div>Rune score {rw.value.toLocaleString()}</div>
					<div style={{ display: "none" }}>
						<pre>{JSON.stringify(rw.tags, null, 2)}</pre>
						<pre>{JSON.stringify(rw.stats, null, 2)}</pre>
					</div>
				</div>
				<div className="rw-desc">
					{rw.attributes.map((a) => (
						<p key={`${rw.name}_${a}`}>{a}</p>
					))}
				</div>
			</div>
		</li>
	);
};
