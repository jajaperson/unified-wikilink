/**
 * @import {Extension, TokenizeContext, Tokenizer, State, Event, Code} from "micromark-util-types"
 */

import { ok as assert, equal as assertEqual } from "devlop";
import { codes } from "micromark-util-symbol";

/**
 * @typedef {Object} WikilinkOptions
 * @property {Code} aliasDivider
 *  the divider between the destination and alias
 * @property {boolean} gfmCompat
 *   if true, escapes of the alias divider are ignored. This is necessary to
 *   make wikilinks with `|` work in tables.
 */

/** @type {WikilinkOptions} */
const defaultOptions = {
	aliasDivider: codes.verticalBar,
	gfmCompat: false,
};

/**
 * Creates an extension for `micromark` to enable wikilink syntax, where
 * aliases can contain any phrasing.
 *
 * @param {Partial<WikilinkOptions>} options
 *
 * @returns {Extension}
 *   Extension for the `micromark` package that can be passed in `extensions` to enable
 *   wikilink syntax.
 */
export function wikilink(options = {}) {
	const opts = { ...defaultOptions, ...options };

	return {
		text: {
			[codes.leftSquareBracket]: {
				name: "wikilinkTokenize",
				tokenize: getTokenizer(false),
			},
			[codes.exclamationMark]: {
				name: "wikilinkEmbedTokenize",
				tokenize: getTokenizer(true),
			},
		},
	};

	/**
	 * Make a tokenizer either for plain wikilinks or wikilink embeds,
	 *
	 * @param {boolean} embed
	 * @returns Tokenizer
	 */
	function getTokenizer(embed) {
		/**
		 * @this {TokenizeContext}
		 * @type {Tokenizer}
		 */
		return function (effects, ok, nok) {
			const self = this;

			let depth = 0;
			let destinationEmpty = true;
			let aliasEmpty = true;
			let escape = false;

			return embed ? startEmbed : startWikilink;

			/**
			 * Start of wikilink embed
			 *
			 * ```markdown
			 * > | a ![[b|c]] d
			 *       ^
			 * ```
			 *
			 * @type {State}
			 */
			function startEmbed(code) {
				assertEqual(code, codes.exclamationMark, "expected `!`");

				effects.enter("wikilinkEmbed");

				effects.enter("wikilinkEmbedMarker");
				effects.consume(code);
				effects.exit("wikilinkEmbedMarker");

				return startWikilink;
			}

			/**
			 * Start of wikilink
			 *
			 * ```markdown
			 * > | a [[b|c]] d
			 *       ^
			 * ```
			 *
			 * @type {State}
			 */
			function startWikilink(code) {
				if (embed) {
					if (code !== codes.leftSquareBracket) return nok(code);
				} else {
					assertEqual(code, codes.leftSquareBracket, "expected `[`");
					effects.enter("wikilink");
				}

				effects.enter("wikilinkMarker");
				effects.consume(code);
				return (code) => {
					if (code !== codes.leftSquareBracket) return nok(code);
					effects.consume(code);
					effects.exit("wikilinkMarker");

					effects.enter("wikilinkDestination");
					effects.enter("chunkString", { contentType: "string" });
					return destination;
				};
			}

			/**
			 * Writing destination
			 *
			 * ```markdown
			 * > | a [[b|c]] d
			 *         ^
			 * ```
			 *
			 * @type {State}
			 */
			function destination(code) {
				if (code === null) return nok(code);

				if (!escape && code === codes.rightSquareBracket) {
					if (destinationEmpty) return nok(code);
					effects.exit("chunkString");
					effects.exit("wikilinkDestination");
					effects.enter("wikilinkMarker");
					effects.consume(code);
					return close;
				}

				if (!escape && code === opts.aliasDivider) {
					if (destinationEmpty) return nok(code);
					beforeAliasMarker();
					effects.consume(code);
					afterAliasMarker();
					return alias;
				}

				escape = code === codes.backslash && !escape;
				if (escape && opts.gfmCompat) {
					return effects.attempt(
						{
							name: "escapedAliasMarker",
							tokenize(effects, ok, nok) {
								return escapeStart;

								/**
								 * @type {State}
								 */
								function escapeStart(code) {
									if (destinationEmpty) return nok(code);
									beforeAliasMarker();
									assertEqual(code, codes.backslash, "expected backslash");
									effects.consume(code);
									return escapedAliasMarker;
								}

								/**
								 * @type {State}
								 */
								function escapedAliasMarker(code) {
									if (code !== codes.verticalBar) return nok(code);
									effects.consume(code);
									effects.exit("wikilinkAliasMarker");
									return ok;
								}
							},
						},
						(code) => {
							if (embed) {
								effects.enter("wikilinkEmbedAlt");
								effects.enter("chunkString", { contentType: "string" });
							} else {
								effects.enter("wikilinkAlias");
								effects.enter("chunkText", { contentType: "text" });
							}
							return alias(code);
						},
						consumeAndRepeat,
					)(code);
				} else return consumeAndRepeat(code);

				/** @type State */
				function consumeAndRepeat(code) {
					destinationEmpty = false;
					effects.consume(code);
					return destination;
				}
			}

			function beforeAliasMarker() {
				effects.exit("chunkString");
				effects.exit("wikilinkDestination");
				effects.enter("wikilinkAliasMarker");
			}

			function afterAliasMarker() {
				effects.exit("wikilinkAliasMarker");

				if (embed) {
					effects.enter("wikilinkEmbedAlt");
					effects.enter("chunkString", { contentType: "string" });
				} else {
					effects.enter("wikilinkAlias");
					effects.enter("chunkText", { contentType: "text" });
				}
			}

			/**
			 * Writing alias
			 *
			 * ```markdown
			 * > | a [[b|c]]
			 *           ^
			 * ```
			 *
			 * @type {State}
			 */
			function alias(code) {
				if (code === null) return nok(code);

				if (!escape && code === codes.leftSquareBracket) {
					depth++;
				}

				if (!escape && code === codes.rightSquareBracket) {
					if (depth === 0) {
						if (aliasEmpty) return nok(code);

						if (embed) {
							effects.exit("chunkString");
							effects.exit("wikilinkEmbedAlt");
						} else {
							effects.exit("chunkText");
							effects.exit("wikilinkAlias");
						}

						effects.enter("wikilinkMarker");
						effects.consume(code);
						return close;
					}
					depth--;
				}

				effects.consume(code);
				aliasEmpty = false;
				escape = code === codes.backslash && !escape;
				return alias;
			}

			/**
			 * Closing the wikilink, at the second `]`.
			 *
			 * ```markdown
			 * > | a [[b|c]]
			 *             ^
			 * ```
			 *
			 * @type {State}
			 */
			function close(code) {
				if (code !== codes.rightSquareBracket) return nok(code);

				effects.consume(code);
				effects.exit("wikilinkMarker");

				embed ? effects.exit("wikilinkEmbed") : effects.exit("wikilink");
				return ok;
			}
		};
	}
}
