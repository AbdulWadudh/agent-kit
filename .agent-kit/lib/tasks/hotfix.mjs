/** tasks/hotfix.mjs — one micro fix as `task new --lane micro` + `verify` + `task close` */
import path from "node:path";
import { abs, die, read, write } from "../io.mjs";
import { activeTasks } from "../taskfile.mjs";
import { cmdVerify } from "../verify/index.mjs";
import { cmdTaskClose } from "./close.mjs";
import { cmdTaskNew } from "./open.mjs";

/** The text each seed marker gets; the card still carries the close-out paragraph. */
function filled(key, summary, files) {
	const list = files.map((f) => `\`${f}\``).join(", ");
	return (
		{
			intent: summary,
			"in-scope": list,
			"out-of-scope": "none — one file, reversible with `git revert`",
			decision: "none",
			step: `edit ${list} and land ${summary}`,
			test: "`agent-kit verify` → exit 0",
			summary,
			"docs-updated": "none needed: micro change, no rule changed",
		}[key] || "none"
	);
}

/**
 * The shortcut is the three commands, in order, with the file filled the way a session would:
 * no new state, no second ledger, and the same `PATCH-N` card the slow path writes.
 */
export function cmdHotfix({ root, summary, files }) {
	const base = path.resolve(root || process.cwd());
	const text = String(summary || "").trim();
	if (!text) die('usage: hotfix "<summary>" --files <a,b>');
	const set = String(files || "")
		.split(",")
		.map((f) => f.trim())
		.filter(Boolean);
	if (!set.length)
		die("hotfix needs --files <a,b>: the write set binds the close and the commit");

	const before = new Set(activeTasks(base).map((t) => t.file));
	if (
		cmdTaskNew({
			root: base,
			slug: text,
			lane: "micro",
			summary: text,
			intent: text,
		}) !== 0
	)
		return 1;
	const task = activeTasks(base).find((t) => !before.has(t.file));
	if (!task) {
		console.error("agent-kit: hotfix opened no task\n");
		return 1;
	}
	write(
		task.path,
		read(task.path)
			.replace(
				/^touches: \[\]$/m,
				`touches: [${set.map((f) => `"${f}"`).join(", ")}]`,
			)
			.replace(/<!--\s*FILL:([a-z-]+)[\s\S]*?-->/g, (_, key) =>
				filled(key, text, set),
			),
	);
	if (cmdVerify({ root: base, full: false }) !== 0) return 1;
	return cmdTaskClose({ root: base, id: task.fm.id });
}
