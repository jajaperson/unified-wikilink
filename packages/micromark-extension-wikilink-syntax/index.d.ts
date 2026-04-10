export { wikilink } from "./lib/index.js";

/**
 * Augment.
 */
declare module "micromark-util-types" {
	/**
	 * Token types.
	 */
	interface TokenTypeMap {
		wikilink: "wikilink";
		wikilinkEmbed: "wikilinkEmbed";
		wikilinkEmbedMarker: "wikilinkEmbedMarker";
		wikilinkMarker: "wikilinkMarker";
		wikilinkAliasMarker: "wikilinkAliasMarker";
		wikilinkDestination: "wikilinkDestination";
		wikilinkAlias: "wikilinkAlias";
		wikilinkEmbedAlt: "wikilinkEmbedAlt";
	}
}
