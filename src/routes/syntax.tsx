import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/syntax")({
	head: () => ({
		meta: [{ title: "Syntax Guide — Runescry" }],
	}),
	component: SyntaxPage,
});

function SyntaxPage() {
	return (
		<div className="app">
			<div className="page-header">
				<Link to="/" className="back-link">
					← Back to search
				</Link>
				<h1 className="page-title">Syntax Guide</h1>
			</div>
			<div className="syntax-guide">
				<div className="syntax-section">
					<div className="syntax-title">Keywords</div>
					<div className="syntax-desc">
						Match name, runes, or attributes. Quotes for multi-word phrases.
					</div>
					<div className="syntax-examples">
						<code className="syntax-example">teleport</code>
						<code className="syntax-example">"enemy lightning res"</code>
					</div>
				</div>
				<div className="syntax-section">
					<div className="syntax-title">Rune Filter</div>
					<div className="syntax-desc">
						Find runewords containing a rune. Prefix{" "}
						<span className="syntax-mono">-</span> to exclude.
					</div>
					<div className="syntax-examples">
						<code className="syntax-example">ist</code>
						<code className="syntax-example">-jah</code>
					</div>
				</div>
				<div className="syntax-section">
					<div className="syntax-title">
						Base — <span className="syntax-mono">base:</span>
					</div>
					<div className="syntax-desc">
						Filter by item type. Categories expand —{" "}
						<span className="syntax-mono">base:melee</span> includes swords,
						axes, etc.
					</div>
					<div className="syntax-examples">
						<code className="syntax-example">base:sword</code>
						<code className="syntax-example">base:melee</code>
						<code className="syntax-example">base:weapon</code>
						<code className="syntax-example">base:shield</code>
						<code className="syntax-example">base:armor</code>
					</div>
				</div>
				<div className="syntax-section">
					<div className="syntax-title">
						Tags — <span className="syntax-mono">has:</span>
					</div>
					<div className="syntax-desc">Filter by special properties.</div>
					<div className="syntax-examples">
						<code className="syntax-example">has:aura</code>
						<code className="syntax-example">has:mf</code>
						<code className="syntax-example">has:itd</code>
						<code className="syntax-example">has:cbf</code>
						<code className="syntax-example">has:pmh</code>
						<code className="syntax-example">has:str</code>
					</div>
				</div>
				<div className="syntax-section">
					<div className="syntax-title">Number Expressions</div>
					<div className="syntax-desc">
						Filter stats by value. Supports{" "}
						<span className="syntax-mono">:</span>{" "}
						<span className="syntax-mono">=</span>{" "}
						<span className="syntax-mono">&gt;</span>{" "}
						<span className="syntax-mono">&gt;=</span>{" "}
						<span className="syntax-mono">&lt;</span>{" "}
						<span className="syntax-mono">&lt;=</span>
					</div>
					<div className="syntax-examples">
						<code className="syntax-example">os:4</code>
						<code className="syntax-example">lvl&lt;=65</code>
						<code className="syntax-example">fcr&gt;=25</code>
						<code className="syntax-example">ias:30</code>
						<code className="syntax-example">fhr&gt;=10</code>
						<code className="syntax-example">ll&gt;2</code>
						<code className="syntax-example">str&lt;=40</code>
						<code className="syntax-example">mf&gt;=50</code>
						<code className="syntax-example">ed&gt;=200</code>
						<code className="syntax-example">cb&gt;20</code>
					</div>
				</div>
				<div className="syntax-section">
					<div className="syntax-title">Ladder</div>
					<div className="syntax-desc">
						Filter to ladder-only runewords.
					</div>
					<div className="syntax-examples">
						<code className="syntax-example">ladder</code>
						<code className="syntax-example">-ladder</code>
					</div>
				</div>
				<div className="syntax-section">
					<div className="syntax-title">Boolean Logic</div>
					<div className="syntax-desc">
						Space = AND. Use <span className="syntax-mono">or</span> for OR,{" "}
						<span className="syntax-mono">-</span> to negate, parens to group.
					</div>
					<div className="syntax-examples">
						<code className="syntax-example">jah base:armor</code>
						<code className="syntax-example">(ber or jah) -ladder</code>
						<code className="syntax-example">base:melee -base:sword</code>
					</div>
				</div>
			</div>
		</div>
	);
}
