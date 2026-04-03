/**
 * @import {Extension, TokenizeContext, Tokenizer, State, Construct, Code} from "micromark-util-types"
 */

import { ok as assert } from "devlop";
import { codes } from "micromark-util-symbol";

/**
 * @typedef {Object} WikilinkOptions
 * @property {Code} aliasDivider
 */

/** @type {WikilinkOptions} */
const defaultOptions = {
	aliasDivider: codes.verticalBar,
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
				assert(code === codes.exclamationMark, "expected `!`");

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
					assert(code === codes.leftSquareBracket, "expected `[`");
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
					effects.exit("chunkString");
					effects.exit("wikilinkDestination");

					effects.enter("wikilinkAliasMarker");
					effects.consume(code);
					effects.exit("wikilinkAliasMarker");

					effects.enter("wikilinkAlias");
					effects.enter("chunkText", { contentType: "text" });
					return alias;
				}

				effects.consume(code);
				destinationEmpty = false;
				escape = code === codes.backslash && !escape;
				return destination;
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

						effects.exit("chunkText");
						effects.exit("wikilinkAlias");
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
