# micromark-extension-wikilink-syntax

Syntax-only [micromark][] extension for parsing [Obsidian][]-style wikilinks and embeds
whose aliases/alt text can contain markdown.

Note this extension does not extend the html compiler.
Instead, this is intended to be used together with [mdast-util-wikilink-syntax][] to output syntax trees,
which can then be replaced with the appropriate construct using [unist-util-visit][]

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install micromark-extension-wikilink-syntax
```

In Deno with [`esm.sh`][esmsh]:

```js
import { wikilink } from "https://esm.sh/micromark-extension-wikilink-syntax@1";
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
	import { wikilink } from "https://esm.sh/micromark-extension-gfm-strikethrough@1?bundle";
</script>
```

## API

This package exports the identifier [`wikilink`][api-wikilink-syntax].
There is no default export.

The export map supports the [`development` condition][development].
Run `node --conditions development module.js` to get instrumented dev code.
Without this condition, production code is loaded.

### `wikilink(options?)`

Create an extension for `micromark` to parse wikilink syntax.

###### `options.aliasDivider`

The divider between the destination and the alias.
Default is `124`, the codepoint for `|`.

```md
[[destination|alias]]
```

###### `options.gfmCompat`

Set to `true` to make aliased wikilinks usable within GFM tables.
See [this example][example].

###### Returns

Extension for `micromark` that can be passed in `extensions`,
to enable wikilinks ([`Extension`][micromark-extension]).

## Security

This package is safe.

[micromark]: https://github.com/micromark/micromark
[mdast-util-wikilink-syntax]: https://github.com/jajaperson/unified-wikilink/tree/main/packages/mdast-util-wikilink-syntax
[esmsh]: https://esm.sh
[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[micromark-extension]: https://github.com/micromark/micromark#syntaxextension
[development]: https://nodejs.org/api/packages.html#packages_resolving_user_conditions
[api-wikilink-syntax]: #wikilinkoptions
[npm]: https://docs.npmjs.com/cli/install
[Obsidian]: https://obsidian.md
[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
[example]: https://github.com/jajaperson/unified-wikilink/tree/main/fixture/gfm.md
