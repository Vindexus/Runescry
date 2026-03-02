import React from "react";
import type { ASTNode, ASTOSNode } from "../search/parser";
import type { BaseCategory } from "../types";

type Props = {
	ast: ASTNode | null;
	level?: number;
};

export const ASTText = (props: Props) => {
	const { ast, level = 1 } = props;
	if (!ast) {
		return null;
	}

	if (ast.type === "AND" || ast.type === "OR") {
		return (
			<React.Fragment>
				{level > 1 ? <React.Fragment>(</React.Fragment> : ""}
				<span className={`ast ast-${ast.type}`}>
					{ast.children.map((c, i) => {
						const nextLvl = level + 1;
						const key = `${nextLvl}_${i}`;
						const subThing = <ASTText ast={c} key={key} level={nextLvl} />;
						if (typeof subThing === "string") {
							return `${ast.type.toLowerCase()} ${subThing}`;
						}
						return (
							<React.Fragment key={key}>
								{i > 0 ? (
									<span className="logical-separator">
										{ast.type.toLowerCase()}{" "}
									</span>
								) : null}{" "}
								{subThing}
							</React.Fragment>
						);
					})}
				</span>
				{level > 1 ? <React.Fragment>)</React.Fragment> : ""}
			</React.Fragment>
		);
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

	console.log("ast", ast);
	return <span>{JSON.stringify(ast)}</span>;
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
