import fs from "node:fs/promises";
import { fixtures, inputDir, outputDir } from "./fixtures.js";

await Promise.all(
	fixtures.map(async (fixture) => {
		console.log(`Writing fixture for "${fixture.description}"`);
		const input = await fs.readFile(new URL(fixture.input, inputDir));
		const output = fixture.process(input);
		await fs.writeFile(new URL(fixture.output, outputDir), String(output));
	}),
);
