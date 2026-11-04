/** invoke/pointers.mjs — harness command/skill pointers, refresh, prune */
import fs from "node:fs";
import path from "node:path";
import { HARNESSES, detectHarnesses } from "../env.mjs";
import { abs, isDir, readIf, table, walk, write } from "../io.mjs";
import { JOBS, PROMPT_MARKER, readInvokeConfig } from "./config.mjs";

const SKILL_ROOTS = [".claude/skills", ".opencode/skills", ".agents/skills"];
const COMMAND_ROOTS = [".claude/commands", ".opencode/commands"];
// Pointers written before the prompts/ -> skills/ rename are still ours; wire rewrites them.
const LEGACY_MARKER = ".agent-kit/prompts/";

function commandPointer(job) {
	return [
		"---",
		`description: ${job.description}`,
		"---",
		`Read \`.agent-kit/skills/${job.id}.md\` and follow it exactly. Do not restate it.`,
		"$ARGUMENTS",
		"",
	].join("\n");
}

function skillPointer(job) {
	return [
		"---",
		`name: ${job.id}`,
		`description: ${job.description}`,
		"metadata:",
		"  opencode/autoinvoke: false",
		"disable-model-invocation: true",
		"---",
		`Read \`.agent-kit/SKILL.md\`, then \`.agent-kit/skills/${job.id}.md\`.`,
		"",
	].join("\n");
}

/** Every pointer the configured harnesses can discover, plus the portable `.agents` copy. */
export function collectTargets(base, config = null) {
	const jobs =
		config && Array.isArray(config.jobs) && config.jobs.length
			? JOBS.filter((job) => config.jobs.includes(job.id))
			: JOBS;
	const targets = new Map();
	const found =
		config && Array.isArray(config.harnesses) && config.harnesses.length
			? HARNESSES.filter(
					(harness) =>
						harness.id && config.harnesses.includes(harness.id),
				)
			: detectHarnesses(base, undefined, process.env.PATH || "");

	for (const harness of found) {
		if (!harness.id) continue;
		if (!isDir(abs(base, harness.repo[0]))) continue;
		if (harness.commands) {
			for (const job of jobs) {
				targets.set(`${harness.commands}/${job.id}.md`, {
					kind: "command",
					rel: `${harness.commands}/${job.id}.md`,
					text: commandPointer(job),
					harness: harness.name,
				});
			}
		}
		if (harness.skill) {
			// `.claude/skills/agent-kit/SKILL.md` -> `.claude/skills`
			const skillsRoot = path.posix.dirname(
				path.posix.dirname(harness.skill),
			);
			for (const job of jobs) {
				targets.set(`${skillsRoot}/${job.id}/SKILL.md`, {
					kind: "skill",
					rel: `${skillsRoot}/${job.id}/SKILL.md`,
					text: skillPointer(job),
					harness: harness.name,
				});
			}
		}
	}

	const wantsAgents =
		config && Array.isArray(config.harnesses) && config.harnesses.length
			? config.harnesses.includes("agents")
			: isDir(abs(base, ".agents"));
	if (wantsAgents && isDir(abs(base, ".agents"))) {
		for (const job of jobs) {
			targets.set(`.agents/skills/${job.id}/SKILL.md`, {
				kind: "skill",
				rel: `.agents/skills/${job.id}/SKILL.md`,
				text: skillPointer(job),
				harness: "Agent Skills",
			});
		}
	}
	return [...targets.values()];
}

function applyTargets(base, targets, check) {
	const rows = [];
	for (const target of targets) {
		const file = abs(base, target.rel);
		const existing = readIf(file);
		if (existing === null) {
			if (!check) write(file, target.text);
			rows.push([check ? "MISSING" : "WROTE", target.rel, target.harness]);
			continue;
		}
		if (existing.replace(/\r\n/g, "\n") === target.text) {
			rows.push(["CURRENT", target.rel, target.harness]);
			continue;
		}
		const isOurs =
			existing.includes(PROMPT_MARKER) ||
			existing.includes(LEGACY_MARKER) ||
			existing.includes(".agent-kit/SKILL.md");
		if (!isOurs) {
			rows.push(["KEPT", `${target.rel} (authored)`, target.harness]);
			continue;
		}
		if (check) {
			rows.push(["STALE", target.rel, target.harness]);
			continue;
		}
		write(file, target.text);
		rows.push(["UPDATED", target.rel, target.harness]);
	}
	return rows;
}

/** Pointers we wrote for a job that is no longer configured. Authored files are never touched. */
function findOwnedExtras(base, targets) {
	const desired = new Set(targets.map((target) => target.rel));
	const extras = [];
	for (const dir of COMMAND_ROOTS.filter((root) => isDir(abs(base, root)))) {
		for (const rel of walk(abs(base, dir), base)) {
			if (desired.has(rel) || !rel.endsWith(".md")) continue;
			const text = readIf(abs(base, rel));
			if (text && (text.includes(PROMPT_MARKER) || text.includes(LEGACY_MARKER)))
				extras.push(rel);
		}
	}
	for (const dir of SKILL_ROOTS.filter((root) => isDir(abs(base, root)))) {
		for (const rel of walk(abs(base, dir), base)) {
			if (desired.has(rel) || !rel.endsWith("/SKILL.md")) continue;
			const text = readIf(abs(base, rel));
			if (text && (text.includes(PROMPT_MARKER) || text.includes(LEGACY_MARKER)))
				extras.push(rel);
		}
	}
	return extras;
}

function pruneExtras(base, extras) {
	for (const rel of extras) {
		const file = abs(base, rel);
		fs.rmSync(file, { force: true });
		const dir = path.dirname(file);
		if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
			fs.rmdirSync(dir);
		}
	}
}

/** Setup calls this after harness detection; `pull` refreshes from the saved config. */
export function writeInvokablePointers(root) {
	const base = path.resolve(root || process.cwd());
	const config = readInvokeConfig(base);
	const targets = collectTargets(base, config);
	const rows = applyTargets(base, targets, false);
	pruneExtras(base, findOwnedExtras(base, targets));
	return rows;
}

export function cmdWire({ root, check, jobs } = {}) {
	const base = path.resolve(root || process.cwd());
	let config;
	try {
		config = readInvokeConfig(base);
	} catch (error) {
		console.error(`agent-kit: ${error.message}`);
		return 1;
	}
	if (jobs) {
		config = {
			...(config || {}),
			jobs: String(jobs)
				.split(",")
				.map((entry) => entry.trim())
				.filter(Boolean),
		};
	}
	const targets = collectTargets(base, config);
	if (targets.length === 0) {
		console.log(
			"agent-kit: no configured harness folder found (.claude, .opencode, .agents).",
		);
		console.log(
			"  Opt in once with: agent-kit setup . --wire opencode   (or claude, agents)",
		);
		console.log("  The procedures still run anywhere with: agent-kit prompt <job>");
		return check ? 1 : 0;
	}
	const extras = findOwnedExtras(base, targets);
	const rows = applyTargets(base, targets, check);
	if (check) {
		rows.push(...extras.map((rel) => ["EXTRA", rel, "stale job"]));
	} else {
		pruneExtras(base, extras);
		rows.push(...extras.map((rel) => ["PRUNED", rel, "stale job"]));
	}
	table(rows);
	if (check) {
		const bad = rows.filter(([status]) =>
			["MISSING", "STALE", "EXTRA"].includes(status),
		);
		console.log(
			bad.length
				? `\n${bad.length} procedure pointer(s) missing, stale or stale-job. Run: agent-kit wire`
				: "\nEvery configured harness has current procedure pointers.",
		);
		return bad.length ? 1 : 0;
	}
	const changed = rows.filter(([status]) =>
		["WROTE", "UPDATED", "PRUNED"].includes(status),
	).length;
	const hint =
		"Invoke /k79-commit, /k79-release, /k79-debug or /k79-spec; anywhere: agent-kit prompt <job>.";
	console.log(
		changed
			? `\nWired ${changed} pointer(s). ${hint}`
			: `\nProcedure pointers already current. ${hint}`,
	);
	return 0;
}
