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
			<div>
				Runescry was developed by{" "}
				<a href="https://colinkierans.com">Colin "Vindexus" Kierans</a>
				<br />
				The GitHub page is here{" "}
				<a href="https://github.com/Vindexus/Runescry/">
					https://github.com/Vindexus/Runescry/
				</a>
				<br />
				It is licensed under the MIT License
				<br />
				It was heavily inspired by <a href="https://scryfall.com">Scryfall</a>,
				a Magic the Gathering search site.
			</div>
		</div>
	);
}
