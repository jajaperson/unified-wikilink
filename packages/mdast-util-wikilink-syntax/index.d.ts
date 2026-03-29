import { Literal, Parent, PhrasingContent } from "mdast";
export { wikilinkFromMarkdown } from "./lib/index.js";

export interface Wikilink {
	type: "wikilink";
	destination: string;
}

export interface AliasWikilink extends Parent {
	type: "aliasWikilink";
	destination: string;
	children: PhrasingContent[];
}

declare module "mdast" {
	interface RootContentMap {
		wikilink: Wikilink;
		aliasWikilink: AliasWikilink;
	}
}

declare module "mdast-util-from-markdown" {
	interface CompileData {
		wikilinkDestination?: string;
	}
}
