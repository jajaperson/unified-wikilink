/** @import {Extension as FromMarkdownExtension, CompileContext, Handle as FromMarkdownHandle} from "mdast-util-from-markdown" */
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
			wikilink: enterWikilink(false),
			wikilinkEmbed: enterWikilink(true),
			wikilinkDestination: enterWikilinkDestination,
		},
		exit: {
			wikilinkDestination: exitWikilinkDestination,
			wikilink: exitWikilink(false),
			wikilinkEmbed: exitWikilink(true),
		},
	};
}

/**
 * @param {boolean} embed
 * @returns Handle for entering a wikilink or wikilink embed
 */
function enterWikilink(embed) {
	/**
	 * @this {CompileContext}
	 * @type {FromMarkdownHandle}
	 */
	return function (token) {
		this.enter(
			{ type: embed ? "aliasWikilinkEmbed" : "aliasWikilink", destination: "", children: [] },
			token,
		);
	};
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
	assert(node.type === "aliasWikilinkEmbed" || node.type === "aliasWikilink");
	node.destination = dest;
}

/**
 * @param {boolean} embed
 * @returns Handle for exiting a wikilink or wikilink embed
 */
function exitWikilink(embed) {
	/**
	 * @this {CompileContext}
	 * @type {FromMarkdownHandle}
	 */
	return function (token) {
		const node = this.stack[this.stack.length - 1];
		assert(node.type === (embed ? "aliasWikilinkEmbed" : "aliasWikilink"));
		if (node.children.length === 0) {
			Object.assign(node, { type: embed ? "wikilinkEmbed" : "wikilink", children: undefined });
		}
		this.exit(token);
	};
}
