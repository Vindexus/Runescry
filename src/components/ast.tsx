import type { ASTNode, ASTOSNode } from "../search/parser";
import type { BaseCategory } from "../types";

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

		if (ast.child.type === "OS_EXPR") {
			return `does not need ${openSocketString(ast.child)}`;
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
			return "gives Faster Cast Rate";
		}
		if (ast.value === "ias") {
			return "gives Increased Attack Speed";
		}
		if (ast.value === "ed") {
			return "gives Enhanced Damage";
		}
		if (ast.value === "aura") {
			return "grants an aura";
		}
		if (ast.value === "mf") {
			return "has Magic Find";
		}
	}

	if (ast.type === "RUNE") {
		return `it uses ${ast.value}`;
	}

	if (ast.type === "BASE_EXPR") {
		return `can ${baseString(ast.value)}`;
	}

	if (ast.type === "OS_EXPR") {
		return `needs ${openSocketString(ast)}`;
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

	return JSON.stringify(ast);
};

function baseArticled(base: BaseCategory) {
	return `a ${base}`;
}

function baseString(base: BaseCategory) {
	return `be made in ${baseArticled(base)}`;
}

function openSocketString(ast: ASTOSNode) {
	let qual: string;
	switch (ast.op) {
		case "=":
			qual = "exactly";
			break;
		case ">":
			qual = "more than";
			break;
		case "<":
			qual = "less than";
			break;
		case ">=":
			qual = "at least";
			break;
		case "<=":
			qual = "at most";
			break;
	}

	return `${qual} ${ast.value} open socket${ast.value === 1 ? "" : "s"}`;
}
