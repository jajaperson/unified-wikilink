# unified wikilink

This monorepo contains two packages for handling wikilink syntax in the [unified][] ecosystem.

1. [mdast-util-wikilink-syntax][]
2. [micromark-extension-wikilink-syntax][]

Note these are both syntax only.
To actually do anything, you will need to replace wikilinks with appropriate markdown constructs
using something like [unist-util-visit][].

[mdast-util-wikilink-syntax]: https://github.com/jajaperson/remark-wikilink-syntax/tree/main/packages/mdast-util-wikilink-syntax
[micromark-extension-wikilink-syntax]: https://github.com/jajaperson/remark-wikilink-syntax/tree/main/packages/micromark-extension-wikilink-syntax
[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
[unified]: https://unifiedjs.com
