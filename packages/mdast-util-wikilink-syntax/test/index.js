import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { fixtures, inputDir, outputDir } from "./fixtures.js";

test("mdast-util-wikilink-syntax", async function (t) {
	for (const fixture of fixtures) {
		await t.test(fixture.description, async function () {
			const input = await fs.readFile(new URL(fixture.input, inputDir));
			const expected = String(await fs.readFile(new URL(fixture.output, outputDir)));
			const actual = String(fixture.process(input));
			assert.equal(actual.trim(), expected.trim());
		});
	}
});
