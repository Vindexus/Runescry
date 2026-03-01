import type { Token, OsOp } from "./tokenizer";

export type ASTNode =
	| { type: "AND"; children: ASTNode[] }
	| { type: "OR"; children: ASTNode[] }
	| { type: "NOT"; child: ASTNode }
	| { type: "KEYWORD"; value: string }
	| { type: "OS_EXPR"; op: OsOp; value: number }
	| { type: "BASE_EXPR"; value: string };

type ParseResult = {
	valid: ASTNode | null;
	errors: ParseError[];
};

type ParseError = {
	message: string;
	token: Token | null;
};

class Parser {
	private pos = 0;

	constructor(private tokens: Token[]) {}

	parse(): ASTNode | null {
		if (this.tokens.length === 0) return null;
		const node = this.parseOrExpr();
		return node;
	}

	// orExpr := andExpr ('or' andExpr)*
	private parseOrExpr(): ASTNode {
		const children: ASTNode[] = [this.parseAndExpr()];

		while (this.peek()?.type === "OR") {
			this.consume();
			children.push(this.parseAndExpr());
		}

		return children.length === 1 ? children[0] : { type: "OR", children };
	}

	// andExpr := unary (unary)*   — implicit AND; stops at OR or RPAREN
	private parseAndExpr(): ASTNode {
		const children: ASTNode[] = [];

		let tok = this.peek();
		while (tok !== null && tok.type !== "OR" && tok.type !== "RPAREN") {
			children.push(this.parseUnary());
			tok = this.peek();
		}

		if (children.length === 0) {
			throw new Error("Expected expression");
		}
		return children.length === 1 ? children[0] : { type: "AND", children };
	}

	// unary := '-' primary | primary
	private parseUnary(): ASTNode {
		if (this.peek()?.type === "MINUS") {
			this.consume();
			return { type: "NOT", child: this.parsePrimary() };
		}
		return this.parsePrimary();
	}

	// primary := '(' orExpr ')' | OS_EXPR | BASE_EXPR | WORD
	private parsePrimary(): ASTNode {
		const tok = this.peek();
		if (tok === null) {
			throw new Error("Unexpected end of input");
		}

		if (tok.type === "LPAREN") {
			this.consume();
			const inner = this.parseOrExpr();
			if (this.peek()?.type === "RPAREN") this.consume();
			return inner;
		}

		if (tok.type === "OS_EXPR") {
			this.consume();
			return { type: "OS_EXPR", op: tok.op, value: tok.value };
		}

		if (tok.type === "BASE_EXPR") {
			this.consume();
			return { type: "BASE_EXPR", value: tok.value };
		}

		if (tok.type === "WORD") {
			this.consume();
			return { type: "KEYWORD", value: tok.value };
		}

		throw new Error(`Unexpected token: ${JSON.stringify(tok)}`);
	}

	private peek(): Token | null {
		return this.tokens[this.pos] ?? null;
	}

	private consume(): Token {
		return this.tokens[this.pos++];
	}
}

export function parse(tokens: Token[]): ASTNode | null {
	return new Parser(tokens).parse();
}
