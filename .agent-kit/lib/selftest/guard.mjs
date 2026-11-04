/** selftest/guard.mjs — scenario 45: the file cap, the plan and the strict message */
import fs from "node:fs";
import { abs, git, write } from "../io.mjs";
import { cmdTaskGuard } from "../guard.mjs";

export function guardScenario(ctx) {
	const { tmp, assert, spoken } = ctx;
	console.log("\n45. the commit guard caps the set, plans by concern and gates the body");
	const repo = abs(tmp, "guard-fixture");
	fs.mkdirSync(repo, { recursive: true });
	git(repo, ["init", "--quiet"]);
	git(repo, ["config", "user.email", "g@e.test"]);
	git(repo, ["config", "user.name", "Guard"]);

	const files = Array.from({ length: 25 }, (_unused, index) => `bulk-${index}.txt`);
	for (const file of files) write(abs(repo, file), "x\n");
	git(repo, ["add", "--", ...files]);

	const capped = spoken(() => cmdTaskGuard({ root: repo }));
	assert(capped.code === 1 && capped.out.includes("cap exceeded"), "25 staged files fail the cap");

	const savedBulk = process.env.K79_ALLOW_BULK;
	process.env.K79_ALLOW_BULK = "1";
	const bulk = spoken(() => cmdTaskGuard({ root: repo }));
	if (savedBulk === undefined) delete process.env.K79_ALLOW_BULK;
	else process.env.K79_ALLOW_BULK = savedBulk;
	assert(bulk.code === 0 && bulk.out.includes("bulk commit allowed"), "K79_ALLOW_BULK warns and passes");

	const plan = spoken(() => cmdTaskGuard({ root: repo, plan: true }));
	assert(
		plan.code === 0 &&
			plan.out.includes("git add --") &&
			plan.out.includes("suggested:"),
		"guard plan prints a git add line and a prefix",
	);

	const messageFile = abs(repo, "message.txt");
	write(messageFile, "feat (TASK-1): no body labels\n\nplain body\n");
	const advisory = spoken(() => cmdTaskGuard({ root: repo, message: messageFile }));
	assert(advisory.code === 0, "a missing body label warns by default");

	const savedStrict = process.env.K79_GUARD;
	process.env.K79_GUARD = "strict";
	const strict = spoken(() => cmdTaskGuard({ root: repo, message: messageFile }));
	if (savedStrict === undefined) delete process.env.K79_GUARD;
	else process.env.K79_GUARD = savedStrict;
	assert(strict.code === 1, "K79_GUARD=strict refuses a missing label");

	write(
		messageFile,
		"feat (TASK-1): a valid body\n\nWhy:\n- reason\n\nWhat:\n- change\n\nVerification:\n- node test\n",
	);
	assert(
		spoken(() => cmdTaskGuard({ root: repo, message: messageFile })).code === 0,
		"a body with Why, What and Verification passes",
	);

	fs.rmSync(repo, { recursive: true, force: true });
}
