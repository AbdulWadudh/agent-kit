/** guard.mjs — `task guard`: the hook gate, the commit plan, and the message shape */
import path from "node:path";
import { LOG_DIR, TASKS } from "./consts.mjs";
import {
	abs,
	covers,
	frontMatter,
	git,
	list,
	read,
	readIf,
	walk,
} from "./io.mjs";
import { activeTasks } from "./taskfile.mjs";

export const COMMIT_TYPES =
	"feat|fix|docs|refactor|test|chore|perf|build|ci|style|revert";
export const DEFAULT_MAX_COMMIT_FILES = 20;
const MAX_CONCERNS = 3;
const CONCERN_PREFIXES = {
	app: "feat(app)",
	components: "feat(ui)",
	lib: "refactor(lib)",
	db: "feat(db)",
	hooks: "feat(hooks)",
	public: "chore(public)",
	scripts: "chore(scripts)",
	specs: "docs(specs)",
	changelog: "docs(changelog)",
	config: "chore(config)",
	other: "chore(misc)",
};
const CONCERN_PATTERNS = [
	["app", /(^|\/)app\//],
	["components", /(^|\/)components\//],
	["hooks", /(^|\/)hooks\//],
	["db", /(^|\/)(db|database|migrations|prisma|drizzle)\//],
	["lib", /(^|\/)(lib|shared)\//],
	["public", /(^|\/)public\//],
	["scripts", /(^|\/)scripts\//],
	["specs", /(^|\/)specs\//],
	["changelog", /(^|\/)changelog\//],
	["config", /(^|\/)(config|configs)\/|(^|\/)(package\.json|tsconfig[^/]*\.json|[^/]*\.config\.[cm]?[jt]s)$/],
];
const REQUIRED_LABELS = [
	{ name: "Why", pattern: /^(?:#{1,6}\s*)?why(?:\s*:|\s*$)/i },
	{ name: "What", pattern: /^(?:#{1,6}\s*)?what(?:\s*:|\s*$)/i },
	{
		name: "Verification",
		pattern: /^(?:#{1,6}\s*)?(?:context\s*&\s*)?verification(?:\s*:|\s*$)/i,
	},
];

export function classifyConcern(filePath) {
	for (const [concern, pattern] of CONCERN_PATTERNS) {
		if (pattern.test(filePath)) return concern;
	}
	return "other";
}

function stagedFiles(base) {
	return (git(base, ["diff", "--cached", "--name-only", "--diff-filter=ACMR"]) || "")
		.split(/\r?\n/)
		.filter(Boolean);
}

function maxCommitFiles() {
	const raw = process.env.K79_MAX_COMMIT_FILES;
	if (!raw || !raw.trim()) return DEFAULT_MAX_COMMIT_FILES;
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_MAX_COMMIT_FILES;
	return parsed;
}

function groupFiles(filePaths) {
	const groups = new Map();
	for (const filePath of filePaths) {
		const concern = classifyConcern(filePath);
		if (!groups.has(concern)) groups.set(concern, []);
		groups.get(concern).push(filePath);
	}
	return groups;
}

function printCapFailure(count, cap) {
	console.error("k79 commit guard: staged file cap exceeded.");
	console.error(`  staged: ${count} files`);
	console.error(`  cap:    ${cap} (K79_MAX_COMMIT_FILES)`);
	console.error("Split it by concern:");
	console.error("  agent-kit guard plan");
	console.error("  git add -- <paths for exactly one concern>");
	console.error("Only as a deliberate exception: K79_ALLOW_BULK=1 git commit ...");
}

function printConcernWarning(groups) {
	console.error(
		`WARNING: this commit spans ${groups.size} concerns (more than ${MAX_CONCERNS}).`,
	);
	for (const [concern, files] of groups) {
		console.error(`  - ${concern}: ${files.length}`);
	}
	console.error("Split it into one commit per concern: agent-kit guard plan");
}

function guardPreCommit(base) {
	const files = stagedFiles(base);
	if (files.length === 0) return 0;

	const cap = maxCommitFiles();
	const isBulkAllowed = process.env.K79_ALLOW_BULK === "1";
	if (files.length > cap) {
		if (!isBulkAllowed) {
			printCapFailure(files.length, cap);
			return 1;
		}
		console.error(
			`WARNING: bulk commit allowed: ${files.length} staged files, cap ${cap}. This is not a fix.`,
		);
	}

	const groups = groupFiles(files);
	if (groups.size > MAX_CONCERNS) printConcernWarning(groups);

	const inProgress = activeTasks(base).filter(
		(task) => task.fm.status === "IN_PROGRESS",
	);
	if (inProgress.length === 0) return 0;
	if (inProgress.length > 1) {
		console.error(
			`agent-kit: ${inProgress.length} tasks are in progress. Close one before committing.`,
		);
		return 1;
	}
	const touches = list(inProgress[0].fm.touches);
	const breached = files.filter(
		(filePath) =>
			!filePath.startsWith(`${TASKS}/`) &&
			!filePath.startsWith(`${LOG_DIR}/`) &&
			!touches.some((touch) => covers(touch, filePath)),
	);
	if (breached.length === 0) return 0;
	console.error(
		`\nagent-kit: refusing this commit. ${inProgress[0].file} declares touches:`,
	);
	console.error(`  ${touches.join(", ") || "(none)"}`);
	console.error("Staged and not covered:");
	for (const filePath of breached) console.error(`  ${filePath}`);
	console.error(
		"\nEither add them to the task's `touches`, unstage them (git restore --staged <file>),",
	);
	console.error("or close the task first.\n");
	return 1;
}

/** One ready-to-run `git add -- <paths>` line per concern, plus the suggested prefix. */
export function guardPlan(base) {
	const files = stagedFiles(base);
	if (files.length === 0) {
		console.log("nothing staged");
		return 0;
	}
	const groups = groupFiles(files);
	const cap = maxCommitFiles();
	console.log(`Staged files: ${files.length} (cap ${cap})`);
	console.log(`Concerns: ${groups.size}`);
	for (const concern of Object.keys(CONCERN_PREFIXES)) {
		const concernFiles = groups.get(concern);
		if (!concernFiles) continue;
		console.log("");
		console.log(
			`${concern} (${concernFiles.length})  suggested: ${CONCERN_PREFIXES[concern]}: <summary>`,
		);
		console.log(
			`  git add -- ${concernFiles.map((filePath) => (/\s/.test(filePath) ? `'${filePath}'` : filePath)).join(" ")}`,
		);
		if (concernFiles.length > cap) {
			console.log(
				`  SPLIT: ${concernFiles.length} files in "${concern}" exceed the cap of ${cap}.`,
			);
		}
	}
	if (groups.size > 1) {
		console.log("");
		console.log("One commit per concern. Stage one group, then commit it.");
	}
	return 0;
}

function hasLabelBody(lines, pattern) {
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index].trim();
		const match = pattern.exec(line);
		if (!match) continue;
		const inline = line.slice(match[0].length).replace(/^[:\s]+/, "").trim();
		if (inline) return true;
		for (let next = index + 1; next < lines.length; next += 1) {
			const candidate = lines[next].trim();
			if (!candidate) continue;
			return !REQUIRED_LABELS.some((label) => label.pattern.test(candidate));
		}
		return false;
	}
	return false;
}

/**
 * Message gate. Advisory by default, blocking only with K79_GUARD=strict. The subject names the
 * type and the task; the body carries Why, What and Verification.
 */
export function guardCommitMessage(base, file) {
	const text = readIf(file);
	if (text === null) {
		console.error(`agent-kit: cannot read the commit message file: ${file}`);
		return 0;
	}
	const lines = text
		.split(/\r?\n/)
		.filter((line) => !/^\s*#(?!#)/.test(line));
	while (lines.length && !lines[0].trim()) lines.shift();
	while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
	const subject = lines[0] || "";
	if (/^(Merge |Revert "|fixup! |squash! )/.test(subject)) return 0;

	const ids = new Set();
	for (const lane of ["active", "archive"]) {
		const dir = abs(base, TASKS, lane);
		for (const rel of walk(dir)) {
			if (!rel.endsWith(".md")) continue;
			const id = frontMatter(read(abs(dir, rel))).id;
			if (id) ids.add(id);
		}
	}

	const strict = process.env.K79_GUARD === "strict";
	const fail = (why) => {
		console.error(
			`\nagent-kit: commit message ${strict ? "refused" : "warning"}. ${why}`,
		);
		console.error(`  got:   ${subject || "(empty)"}`);
		console.error("  want:  <type> (TASK-ID|PATCH-ID): <summary>");
		console.error(`  types: ${COMMIT_TYPES.replaceAll("|", ", ")}`);
		console.error("  body:  Why, What and Verification after one blank line");
		if (!strict) console.error("  The commit proceeds; rewrite it with `git commit --amend`.");
		console.error("");
		return strict ? 1 : 0;
	};

	if (ids.size > 0) {
		const ref = subject.match(
			new RegExp(`^(${COMMIT_TYPES}) \\((TASK-\\d+|PATCH-\\d+)\\): \\S`),
		);
		if (!ref) return fail("The subject is not `type (TASK-ID|PATCH-ID): summary`.");
		if (!ids.has(ref[2]))
			return fail(`${ref[2]} is not a task in active/ or archive/.`);
		if ((lines[1] || "").trim())
			return fail("The body must start after a blank line.");
		if (!lines.slice(2).some((line) => line.trim()))
			return fail("The body is empty: write what changed and why.");
	}

	const missing = REQUIRED_LABELS.filter(
		(label) => !hasLabelBody(lines, label.pattern),
	).map((label) => label.name);
	if (missing.length) return fail(`missing body label(s): ${missing.join(", ")}.`);
	return 0;
}

/**
 * Hook gate and planner. Opt-in per clone (`git config core.hooksPath .agent-kit/githooks`):
 * a shared repo must not rewrite a human's git behaviour on install.
 */
export function cmdTaskGuard({ root, message, plan }) {
	const base = path.resolve(root || process.cwd());
	if (plan) return guardPlan(base);
	if (message) return guardCommitMessage(base, message);
	return guardPreCommit(base);
}
