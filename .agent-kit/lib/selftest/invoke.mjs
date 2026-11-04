/** selftest/invoke.mjs — scenario 43: prompt output and harness pointers */
import fs from "node:fs";
import { abs, exists, write } from "../io.mjs";

const JOBS = ["k79-commit", "k79-release", "k79-debug", "k79-spec"];

export function invokeScenario(ctx) {
	const { tmp, assert, dispatch, spoken, doctorRow } = ctx;
	console.log("\n43. procedures print and wire as pointers");

	const previousCwd = process.cwd();
	process.chdir(tmp);
	try {
		const printed = spoken(() =>
			dispatch(["node", "agent-kit", "prompt", "k79-commit"]),
		);
		assert(
			printed.code === 0 && printed.out.includes("# Commit"),
			"prompt k79-commit prints its procedure",
		);
		const listed = spoken(() =>
			dispatch(["node", "agent-kit", "prompt", "--list"]),
		);
		assert(
			listed.code === 0 && listed.out.includes("k79-release"),
			"prompt --list names every job",
		);
		const unknown = spoken(() =>
			dispatch(["node", "agent-kit", "prompt", "nope"]),
		);
		assert(unknown.code === 1, "an unknown procedure fails");

		fs.mkdirSync(abs(tmp, ".opencode"), { recursive: true });
		fs.mkdirSync(abs(tmp, ".claude"), { recursive: true });
		const before = spoken(() =>
			dispatch(["node", "agent-kit", "wire", "--check"]),
		);
		assert(before.code === 1, "wire --check fails before wiring");

		const wired = spoken(() => dispatch(["node", "agent-kit", "wire"]));
		assert(
			wired.code === 0 && wired.out.includes("WROTE"),
			"wire writes the pointers",
		);
		for (const rel of [
			".opencode/commands/k79-commit.md",
			".opencode/skills/k79-commit/SKILL.md",
			".claude/commands/k79-commit.md",
			".claude/skills/k79-commit/SKILL.md",
		]) {
			assert(exists(abs(tmp, rel)), `wire wrote ${rel}`);
		}
		assert(
			doctorRow("command pointers").status === "PASS",
			"command pointers pass",
		);

		const twice = spoken(() => dispatch(["node", "agent-kit", "wire"]));
		assert(
			twice.code === 0 && !twice.out.includes("WROTE"),
			"wire twice writes nothing new",
		);
		const after = spoken(() =>
			dispatch(["node", "agent-kit", "wire", "--check"]),
		);
		assert(after.code === 0, "wire --check passes after wiring");

		write(
			abs(tmp, ".claude/commands/commit.md"),
			"Read `.agent-kit/skills/commit.md` and follow it.\n",
		);
		const pruned = spoken(() => dispatch(["node", "agent-kit", "wire"]));
		assert(
			pruned.code === 0 && !exists(abs(tmp, ".claude/commands/commit.md")),
			"wire prunes an old unprefixed pointer",
		);

		write(
			abs(tmp, ".opencode/commands/bad.md"),
			`# copy\n${"x".repeat(800)}\n`,
		);
		assert(
			doctorRow("command pointers").status === "FAIL",
			"a copied command fails the pointer row",
		);
		fs.rmSync(abs(tmp, ".opencode/commands/bad.md"));

		for (const job of JOBS) {
			fs.rmSync(abs(tmp, `.opencode/commands/${job}.md`), { force: true });
			fs.rmSync(abs(tmp, `.opencode/skills/${job}`), {
				recursive: true,
				force: true,
			});
			fs.rmSync(abs(tmp, `.claude/commands/${job}.md`), { force: true });
			fs.rmSync(abs(tmp, `.claude/skills/${job}`), {
				recursive: true,
				force: true,
			});
		}

		write(
			abs(tmp, ".agent-kit/invoke.json"),
			JSON.stringify({ harnesses: ["opencode"], jobs: ["k79-commit"] }, null, 2),
		);
		const scoped = spoken(() => dispatch(["node", "agent-kit", "wire"]));
		assert(
			scoped.code === 0 &&
				exists(abs(tmp, ".opencode/commands/k79-commit.md")) &&
				!exists(abs(tmp, ".opencode/commands/k79-release.md")),
			"invoke.json selects one job and excludes the rest",
		);
		assert(
			doctorRow("invoke config").status === "PASS",
			"invoke config validates",
		);

		write(
			abs(tmp, ".agent-kit/invoke.json"),
			JSON.stringify({ harnesses: ["opencode"], jobs: ["nope"] }, null, 2),
		);
		assert(
			doctorRow("invoke config").status === "FAIL",
			"an unknown job fails invoke config",
		);

		fs.rmSync(abs(tmp, ".agent-kit/invoke.json"));
		fs.rmSync(abs(tmp, ".opencode/commands/k79-commit.md"), { force: true });
		fs.rmSync(abs(tmp, ".opencode/skills/k79-commit"), {
			recursive: true,
			force: true,
		});
		fs.rmSync(abs(tmp, ".opencode/commands"), {
			recursive: true,
			force: true,
		});
		fs.rmSync(abs(tmp, ".claude/commands"), { recursive: true, force: true });
	} finally {
		process.chdir(previousCwd);
	}
}
