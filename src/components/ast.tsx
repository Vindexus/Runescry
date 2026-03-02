import type { ASTNode, ASTNumNode } from "../search/parser";
import type { BaseCategory, Stat } from "../types";

type Props = {
	ast: ASTNode | null;
	level?: number;
};

export const ASTText = (props: Props): string => {
	const { ast, level = 1 } = props;
	if (!ast) {
		return "";
	}

	if (ast.type === "AND" || ast.type === "OR") {
		const sep = ` ${ast.type.toLowerCase()} `;
		const parts = ast.children.map((c) =>
			ASTText({ ast: c, level: level + 1 }),
		);
		const joined = parts.join(sep);
		return `${level > 1 ? "(" : ""}${joined}${level > 1 ? ")" : ""}`;
	}

	if (ast.type === "NOT") {
		if (ast.child.type === "RUNE") {
			return `it does not use ${ast.child.value}`;
		}

		if (ast.child.type === "BASE_EXPR") {
			return `cannot ${baseString(ast.child.value)}`;
		}

		if (ast.child.type === "NUM_EXPR") {
			return numExprString(ast.child, true);
		}

		if (ast.child.type === "KEYWORD") {
			return `does not match "${ast.child.value}"`;
		}

		if (ast.child.type === "HAS") {
			if (ast.child.value === "fcr") {
				return "does not give Faster Cast Rate";
			}
			if (ast.child.value === "ias") {
				return "does not give Increased Attack Speed";
			}
			if (ast.child.value === "ed") {
				return "does not give Enhanced Damage";
			}
			if (ast.child.value === "aura") {
				return "does not grant an aura";
			}
			if (ast.child.value === "mf") {
				return "does not have Magic Find";
			}
		}

		if (ast.child.type === "BOOL") {
			if (ast.child.value === "ladder") {
				return `is not ladder-only`;
			}
			if (ast.child.value === "rotw") {
				return `is not from Reign of the Warlock`;
			}
		}
	}

	if (ast.type === "HAS") {
		if (ast.value === "fcr") {
			return "has Faster Cast Rate";
		}
		if (ast.value === "ias") {
			return "has Increased Attack Speed";
		}
		if (ast.value === "ed") {
			return "has Enhanced Damage";
		}
		if (ast.value === "aura") {
			return "grants an aura";
		}
		if (ast.value === "mf") {
			return "has Magic Find";
		}
		if (ast.value === "gf") {
			return "has Gold Find";
		}
	}

	if (ast.type === "RUNE") {
		return `it uses ${ast.value}`;
	}

	if (ast.type === "BASE_EXPR") {
		return `can ${baseString(ast.value)}`;
	}

	if (ast.type === "NUM_EXPR") {
		return numExprString(ast);
	}

	if (ast.type === "KEYWORD") {
		return `matches "${ast.value}"`;
	}

	if (ast.type === "BOOL") {
		if (ast.value === "ladder") {
			return `is ladder-only`;
		}
		if (ast.value === "rotw") {
			return `is from Reign of the Warlock`;
		}
	}

	const { type, value = "", ...rest } = ast as any;
	return `${type.toLowerCase()} ${value} ${rest && Object.keys(rest).length > 0 ? JSON.stringify(rest) : ""}`;
};

const BASE_DISPLAY: Partial<Record<BaseCategory, string>> = {
	armor: "body armor",
};

function baseArticled(base: BaseCategory) {
	const display = BASE_DISPLAY[base] ?? base;
	const article = /^[aeiou]/i.test(display) ? "an" : "a";
	return `${article} ${display}`;
}

function baseString(base: BaseCategory) {
	return `be made in ${baseArticled(base)}`;
}

function numExprString(ast: ASTNumNode, negated = false) {
	let qual: string;
	if (ast.op === "=") {
		qual = "exactly";
	} else if (ast.op === ">") {
		qual = "more than";
	} else if (ast.op === "<") {
		qual = "less than";
	} else if (ast.op === ">=") {
		qual = "at least";
	} else {
		qual = "at most";
	}

	if (ast.field === "sockets") {
		const verb = negated ? "does not need" : "needs";
		return `${verb} ${qual} ${ast.value} open socket${ast.value === 1 ? "" : "s"}`;
	}

	if (ast.field === "level") {
		const verb = negated ? "does not require" : "requires";
		return `${verb} ${qual} level ${ast.value}`;
	}

	const statLabel: Partial<Record<Stat, string>> = {
		str: "Strength",
		dex: "Dexterity",
		vit: "Vitality",
		ene: "Energy",
		ow: "chance of Open Wounds",
		allres: "All Resistances",
		cres: "Cold Resist",
		fres: "Fire Resist",
		lres: "Lightning Resist",
		pres: "Poison Resist",
		res: "Total Resist",
	};
	const verb = negated ? "does not give" : "gives";
	return `${verb} ${qual} ${ast.value} ${statLabel[ast.field] ?? ast.field}`;
}
