import { fromMarkdown } from "mdast-util-from-markdown";
import { wikilink } from "micromark-extension-wikilink-syntax";
import { wikilinkFromMarkdown } from "../index.js";
import { inputs } from "../../../fixture/index.js";

export const inputDir = new URL("../../../fixture/", import.meta.url);
export const outputDir = new URL("fixture/", import.meta.url);

/**
 * @typedef {Object} Fixture
 * @property {string} description
 * @property {string} input
 * @property {string} output
 * @property {(inp: Buffer) => string} process
 */

/**
 * @type {Fixture[]}
 */
export const fixtures = Object.entries(inputs).map(([name, description]) => ({
	description,
	input: `${name}.md`,
	output: `${name}.json`,
	process(md) {
		const ast = fromMarkdown(md, {
			extensions: [wikilink()],
			mdastExtensions: [wikilinkFromMarkdown()],
		});
		return JSON.stringify(ast, null, "\t");
	},
}));
