import { Alternative, Literal, Parent, PhrasingContent } from "mdast";
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

export interface AliasWikilink extends Parent, WikilinkBase {
	type: "aliasWikilink";
	children: PhrasingContent[];
}

export interface AltWikilinkEmbed extends WikilinkBase, Alternative {
	type: "altWikilinkEmbed";
	alt: string;
}

declare module "mdast" {
	interface RootContentMap {
		wikilink: Wikilink;
		wikilinkEmbed: WikilinkEmbed;
		aliasWikilink: AliasWikilink;
		aliasWikilinkEmbed: AltWikilinkEmbed;
	}
}

declare module "mdast-util-from-markdown" {
	interface CompileData {
		wikilinkDestination?: string;
	}
}
