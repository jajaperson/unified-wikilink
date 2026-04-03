import { Literal, Parent, PhrasingContent } from "mdast";
export { wikilinkFromMarkdown } from "./lib/index.js";

export interface WikilinkBase {
	destination: string;
}

export interface Wikilink extends WikilinkBase {
	type: "wikilink";
}

export interface WikilinkEmbed extends WikilinkBase {
	type: "wikilinkEmbed";
}

export interface AliasWikilinkBase extends Parent {
	destination: string;
	children: PhrasingContent[];
}

export interface AliasWikilink extends AliasWikilinkBase {
	type: "aliasWikilink";
}

export interface AliasWikilinkEmbed extends AliasWikilinkBase {
	type: "aliasWikilinkEmbed";
}

declare module "mdast" {
	interface RootContentMap {
		wikilink: Wikilink;
		wikilinkEmbed: WikilinkEmbed;
		aliasWikilink: AliasWikilink;
		aliasWikilinkEmbed: AliasWikilinkEmbed;
	}
}

declare module "mdast-util-from-markdown" {
	interface CompileData {
		wikilinkDestination?: string;
	}
}
