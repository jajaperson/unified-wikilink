/** @import {Extension as FromMarkdownExtension, CompileContext, Handle as FromMarkdownHandle} from "mdast-util-from-markdown" */
import { visit } from "unist-util-visit";
import { ok as assert } from "devlop";

/**
 * Create an extension for `mdast-util-from-markdown` to enable wikilinks.
 *
 * @returns {FromMarkdownExtension}
 *   Extension for `mdast-util-from-markdown`.
 */
export function wikilinkFromMarkdown() {
	return {
		enter: {
			wikilink: enterWikilink,
			wikilinkDestination: enterWikilinkDestination,
		},
		exit: {
			wikilinkDestination: exitWikilinkDestination,
			wikilink: exitWikilink,
		},
	};
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterWikilink(token) {
	this.enter({ type: "aliasWikilink", destination: "", children: [] }, token);
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterWikilinkDestination(token) {
	this.buffer();
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exitWikilinkDestination(token) {
	const dest = this.resume();
	const node = this.stack[this.stack.length - 1];
	assert(node.type === "aliasWikilink");
	node.destination = dest;
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exitWikilink(token) {
	const node = this.stack[this.stack.length - 1];
	assert(node.type === "aliasWikilink");
	if (node.children.length === 0) {
		Object.assign(node, { type: "wikilink", children: undefined });
	}
	this.exit(token);
}
