/** selftest/skills.mjs — scenario 44: prompt-to-skill build and both install scopes */
import fs from "node:fs";
import { abs, exists, write } from "../io.mjs";

export function skillsScenario(ctx) {
	const { tmp, assert, dispatch, spoken } = ctx;
	console.log("\n44. prompts build into installable skills");

	const previousCwd = process.cwd();
	process.chdir(tmp);
	try {
		const out = abs(tmp, "generated-skills");
		const built = spoken(() =>
			dispatch(["node", "agent-kit", "skills", "build", "--out", out]),
		);
		assert(
			built.code === 0 && exists(abs(out, "k79-commit/SKILL.md")),
			"skills build writes every job",
		);
		const current = spoken(() =>
			dispatch(["node", "agent-kit", "skills", "check", "--out", out]),
		);
		assert(current.code === 0, "a fresh build passes check");

		write(abs(out, "k79-commit/SKILL.md"), "# stale\n");
		const stale = spoken(() =>
			dispatch(["node", "agent-kit", "skills", "check", "--out", out]),
		);
		assert(stale.code === 1, "a stale skill fails check");
		fs.rmSync(out, { recursive: true, force: true });

		const installed = spoken(() =>
			dispatch(["node", "agent-kit", "skills", "install"]),
		);
		assert(
			installed.code === 0 &&
				exists(abs(tmp, ".agents/skills/k79-commit/SKILL.md")),
			"install writes the project .agents/skills copy",
		);
		const verified = spoken(() =>
			dispatch(["node", "agent-kit", "skills", "install", "--check"]),
		);
		assert(verified.code === 0, "install --check passes");

		assert(
			exists(abs(tmp, ".agents/skills/k79-upgrade/SKILL.md")),
			"install writes every source skill, not only the four commands",
		);

		fs.rmSync(abs(tmp, ".agents"), { recursive: true, force: true });
	} finally {
		process.chdir(previousCwd);
	}
}
