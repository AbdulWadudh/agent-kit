/** invoke/config.mjs — job ids and the per-repo invoke.json */
import fs from "node:fs";
import path from "node:path";
import { abs, isDir, readIf, write } from "../io.mjs";

export const JOBS = [
	{
		id: "k79-commit",
		description:
			"Split staged work by concern, run the guard plan, and write the commit body.",
	},
	{
		id: "k79-release",
		description:
			"Verify the suite, cut the release note, tag the version, and publish it.",
	},
	{
		id: "k79-debug",
		description:
			"Reproduce and isolate a failure, fix one variable, and stop after two attempts.",
	},
	{
		id: "k79-spec",
		description:
			"Turn a contract change into a PLANNED task with an approved plan.",
	},
];
export const PROMPT_MARKER = ".agent-kit/skills/";
export const INVOKE_FILE = ".agent-kit/invoke.json";

export function promptPath(base, job) {
	return abs(base, `${PROMPT_MARKER}${job.id}.md`);
}

/** Every source skill, with the description from `skills/INDEX.md`. */
export function listSkills(base) {
	const dir = abs(base, ".agent-kit/skills");
	if (!isDir(dir)) return [];
	const indexText = readIf(abs(base, ".agent-kit/skills/INDEX.md")) || "";
	const descriptions = new Map();
	for (const line of indexText.split(/\r?\n/)) {
		const match = line.match(/^\|\s*`([^`]+\.md)`\s*\|\s*([^|]+)\|/);
		if (match) descriptions.set(match[1].replace(/\.md$/, ""), match[2].trim());
	}
	return fs
		.readdirSync(dir)
		.filter((name) => name.endsWith(".md") && name !== "INDEX.md")
		.sort()
		.map((name) => {
			const id = name.slice(0, -3);
			return {
				id,
				description: descriptions.get(id) || `Run the ${id} procedure.`,
			};
		});
}

export function readInvokeConfig(base) {
	const text = readIf(abs(base, INVOKE_FILE));
	if (text === null) return null;
	try {
		return JSON.parse(text);
	} catch (error) {
		throw new Error(`${INVOKE_FILE}: invalid JSON (${error.message})`);
	}
}

export function writeInvokeConfig(base, config) {
	write(abs(base, INVOKE_FILE), `${JSON.stringify(config, null, 2)}\n`);
}
