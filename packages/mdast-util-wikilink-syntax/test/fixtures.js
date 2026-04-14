import { fromMarkdown } from "mdast-util-from-markdown";
import { wikilink } from "micromark-extension-wikilink-syntax";
import { wikilinkFromMarkdown } from "../index.js";
import { inputs } from "../../../fixture/index.js";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";

export const inputDir = new URL("../../../fixture/", import.meta.url);
export const outputDir = new URL("fixture/", import.meta.url);

/**
 * @typedef {Object} Fixture
 * @property {string} description
 * @property {string} input
 * @property {string} output
 * @property {(inp: Buffer) => string} process
 * @property {boolean} write
 */

/**
 * @type {Fixture[]}
 */
const baseFixtures = Object.entries(inputs).map(([name, description]) => ({
	description,
	input: `${name}.md`,
	output: `${name}.json`,
	write: true,
	process(md) {
		const ast = fromMarkdown(md, {
			extensions: [wikilink()],
			mdastExtensions: [wikilinkFromMarkdown()],
		});
		return JSON.stringify(ast, null, "\t");
	},
}));

/**
 * @type {Fixture[]}
 */
const gfmFixtures = Object.entries(inputs).map(([name, description]) => ({
	description: description + " with gfmCompat",
	write: false,
	input: `${name}.md`,
	output: `${name}.json`,
	process(md) {
		const ast = fromMarkdown(md, {
			extensions: [wikilink({ gfmCompat: true }), gfm()],
			mdastExtensions: [wikilinkFromMarkdown(), gfmFromMarkdown()],
		});
		return JSON.stringify(ast, null, "\t");
	},
}));

/**
 * @type {Fixture[]}
 */
export const fixtures = [
	...baseFixtures,
	...gfmFixtures,
	{
		description: "Should handle wikilinks in GFM tables",
		input: "gfm.md",
		output: "gfm.json",
		write: true,
		process(md) {
			const ast = fromMarkdown(md, {
				extensions: [wikilink({ gfmCompat: true }), gfm()],
				mdastExtensions: [wikilinkFromMarkdown(), gfmFromMarkdown()],
			});
			return JSON.stringify(ast, null, "\t");
		},
	},
];
