/** doctor/history.mjs — archived-task records and release notes */
import fs from "node:fs";
import path from "node:path";
import {
	abs,
	exists,
	git,
	isDir,
	read,
} from "../io.mjs";
import { archivedTasks, closeOutField } from "../taskfile.mjs";
import { evidenceDetail } from "../verify/evidence.mjs";

export function historyChecks({ base, add }) {
	const archived = archivedTasks(base);

	// The task is the record: a close without a summary leaves a release with nothing to say.
	const missingOutcome = archived
		.filter((task) => {
			const outcome = closeOutField(task.text, "Summary");
			return (
				(!outcome || /<!--\s*FILL:/.test(outcome)) && !task.fm.summary
			);
		})
		.map((task) => task.rel);
	add(
		missingOutcome.length ? "FAIL" : "PASS",
		"archived outcomes",
		missingOutcome.slice(0, 3).join(", "),
	);

	// A micro close keeps the record: a real exit code in its evidence.
	const microProblems = archived
		.filter(
			(task) =>
				String(task.fm.lane || "").toUpperCase() === "MICRO" &&
				!evidenceDetail(task.text).some((row) => Number.isFinite(row.exit)),
		)
		.map((task) => `${task.fm.id}: no evidence row`);
	add(
		microProblems.length ? "FAIL" : "PASS",
		"micro closes",
		microProblems.slice(0, 3).join(", ") || "none",
	);

	// A release note is named for its version and says so on the first line, so a note
	// cannot be filed under the wrong tag. A repo that never cuts a release has no folder.
	const releaseDir = abs(base, ".agent-kit/releases");
	const releaseFiles = isDir(releaseDir)
		? fs.readdirSync(releaseDir).filter((file) => file.endsWith(".md"))
		: [];
	const misnamed = releaseFiles.filter((file) => {
		const first = (
			read(path.join(releaseDir, file)).split(/\r?\n/)[0] || ""
		).trim();
		return first !== `# Release ${file.replace(/\.md$/, "")}`;
	});
	add(
		misnamed.length ? "FAIL" : "PASS",
		"release notes",
		misnamed.length
			? `${misnamed.join(", ")} — first line must be "# Release v<version>" matching the filename`
			: releaseFiles.length
				? `${releaseFiles.length} release(s)`
				: "none yet",
	);

	// A note without a tag cannot be installed: `setup --ref` and `pull --ref` clone tags. WARN,
	// because a release is briefly untagged between cutting the note and tagging it.
	if (releaseFiles.length && exists(abs(base, ".git"))) {
		const untagged = releaseFiles
			.map((file) => file.replace(/\.md$/, ""))
			.filter((version) => !git(base, ["tag", "-l", version]));
		add(
			untagged.length ? "WARN" : "PASS",
			"release tags",
			untagged.length
				? `${untagged.join(", ")} has no tag — not installable; run agent-kit release --tag ${untagged[0]}`
				: `${releaseFiles.length} release(s) tagged`,
		);
	}
}
