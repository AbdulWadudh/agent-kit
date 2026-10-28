/** selftest/micro.mjs — the micro lane: cheap to open, still a card, still evidence */
import fs from "node:fs";
import { LOG_DIR, PROJECT, TASKS } from "../consts.mjs";
import { cmdDoctor } from "../doctor/index.mjs";
import { cmdTaskGuard } from "../guard.mjs";
import { abs, exists, expand, git, read, write } from "../io.mjs";
import { cmdRelease } from "../release.mjs";
import { cmdHotfix, cmdTaskClose, cmdTaskNew, cmdTaskShow } from "../tasks/index.mjs";
import { activeTasks } from "../taskfile.mjs";
import { evidenceDetail } from "../verify/evidence.mjs";
import { fixture, row, stubFetch } from "./ids.mjs";

/** Fill the in-progress task of a named fixture the way a session would. */
function fillTask(root, touches, summary, note, type = "changed") {
	const dir = abs(root, `${TASKS}/active`);
	const file = fs.readdirSync(dir).find(
		(f) => f.endsWith(".md") && /^status: IN_PROGRESS$/m.test(read(abs(dir, f))),
	);
	if (!file) return null;
	const p = abs(dir, file);
	write(
		p,
		read(p)
			.replace(
				/touches: \[\]/,
				`touches: [${touches.map((t) => `"${t}"`).join(", ")}]`,
			)
			.replace(/^type:.*$/m, `type: ${type}`)
			.replace(/^summary: .*$/m, `summary: ${JSON.stringify(summary)}`)
			.replace(/<!--\s*FILL:[\s\S]*?-->/g, "filled by selftest"),
	);
	return p;
}

function installSentinel(root) {
	const p = abs(root, PROJECT);
	const original = read(p);
	const row = `| build | node -e "require('fs').writeFileSync('build-ran','1')" | milestone |`;
	write(p, original.replace(/^\| build \| .*$/m, row));
	return original;
}

export async function microScenarios(ctx) {
	const { assert, captured, quiet, spoken } = ctx;
	console.log(
		"\n41. a micro fix opens, closes and releases without the full ceremony",
	);
	const spy = stubFetch(() => ({ status: 500, body: {} }));
	try {
		const { dir } = await fixture(ctx, "micro-local");
		const project = installSentinel(dir);
		git(dir, ["add", "-A"]);
		git(dir, ["commit", "-qm", "build sentinel"]);
		const opened = quiet(() =>
			cmdTaskNew({
				root: dir,
				slug: "one-line",
				lane: "micro",
				summary: "fix one line",
				intent: "The owner asked for a one-line hotfix.",
			}),
		);
		assert(opened === 0, "task new --lane micro opens");
		const task = activeTasks(dir).find((t) => t.fm.lane === "MICRO");
		assert(task?.fm.id === "PATCH-1", "the micro id is PATCH-1, allocated locally");
		assert(
			task.text.includes("| lint |") && !task.text.includes("| build |"),
			"the baseline records the always-tier rows only",
		);
		const shown = captured(() => cmdTaskShow({ root: dir }));
		assert(
			shown.includes("MICRO") && shown.includes("Verification:"),
			"task show prints the micro lane and the same evidence table",
		);

		fillTask(dir, ["src/index.ts"], "fix one line", "one line", "fixed");
		write(abs(dir, "src/index.ts"), "export const x = 2;\n");
		const closed = spoken(() => cmdTaskClose({ root: dir }));
		assert(closed.code === 0, "micro close exits 0");
		assert(
			closed.out.includes("fix (PATCH-1): fix one line"),
			"the close prints type (PATCH-N): summary",
		);
		assert(
			!exists(abs(dir, "build-ran")),
			"micro close never runs the milestone build row",
		);
		write(abs(dir, PROJECT), project);

		const archived = expand(dir, `${TASKS}/archive`).find((rel) =>
			/PATCH-1/.test(rel),
		);
		assert(!!archived, "micro close archives the task under PATCH-1");
		const archivedText = archived ? read(abs(dir, archived)) : "";
		assert(
			evidenceDetail(archivedText).length > 0 &&
				evidenceDetail(archivedText).every((r) => r.scope !== "full") &&
				!/^\| build \|/m.test(archivedText),
			"the archived micro task carries real evidence and no milestone row",
		);
		const card = expand(dir, LOG_DIR).find(
			(rel) => /PATCH-1/.test(rel) && !rel.endsWith("INDEX.md"),
		);
		assert(!!card, "the micro close wrote a PATCH card");
		const cardText = card ? read(abs(dir, card)) : "";
		assert(
			/^id: PATCH-1$/m.test(cardText) &&
				cardText.includes("## What changed") &&
				/^\*\*Task:\*\* \[PATCH-1\]\(\.\.\/\.\.\/tasks\/archive\//m.test(
					cardText,
				),
			"the close writes the normal card under PATCH-1, linked to the archive",
		);
		assert(spy.calls.length === 0, "micro open and close make no GitHub call");

		assert(
			row(ctx, dir, "task ids unique").status === "PASS",
			"task ids unique accepts PATCH-N",
		);
		assert(
			row(ctx, dir, "task lanes").status === "PASS",
			"doctor accepts the micro lane",
		);
		assert(
			row(ctx, dir, "micro closes").status === "PASS",
			"a closed micro task has a card and an evidence row",
		);
		const archivedPath = abs(dir, archived || `${TASKS}/archive/missing.md`);
		write(
			archivedPath,
			archivedText.replace(
				/<!-- VERIFY:START -->[\s\S]*?<!-- VERIFY:END -->/,
				"<!-- VERIFY:START -->\n<!-- VERIFY:END -->",
			),
		);
		assert(
			row(ctx, dir, "micro closes").status === "FAIL",
			"the micro row fails without its evidence",
		);
		write(archivedPath, archivedText);

		const guard = (text) => {
			write(abs(dir, "msg.txt"), text);
			return spoken(() => cmdTaskGuard({ root: dir, message: abs(dir, "msg.txt") }));
		};
		const accepted = guard("fix (PATCH-1): one line\n\nPATCH-1 — fix one line\n");
		assert(accepted.code === 0 && !accepted.out, "the guard accepts a PATCH subject");
		const noId = guard("update the guard\n\nsummary\n");
		assert(
			noId.code === 0 && noId.out.includes("commit message warning"),
			"the guard still warns on a subject with no id",
		);
		const fakeRel = `${TASKS}/archive/2026-10/2099-01-01-PATCH-7-guard.md`;
		write(abs(dir, fakeRel), "---\nid: PATCH-7\nlane: MICRO\nstatus: DONE\n---\n# PATCH-7\n");
		const seventh = guard("fix (PATCH-7): one line\n\nPATCH-7 — one line\n");
		assert(seventh.code === 0 && !seventh.out, "the guard accepts fix (PATCH-7): ...");
		for (const p of ["msg.txt", fakeRel]) fs.rmSync(abs(dir, p));

		git(dir, ["add", "-A"]);
		git(dir, ["commit", "-qm", "micro close"]);

		// A red full suite stops the note; --no-verify is the deliberate cut.
		const broken = read(abs(dir, PROJECT));
		write(
			abs(dir, PROJECT),
			broken.replace(
				/^\| test \| .*$/m,
				`| test | node -e "process.exit(1)" | always |`,
			),
		);
		assert(
			quiet(() => cmdRelease({ root: dir, version: "v0.0.1" })) === 1 &&
				!exists(abs(dir, ".agent-kit/releases/v0.0.1.md")),
			"release refuses while verify --full is red",
		);
		write(abs(dir, PROJECT), broken);
		assert(
			quiet(() =>
				cmdRelease({ root: dir, version: "v0.0.1", noVerify: true }),
			) === 0,
			"the deliberate cut writes the note",
		);
		const notePath = abs(dir, ".agent-kit/releases/v0.0.1.md");
		const note = exists(notePath) ? read(notePath) : "";
		assert(
			note.includes("PATCH-1") && !note.includes("/issues/"),
			"a PATCH card is claimed without an issue lookup",
		);
		assert(
			quiet(() =>
				cmdRelease({ root: dir, version: "v0.0.2", noVerify: true }),
			) === 1,
			"a second release does not repeat the PATCH card",
		);
		git(dir, ["add", "-A"]);
		git(dir, ["commit", "-qm", "release note"]);

		// The scope check is the micro lane's proof, exactly as it is for a top-level task.
		const second = quiet(() =>
			cmdTaskNew({
				root: dir,
				slug: "scope-breach",
				lane: "micro",
				noBaseline: true,
				summary: "prove the scope check",
			}),
		);
		assert(second === 0, "a second micro task opens");
		fillTask(dir, ["src/second.ts"], "prove the scope check", "scope");
		write(abs(dir, "src/second.ts"), "export const second = 1;\n");
		write(abs(dir, "src/outside.ts"), "export const outside = 1;\n");
		const active = abs(dir, `${TASKS}/active`);
		const scopeFile = fs
			.readdirSync(active)
			.find((f) => f.includes("PATCH-2"));
		assert(!!scopeFile, "the second micro id is PATCH-2");
		const scopeText = scopeFile ? read(abs(active, scopeFile)) : "";
		if (scopeFile)
			write(
				abs(active, scopeFile),
				scopeText.replace(/^lane: .*$/m, "lane: SIDEWAYS"),
			);
		assert(
			row(ctx, dir, "task lanes").status === "FAIL",
			"doctor fails a lane outside micro, quick or planned",
		);
		write(abs(active, scopeFile), scopeText);
		const breach = spoken(() => cmdTaskClose({ root: dir }));
		assert(
			breach.code === 1 && breach.out.includes("scope breach"),
			"micro close fails a changed file outside touches",
		);
	} finally {
		spy.restore();
	}

	const saved = { url: process.env.GITHUB_API_URL, token: process.env.GH_TOKEN };
	process.env.GITHUB_API_URL = "https://api.selftest";
	process.env.GH_TOKEN = "selftest-token";
	const issueSpy = stubFetch((call) => {
		const slug = call.url.replace(/^https:\/\/[^/]+/, "");
		if (call.method === "GET" && slug === "/repos/selftest/fixture")
			return {
				status: 200,
				body: { full_name: "selftest/fixture", has_issues: true },
			};
		return { status: 500, body: { message: "micro must not call GitHub" } };
	});
	try {
		const { dir } = await fixture(ctx, "micro-issue", { ids: "issue" });
		issueSpy.calls.length = 0;
		const opened = quiet(() =>
			cmdTaskNew({
				root: dir,
				slug: "issue-hotfix",
				lane: "micro",
				summary: "issue-mode fix",
			}),
		);
		assert(opened === 0, "micro opens in an ids: issue repo");
		const task = activeTasks(dir).find((t) => t.fm.lane === "MICRO");
		assert(
			task?.fm.id === "PATCH-1" && issueSpy.calls.length === 0,
			"the id is PATCH-1 and no issue is minted",
		);
		fillTask(dir, ["src/index.ts"], "issue-mode fix", "issue", "fixed");
		write(abs(dir, "src/index.ts"), "export const x = 3;\n");
		assert(
			quiet(() => cmdTaskClose({ root: dir })) === 0 &&
				issueSpy.calls.length === 0,
			"micro close in ids: issue never reaches GitHub",
		);
		assert(
			expand(dir, LOG_DIR).some((rel) => /PATCH-1/.test(rel)),
			"the issue-id repo still gets its PATCH card",
		);
		assert(
			quiet(() =>
				cmdHotfix({ root: dir, summary: "hotfix one line", files: "src/index.ts" }),
			) === 0,
			"hotfix opens, verifies and closes one micro fix",
		);
		assert(
			expand(dir, LOG_DIR).some((rel) => /PATCH-2/.test(rel)),
			"hotfix writes the same PATCH card the three commands write",
		);
	} finally {
		issueSpy.restore();
		for (const [name, value] of [
			["GITHUB_API_URL", saved.url],
			["GH_TOKEN", saved.token],
		]) {
			if (value === undefined) delete process.env[name];
			else process.env[name] = value;
		}
	}
}
