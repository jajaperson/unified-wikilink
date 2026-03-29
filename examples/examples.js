export const examples = {
	basic: "Should handle a basic wikilink",
	alias: "Should handle a basic wikilink with an alias",
	code: "Should handle a wikilink with a code construct in the alias",
	multiple: "Should handle multiple wikilinks in one document",
	nested: "Should handle nested brackets",
	errSingleBrackets: "Should leave single brackets alone",
	errEmptyDestination: "Should not render wikilinks without a destination",
	errEmptyAlias: "Should not render aliased wikilinks with an empty alias",
	errEof: "Should not render a partial wikilink",
	errSingleClose: "Should not render a [[wikilink]",
};
