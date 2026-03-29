# mdast-util-wikilink-syntax

[mdast][] extensions to **parse** [Obsidian][]-style wikilinks
whose aliases can contain markdown.
Intended to be used with [micromark-extension-wikilink-syntax][].

Since [micromark-extension-wikilink-syntax][] is syntax-only,
you will need to use something like [unist-util-visit][],
to manually replace the outputted nodes in the syntax tree with ordinary markdown constructs.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install micromark-extension-wikilink-syntax mdast-util-wikilink-syntax
```

In Deno with [`esm.sh`][esmsh]:

```js
import { wikilinkFromMarkdown } from "https://esm.sh/mdast-util-wikilink-syntax@1";
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
	import { wikilinkFromMarkdown } from "https://esm.sh/mdast-util-wikilink-syntax12?bundle";
</script>
```

## API

This package exports the identifier [`wikilinkFromMarkdown`][api-frommarkdown].
There is no default export.

### `wikilinkFromMarkdown()`

Create an extension for
[`mdast-util-from-markdown`][mdast-util-from-markdown]
to parse wikilink syntax in markdown.

###### Returns

Extension for `mdast-util-from-markdown`
([`FromMarkdownExtension`][frommarkdownextension]).

[Obsidian]: https://obsidian.md
[mdast-util-from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown
[micromark]: https://github.com/micromark/micromark
[mdast-util-wikilink-syntax]: https://github.com/jajaperson/remark-wikilink-syntax/tree/main/packages/mdast-util-wikilink-syntax
[esmsh]: https://esm.sh
[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[micromark-extension]: https://github.com/micromark/micromark#syntaxextension
[mdast]: https://github.com/syntax-tree/mdast
[npm]: https://docs.npmjs.com/cli/install
[api-frommarkdown]: #wikilinkfrommarkdown
[frommarkdownextension]: https://github.com/syntax-tree/mdast-util-from-markdown#extension
[micromark-extension-wikilink-syntax]: https://github.com/jajaperson/remark-wikilink-syntax/tree/main/packages/micromark-extension-wikilink-syntax
[micromark-extension-wikilink-syntax]: https://github.com/jajaperson/remark-wikilink-syntax/tree/main/packages/micromark-extension-wikilink-syntax
[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
