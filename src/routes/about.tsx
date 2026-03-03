import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function AboutPage() {
	return (
		<div className="app">
			<div className="page-header">
				<Link to="/" className="back-link">
					← Back to search
				</Link>
				<h1 className="page-title">About Runescry</h1>
			</div>
			<div className="about-content">
				<p>
					Runescry was developed by{" "}
					<a href="https://colinkierans.com">Colin "Vindexus" Kierans</a>.
				</p>
				<p>
					It was heavily inspired by{" "}
					<a href="https://scryfall.com">Scryfall</a>, a Magic: the Gathering
					card search site.
				</p>
				<p>
					The source code is available on{" "}
					<a href="https://github.com/Vindexus/Runescry/">GitHub</a> and is
					licensed under the MIT License.
				</p>
			</div>
		</div>
	);
}
