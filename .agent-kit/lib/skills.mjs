/** skills.mjs — build and install the skills from `.agent-kit/skills/` */
import path from "node:path";
import { listSkills } from "./invoke/config.mjs";
import { abs, readIf, write } from "./io.mjs";

const GENERATED = "<!-- Generated from .agent-kit/skills/";
const MARKER = "Generated from .agent-kit/skills/";

function renderSkill(skill, promptText) {
	return [
		"---",
		`name: ${skill.id}`,
		`description: ${skill.description}`,
		"license: MIT",
		"metadata:",
		'  source: "AbdulWadudh/agent-kit"',
		"---",
		"",
		`${GENERATED}${skill.id}.md. Do not edit; edit the source skill and run \`agent-kit skills build\`. -->`,
		"",
		"Run this only in a repository with `.agent-kit/`. If it is absent, say the repository is not set up with agent-kit and stop.",
		"",
		promptText.replace(/\r\n/g, "\n").trimEnd(),
		"",
	].join("\n");
}

function skillsFor(base) {
	return listSkills(base).map((skill) => {
		const promptText = readIf(abs(base, `.agent-kit/skills/${skill.id}.md`));
		if (promptText === null) {
			throw new Error(`missing .agent-kit/skills/${skill.id}.md`);
		}
		return {
			skill,
			rel: `${skill.id}/SKILL.md`,
			text: renderSkill(skill, promptText),
		};
	});
}

// These skills only run inside a repo with `.agent-kit/`, so they are installed there only.
function installRoot(base) {
	return abs(base, ".agents/skills");
}

function compareSkills(skills, outRoot) {
	const rows = skills.map(({ rel, text }) => {
		const existing = readIf(abs(outRoot, rel));
		if (existing === null) return ["MISSING", rel];
		return [
			existing.replace(/\r\n/g, "\n") === text ? "CURRENT" : "STALE",
			rel,
		];
	});
	for (const [status, rel] of rows) console.log(`  ${status.padEnd(8)} ${rel}`);
	const stale = rows.filter(([status]) => status !== "CURRENT");
	console.log(
		stale.length
			? `\n${stale.length} skill file(s) need a rebuild: agent-kit skills build`
			: `\n${rows.length} skill(s) current.`,
	);
	return stale.length ? 1 : 0;
}

function installSkills(skills, dir, verify) {
	const rows = [];
	for (const { rel, text } of skills) {
		const file = abs(dir, rel);
		const existing = readIf(file);
		if (existing === null) {
			if (!verify) write(file, text);
			rows.push([verify ? "MISSING" : "WROTE", rel]);
			continue;
		}
		if (existing.replace(/\r\n/g, "\n") === text) {
			rows.push(["CURRENT", rel]);
			continue;
		}
		if (existing.includes(MARKER)) {
			if (!verify) write(file, text);
			rows.push([verify ? "STALE" : "UPDATED", rel]);
			continue;
		}
		rows.push(["KEPT", `${rel} (authored)`]);
	}
	for (const [status, rel] of rows) console.log(`  ${status.padEnd(8)} ${rel}`);
	const bad = rows.filter(([status]) => ["MISSING", "STALE"].includes(status));
	if (verify) {
		console.log(
			bad.length
				? `\n${bad.length} installed skill(s) need a rebuild: agent-kit skills install`
				: "\nInstalled skills are current.",
		);
		return bad.length ? 1 : 0;
	}
	const changed = rows.filter(([status]) =>
		["WROTE", "UPDATED"].includes(status),
	).length;
	console.log(
		changed
			? `\nInstalled ${changed} skill file(s).`
			: "\nInstalled skills already current.",
	);
	return 0;
}

export function cmdSkills({ root, action = "build", out, verify = false } = {}) {
	const base = path.resolve(root || process.cwd());
	const outRoot = path.resolve(out || abs(base, "skills"));
	let skills;
	try {
		skills = skillsFor(base);
	} catch (error) {
		console.error(`agent-kit: ${error.message}`);
		return 1;
	}

	if (action === "build") {
		for (const { rel, text } of skills) write(abs(outRoot, rel), text);
		console.log(`Built ${skills.length} skill(s) in ${outRoot}`);
		return 0;
	}
	if (action === "check") return compareSkills(skills, outRoot);
	if (action === "install") {
		return installSkills(skills, installRoot(base), verify);
	}
	console.error(`agent-kit: unknown skills action "${action}" (use build, check or install).`);
	return 1;
}
