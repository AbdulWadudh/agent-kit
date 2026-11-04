/** tasks/migrate.mjs — give every archived task the issue it never got */
import path from "node:path";
import { listIssues, mintIssue, patchIssue } from "../github.mjs";
import { abs, read } from "../io.mjs";
import { taskNote } from "../release.mjs";
import { archivedTasks } from "../taskfile.mjs";

/** The task's summary is the title; the heading is the fallback an old archive still has. */
function summaryOf({ rel, text, fm }) {
	const fromFm = String(fm.summary || "").trim();
	if (fromFm) return fromFm;
	const heading = (text.match(/^# (.+)$/m) || [])[1] || "";
	return (
		heading.replace(new RegExp(`^${fm.id}\\s*[—:-]\\s*`), "").trim() || rel
	);
}

/**
 * The issue is a record, not a second plan: the paragraph the task carries, and the path
 * that holds the detail. The id is in the title because the number cannot be the id —
 * these tasks were closed before this repo took ids from issues.
 */
function issueText({ id, rel, text }) {
	const note = taskNote(text);
	return [
		note || `No summary was written for ${id}.`,
		"",
		"---",
		"",
		`Archived task: \`${rel}\``,
		"",
		`_${id} was closed before this repo took its task ids from issues, so its id is the title._`,
	].join("\n");
}

export async function cmdTaskMigrate({ root, dry }) {
	const base = path.resolve(root || process.cwd());
	const queue = archivedTasks(base)
		.slice()
		.sort((a, b) => Number(a.fm.id.slice(5)) - Number(b.fm.id.slice(5)))
		.map((task) => ({
			id: task.fm.id,
			rel: task.rel,
			text: task.text,
			summary: summaryOf(task),
			title: `${task.fm.id} — ${summaryOf(task)}`,
		}));
	if (queue.length === 0) {
		console.log("\nNothing archived to migrate.\n");
		return 0;
	}

	if (dry) {
		console.log(
			`\nWould open ${queue.length} closed issue(s) from the archive:\n`,
		);
		for (const q of queue) console.log(`  ${q.title}`);
		console.log("\nDry run: nothing was sent.\n");
		return 0;
	}

	let existing;
	try {
		existing = await listIssues(base);
	} catch (e) {
		console.error(`agent-kit: ${e.message}\n`);
		return 1;
	}
	// A title starting with the id is the task's issue: the id is the only durable key, since
	// the number differs from it by design.
	const titled = new Set(
		existing
			.map((issue) => (String(issue.title || "").match(/^(TASK-\d+)\b/) || [])[1])
			.filter(Boolean),
	);
	const todo = queue.filter((q) => !titled.has(q.id));
	if (todo.length === 0) {
		console.log(
			`\nAll ${queue.length} archived task(s) already have an issue.\n`,
		);
		return 0;
	}

	console.log(`\nMigrating ${todo.length} archived task(s):\n`);
	let failed = 0;
	for (const q of todo) {
		try {
			const issue = await mintIssue(base, {
				title: q.title,
				body: issueText(q),
			});
			await patchIssue(base, issue.number, {
				state: "closed",
				state_reason: "completed",
			});
			console.log(`  ${q.id.padEnd(10)} #${issue.number}  ${q.summary}`);
		} catch (e) {
			failed++;
			console.error(`  ${q.id.padEnd(10)} failed: ${e.message}`);
		}
	}
	const made = todo.length - failed;
	console.log(
		`\n${made} created, ${queue.length - todo.length} already had an issue${failed ? `, ${failed} failed — run it again to resume` : ""}\n`,
	);
	return failed ? 1 : 0;
}
