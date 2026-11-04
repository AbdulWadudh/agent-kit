/** doctor/structure.mjs — files, indexes, pointers, budgets */
import fs from "node:fs";
import { DOC_LIMIT, LOG_DIR, MANIFEST, PROJECT, SKIP_DIRS, STATE, TASKS, TASK_INDEX } from "../consts.mjs";
import { prerequisites } from "../env.mjs";
import { JOBS } from "../invoke/config.mjs";
import { abs, exists, expand, isDir, read, readIf, walk, walkDirs } from "../io.mjs";
import { idsMode } from "../taskfile.mjs";

/** Character caps count text, not line endings: a CRLF checkout must not fail a budget. */
function characterCount(text) {
	return text.replace(/\r\n/g, "\n").length;
}

export function structureChecks({ base, add, isTemplate }) {
	const required = [
		"AGENTS.md",
		"CLAUDE.md",
		MANIFEST,
		TASK_INDEX,
		".agent-kit/docs/INDEX.md",
		".agent-kit/agent-kit.mjs",
		".agent-kit/SKILL.md",
	];
	if (!isTemplate) required.push(PROJECT, STATE);
	const missing = required.filter((r) => !exists(abs(base, r)));
	add(missing.length ? "FAIL" : "PASS", "required files", missing.join(", "));

	// 0b. every directory an agent may open is indexed, so it reads one index and one file
	// instead of listing a folder into context. State stores are covered by their parent.
	const unindexedDirs = [".agent-kit"]
		.filter((dir) => isDir(abs(base, dir)))
		.flatMap((dir) => [dir, ...walkDirs(abs(base, dir), base)])
		.filter((rel) => !exists(abs(base, `${rel}/INDEX.md`)));
	add(
		unindexedDirs.length ? "FAIL" : "PASS",
		"directory indexes",
		unindexedDirs.slice(0, 4).join(", "),
	);

	// A harness skill file is a pointer: the loop lives in `.agent-kit/SKILL.md`, and a copy in
	// `.claude/skills/` or `.opencode/skills/` would drift the first time either is edited.
	const harnessDirs = fs
		.readdirSync(base, { withFileTypes: true })
		.filter(
			(e) =>
				e.isDirectory() && e.name.startsWith(".") && !SKIP_DIRS.has(e.name),
		)
		.map((e) => e.name)
		// Only a harness with a skills/ folder can hold a SKILL.md; walking a build cache
		// like .next would cost more than this check is worth.
		.filter((d) => isDir(abs(base, `${d}/skills`)));
	const pointers = harnessDirs
		.flatMap((d) => walk(abs(base, d), base))
		.filter((rel) => /(^|\/)skills\/[^/]+\/SKILL\.md$/.test(rel));
	const notPointer = pointers.filter((rel) => {
		const t = read(abs(base, rel));
		// A generated k79-* procedure is a full skill by design; `skills check` owns its drift.
		if (t.includes("Generated from .agent-kit/skills/")) return false;
		// A session pays for characters, not line breaks: a pointer is frontmatter plus one
		// line, and a copy of the loop is thousands of characters.
		return characterCount(t) > 700 || !t.includes(".agent-kit/SKILL.md");
	});
	add(
		notPointer.length ? "FAIL" : "PASS",
		"skill pointers",
		notPointer.length
			? `${notPointer.join(", ")} — a copy, not a pointer to .agent-kit/SKILL.md`
			: pointers.length
				? pointers.join(", ")
				: "none: AGENTS.md already points at .agent-kit/SKILL.md",
	);

	// A command is a pointer too: a copy of a procedure drifts from the one file that owns it.
	const commandFiles = [".claude/commands", ".opencode/commands"]
		.filter((dir) => isDir(abs(base, dir)))
		.flatMap((dir) => walk(abs(base, dir), base))
		.filter((rel) => rel.endsWith(".md"));
	const notCommandPointer = commandFiles.filter((rel) => {
		const text = read(abs(base, rel));
		return (
			characterCount(text) > 700 || !text.includes(".agent-kit/skills/")
		);
	});
	add(
		notCommandPointer.length ? "FAIL" : "PASS",
		"command pointers",
		notCommandPointer.length
			? `${notCommandPointer.join(", ")} - a copy, not a pointer to .agent-kit/skills/`
			: commandFiles.length
				? `${commandFiles.length} command(s) point at .agent-kit/skills/`
				: "none: no harness command folder",
	);

	const invokeText = readIf(abs(base, ".agent-kit/invoke.json"));
	if (invokeText === null) {
		add("PASS", "invoke config", "not configured");
	} else {
		try {
			const config = JSON.parse(invokeText);
			const knownHarness = new Set(["claude", "opencode", "agents"]);
			const knownJob = new Set(JOBS.map((job) => job.id));
			const harnesses = Array.isArray(config.harnesses) ? config.harnesses : [];
			const jobs = Array.isArray(config.jobs) ? config.jobs : [];
			const knownDirs = {
				claude: ".claude",
				opencode: ".opencode",
				agents: ".agents",
			};
			const badHarness = harnesses.filter((id) => !knownHarness.has(id));
			const badJob = jobs.filter(
				(id) =>
					!knownJob.has(id) ||
					!exists(abs(base, `.agent-kit/skills/${id}.md`)),
			);
			const missingHarness = harnesses.filter(
				(id) => knownDirs[id] && !isDir(abs(base, knownDirs[id])),
			);
			add(
				badHarness.length || badJob.length
					? "FAIL"
					: missingHarness.length
						? "WARN"
						: "PASS",
				"invoke config",
				badHarness.length || badJob.length
					? [
							...badHarness.map((id) => `${id} (harness)`),
							...badJob.map((id) => `${id} (job)`),
						].join(", ")
					: missingHarness.length
						? `${missingHarness.join(", ")} configured but folder missing - run setup --wire ${missingHarness.join(",")}`
						: `${harnesses.length} harness(es), ${jobs.length} job(s)`,
			);
		} catch (error) {
			add("FAIL", "invoke config", `invalid JSON: ${error.message}`);
		}
	}

	// The machine's tools are a gate, not advice (owner 2026-10-28): a missing one is how silent
	// token waste and a task with no derivable inventory happen. Presence only, except GitHub,
	// which is listed only when the repo takes its ids from issues.
	const issueIds = idsMode(base) === "issue";
	const req = prerequisites(base, { issue: issueIds });
	const absent = req.filter((p) => !p.ok);
	add(
		absent.length ? "FAIL" : "PASS",
		"prerequisites",
		absent.length
			? absent.map((p) => `${p.name}: ${p.fix}`).join("; ")
			: req.map((p) => `${p.name} ${p.found}`).join(", "),
	);

	// A session pays for these four files before it plans anything, so they are the budget. A
	// section that outgrows its cap moves to a file reached by an index, which is the JIT path.
	const budget = [
		["AGENTS.md", 9000],
		[".agent-kit/SKILL.md", 11000],
		[".agent-kit/rules/_behavior.md", 8500],
		[".agent-kit/rules/INDEX.md", 2000],
	];
	const over = budget
		.map(([rel, cap]) => {
			const p = abs(base, rel);
			return exists(p) ? { rel, cap, chars: characterCount(read(p)) } : null;
		})
		.filter((r) => r && r.chars > r.cap);
	add(
		over.length ? "FAIL" : "PASS",
		"context budget",
		over.length
			? `${over.map((r) => `${r.rel} ${r.chars}/${r.cap}`).join(", ")} - move detail behind an index, see .agent-kit/skills/k79-trim-agents-md.md`
			: "",
	);

	// A reference doc past the character ceiling becomes a folder with an index. Records are the
	// state, not a page a session reads for guidance, so they are exempt.
	const mdExempt = [
		`${TASKS}/active/`,
		`${TASKS}/archive/`,
		`${LOG_DIR}/`,
		".agent-kit/releases/",
		`${TASKS}/BACKLOG.md`,
		".agent-kit/rules/learnings.md",
	];
	const mdOver = [
		"AGENTS.md",
		"CLAUDE.md",
		"README.md",
		"SETUP.md",
		"docs",
		"setup",
		"examples",
		".agent-kit",
	]
		.flatMap((entry) => expand(base, entry))
		.filter(
			(rel) =>
				rel.endsWith(".md") &&
				!mdExempt.some((p) => rel === p || rel.startsWith(p)),
		)
		.map((rel) => ({ rel, chars: characterCount(read(abs(base, rel))) }))
		.filter((f) => f.chars > DOC_LIMIT);
	add(
		mdOver.length ? "FAIL" : "PASS",
		"markdown ceiling",
		mdOver.length
			? `${mdOver.map((f) => `${f.rel} ${f.chars}/${DOC_LIMIT}`).join(", ")} — split it into a folder with an INDEX.md, one file per section`
			: "",
	);
}
