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

	/** @type {Construct} */
	const construct = {
		name: "wikilinkTokenize",
		tokenize: wikilinkTokenize,
	};

	return {
		text: {
			[codes.leftSquareBracket]: construct,
		},
	};

	/**
	 * @this {TokenizeContext}
	 * @type {Tokenizer}
	 */
	function wikilinkTokenize(effects, ok, nok) {
		const self = this;

		let depth = 0;
		let destinationEmpty = true;
		let aliasEmpty = true;

		return start;

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
		function start(code) {
			assert(code === codes.leftSquareBracket, "expected `[`");

			effects.enter("wikilink");

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

			if (code === codes.rightSquareBracket) {
				if (destinationEmpty) return nok(code);
				effects.exit("chunkString");
				effects.exit("wikilinkDestination");
				effects.enter("wikilinkMarker");
				effects.consume(code);
				return close;
			}

			if (code === opts.aliasDivider) {
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
			return destination;
		}

		/**
		 * Writing alias
		 *
		 * ```markdown
		 * > | a ^[[b|c]]
		 *            ^
		 * ```
		 *
		 * @type {State}
		 */
		function alias(code) {
			if (code === null) return nok(code);

			if (code === codes.leftSquareBracket) {
				depth++;
			}

			if (code === codes.rightSquareBracket) {
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
			return alias;
		}

		/**
		 * Closing the wikilink, at the second `]`.
		 *
		 * ```markdown
		 * > | a ^[[b|c]]
		 *              ^
		 * ```
		 *
		 * @type {State}
		 */
		function close(code) {
			if (code !== codes.rightSquareBracket) return nok(code);

			effects.consume(code);
			effects.exit("wikilinkMarker");

			effects.exit("wikilink");
			return ok;
		}
	}
}
