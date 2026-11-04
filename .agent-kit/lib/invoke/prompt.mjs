/** invoke/prompt.mjs — `agent-kit prompt <job>` */
import path from "node:path";
import { readIf } from "../io.mjs";
import { PROMPT_MARKER, listSkills, promptPath } from "./config.mjs";

function listJobs(base) {
	const skills = listSkills(base);
	console.log("Built-in procedures — run: agent-kit prompt <job>\n");
	for (const skill of skills) {
		console.log(`  ${skill.id.padEnd(22)} ${skill.description}`);
	}
	console.log(
		"\nA harness may expose the same procedure as /<job> or @<job>; both point at one file.",
	);
}

export function cmdPrompt({ root, job, list } = {}) {
	const base = path.resolve(root || process.cwd());
	if (list || !job) {
		listJobs(base);
		return 0;
	}
	const known = listSkills(base).find((entry) => entry.id === job);
	if (!known) {
		console.error(`agent-kit: unknown procedure "${job}".`);
		listJobs(base);
		return 1;
	}
	const text = readIf(promptPath(base, known));
	if (text === null) {
		console.error(`agent-kit: missing ${PROMPT_MARKER}${known.id}.md`);
		return 1;
	}
	console.log(text.replace(/\r\n/g, "\n").trimEnd());
	return 0;
}
