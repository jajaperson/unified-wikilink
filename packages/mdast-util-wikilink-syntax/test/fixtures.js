import { fromMarkdown } from "mdast-util-from-markdown";
import { wikilink } from "micromark-extension-wikilink-syntax";
import { wikilinkFromMarkdown } from "../index.js";
import { examples } from "../../../examples/examples.js";

export const inputDir = new URL("../../../examples/", import.meta.url);
export const outputDir = new URL("fixture/", import.meta.url);

/**
 * @type {Array<{description: string, input: string, output: string, process: (inp: Buffer) => string}>}
 */
export const fixtures = Object.entries(examples).map(([name, description]) => ({
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
