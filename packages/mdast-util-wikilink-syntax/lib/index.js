/** @import {Extension as FromMarkdownExtension, CompileContext, Handle as FromMarkdownHandle} from "mdast-util-from-markdown" */
/** @import {AltWikilinkEmbed, AliasWikilink, WikilinkEmbed, Wikilink} from "../index.js" */
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
			wikilinkEmbedAlt: enterWikilinkEmbedAlt,
		},
		exit: {
			wikilinkDestination: exitWikilinkDestination,
			wikilinkEmbedAlt: exitWikilinkEmbedAlt,
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
		/** @type {AltWikilinkEmbed | AliasWikilink} */
		const emptyNode = embed
			? {
					type: "altWikilinkEmbed",
					destination: "",
					alt: "",
				}
			: {
					type: "aliasWikilink",
					destination: "",
					children: [],
				};

		this.enter(emptyNode, token);
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
	assert(
		node.type === "altWikilinkEmbed" || node.type === "aliasWikilink",
		`expected altWikilinkEmbed or aliasWikilink on top of stack, instead got ${node.type}`,
	);
	node.destination = dest;
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterWikilinkEmbedAlt(token) {
	this.buffer();
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exitWikilinkEmbedAlt(token) {
	const alt = this.resume();
	const node = this.stack[this.stack.length - 1];
	assert(
		node.type === "altWikilinkEmbed",
		`expected altWikilinkEmbed on top of stack, instead got ${node.type}`,
	);
	node.alt = alt;
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
		/** @cast {WikilinkEmbed} */
		const node = this.stack[this.stack.length - 1];
		if (embed) {
			assert(
				node.type === "altWikilinkEmbed",
				`expected altWikilinkEmbed on top of stack, instead got ${node.type}`,
			);
			if (node.alt === "") {
				/** @type {any} */ (node).type = "wikilinkEmbed";
				delete (/** @type {any} */ (node).alt);
			}
		} else {
			assert(
				node.type === "aliasWikilink",
				`expected aliasWikilink on top of stack, instead got ${node.type}`,
			);
			if (node.children.length === 0) {
				/** @type {any} */ (node).type = "wikilink";
				delete (/** @type {any} */ (node).children);
			}
		}

		this.exit(token);
	};
}
