/** @import {Fixture} from "./fixtures.js" */
import fs from "node:fs/promises";
import { fixtures, inputDir, outputDir } from "./fixtures.js";

const results = await Promise.allSettled(fixtures.filter((fxt) => fxt.write).map(writeFixture));

for (const [i, res] of results.entries()) {
	if (res.status === "rejected") {
		console.log();
		console.log(`FAILED: ${fixtures[i].description}`);
		console.error(res.reason);
	}
}

/**
 *
 * @param {Fixture} fixture
 */
async function writeFixture(fixture) {
	console.log(`Writing fixture for "${fixture.description}"`);
	const input = await fs.readFile(new URL(fixture.input, inputDir));
	const output = fixture.process(input);
	await fs.writeFile(new URL(fixture.output, outputDir), String(output));
}
