/** invoke/install.mjs — the setup-time decision: create harness folders, save jobs, wire */
import fs from "node:fs";
import { HARNESSES, detectHarnesses } from "../env.mjs";
import { abs, isDir } from "../io.mjs";
import { JOBS, readInvokeConfig, writeInvokeConfig } from "./config.mjs";
import { writeInvokablePointers } from "./pointers.mjs";

export function installInvocation({ root, wire, found, home, pathEnv }) {
	let detected = found;
	const requested = String(wire || "")
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean);

	if (requested.length) {
		for (const id of requested) {
			if (id === "agents") {
				fs.mkdirSync(abs(root, ".agents"), { recursive: true });
				continue;
			}
			const harness = HARNESSES.find((entry) => entry.id === id);
			if (!harness) {
				return {
					error: `unknown harness "${id}" (use opencode, claude or agents).`,
				};
			}
			fs.mkdirSync(abs(root, harness.repo[0]), { recursive: true });
		}
		writeInvokeConfig(root, {
			harnesses: requested,
			jobs: JOBS.map((job) => job.id),
		});
		detected = detectHarnesses(root, home, pathEnv);
	} else {
		let existingConfig = null;
		try {
			existingConfig = readInvokeConfig(root);
		} catch (error) {
			return { error: error.message };
		}
		if (!existingConfig) {
			const ids = detected
				.filter((entry) => entry.id && isDir(abs(root, entry.repo[0])))
				.map((entry) => entry.id);
			if (isDir(abs(root, ".agents"))) ids.push("agents");
			writeInvokeConfig(root, {
				harnesses: [...new Set(ids)],
				jobs: JOBS.map((job) => job.id),
			});
		}
	}

	let procedures = [];
	try {
		procedures = writeInvokablePointers(root);
	} catch (error) {
		return { error: error.message };
	}
	return { found: detected, procedures };
}
