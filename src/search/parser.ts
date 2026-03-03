import { strToBase, strToRune } from "../data/runes";
import { stringToTag } from "../data/tags";
import { BASE_CATEGORY_MEMBERS } from "../data/bases";
import type { BaseCategory, BoolFilter, Rune, Stat, Tag } from "../types";
import type { Token, NumOp } from "./tokenizer";

export type ASTNumNode = {
	type: "NUM_EXPR";
	field: Stat;
	op: NumOp;
	value: number;
};

export type ASTNode =
	| { type: "AND"; children: ASTNode[] }
	| { type: "OR"; children: ASTNode[] }
	| { type: "NOT"; child: ASTNode }
	| { type: "KEYWORD"; value: string }
	| { type: "HAS"; value: Tag }
	| ASTNumNode
	| { type: "RUNE"; value: Rune }
	| { type: "BOOL"; value: BoolFilter }
	| { type: "BASE_EXPR"; value: BaseCategory };

export type InvalidExpression = {
	expression: string;
	message: string;
};

const NUM_FIELD_RANGES: Partial<Record<Stat, [number, number]>> = {
	sockets: [2, 6],
	level: [1, 99],
};

const NUM_FIELD_PREFIX: Partial<Record<Stat, string>> = {
	sockets: "os",
	level: "lvl",
};

const NUM_FIELD_LABEL: Partial<Record<Stat, string>> = {
	sockets: "Open sockets",
	level: "Required level",
};

export type ParseResult = {
	parsed: ASTNode | null;
	invalid: InvalidExpression[];
};

class Parser {
	private pos = 0;
	private tokens: Token[] = [];
	private invalid: InvalidExpression[] = [];

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	parse(): ParseResult {
		if (this.tokens.length === 0) {
			return { parsed: null, invalid: [] };
		}
		try {
			const parsed = this.parseOrExpr();
			return { parsed, invalid: this.invalid };
		} catch {
			return { parsed: null, invalid: this.invalid };
		}
	}

	// orExpr := andExpr ('or' andExpr)*
	private parseOrExpr(): ASTNode | null {
		const first = this.parseAndExpr();
		const children: ASTNode[] = first ? [first] : [];

		while (this.peek()?.type === "OR") {
			this.consume();
			const next = this.parseAndExpr();
			if (next) {
				children.push(next);
			}
		}

		if (children.length === 0) {
			return null;
		}
		return children.length === 1 ? children[0] : { type: "OR", children };
	}

	// andExpr := unary (unary)*   — implicit AND; stops at OR or RPAREN
	private parseAndExpr(): ASTNode | null {
		const children: ASTNode[] = [];

		let tok = this.peek();
		while (tok !== null && tok.type !== "OR" && tok.type !== "RPAREN") {
			const node = this.parseUnary();
			if (node !== null) {
				children.push(node);
			}
			tok = this.peek();
		}

		if (children.length === 0) {
			return null;
		}
		return children.length === 1 ? children[0] : { type: "AND", children };
	}

	// unary := '-' primary | primary
	private parseUnary(): ASTNode | null {
		if (this.peek()?.type === "MINUS") {
			this.consume();
			const primary = this.parsePrimary();
			if (primary === null) {
				return null;
			}
			return { type: "NOT", child: primary };
		}
		return this.parsePrimary();
	}

	// primary := '(' orExpr ')' | NUM_EXPR | BASE_EXPR | WORD | HAS
	private parsePrimary(): ASTNode | null {
		const tok = this.peek();
		if (tok === null) {
			return null;
		}

		if (tok.type === "LPAREN") {
			this.consume();
			const inner = this.parseOrExpr();
			if (this.peek()?.type === "RPAREN") {
				this.consume();
			} else {
				this.invalid.push({
					expression: "(",
					message: "Missing closing )",
				});
			}
			return inner;
		}

		if (tok.type === "NUM_EXPR") {
			this.consume();
			const range = NUM_FIELD_RANGES[tok.field];
			if (range && (tok.value < range[0] || tok.value > range[1])) {
				const prefix = NUM_FIELD_PREFIX[tok.field] ?? tok.field;
				const op = tok.op === "=" ? ":" : tok.op;
				this.invalid.push({
					expression: `${prefix}${op}${tok.value}`,
					message: `${NUM_FIELD_LABEL[tok.field] ?? tok.field} must be between ${range[0]} and ${range[1]}`,
				});
				return null;
			}
			return {
				type: "NUM_EXPR",
				field: tok.field,
				op: tok.op,
				value: tok.value,
			};
		}

		if (tok.type === "BASE_EXPR") {
			this.consume();
			const base = strToBase(tok.value);
			if (!(base in BASE_CATEGORY_MEMBERS)) {
				this.invalid.push({
					expression: `base:${tok.value}`,
					message: `"${tok.value}" is not a valid base`,
				});
				return null;
			}
			return { type: "BASE_EXPR", value: base };
		}

		if (tok.type === "WORD") {
			this.consume();
			const rune = strToRune(tok.value);
			if (rune) {
				return {
					type: "RUNE",
					value: rune,
				};
			}
			if (tok.value === "rotw") {
				return {
					type: "BOOL",
					value: "rotw",
				};
			}
			if (tok.value === "ladder") {
				return {
					type: "BOOL",
					value: "ladder",
				};
			}
			return { type: "KEYWORD", value: tok.value };
		}

		if (tok.type === "HAS") {
			this.consume();
			const tag = stringToTag(tok.value);
			if (!tag) {
				this.invalid.push({
					expression: `has:${tok.value}`,
					message: `Unknown tag "${tok.value}"`,
				});
				return null;
			}
			return {
				type: "HAS",
				value: tag,
			};
		}

		this.consume();
		this.invalid.push({
			expression: JSON.stringify(tok),
			message: `Unexpected token`,
		});
		return null;
	}

	private peek(): Token | null {
		return this.tokens[this.pos] ?? null;
	}

	private consume(): Token {
		return this.tokens[this.pos++];
	}
}

export function parse(tokens: Token[]): ParseResult {
	return new Parser(tokens).parse();
}
