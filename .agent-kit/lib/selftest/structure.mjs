/** selftest/structure.mjs — scenario 42: source cap, density, barrels, test mirror */
import fs from "node:fs";
import path from "node:path";
import { abs, read, write } from "../io.mjs";

export function structureQualityScenario(ctx) {
	const { tmp, assert, doctorRow } = ctx;
	console.log("\n42. code structure and test mirroring have caps");

	const make = (rel, text) => {
		const target = abs(tmp, rel);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, text);
		return target;
	};
	const remove = (rel) => fs.rmSync(abs(tmp, rel), { recursive: true, force: true });
	const body = (count) =>
		`${Array.from({ length: count }, (_, index) => `export const v${index} = ${index};`).join("\n")}\n`;

	const longFile = make("src/quality-long.ts", body(301));
	assert(doctorRow("source cap").status === "FAIL", "a source file past 300 lines fails");
	fs.writeFileSync(longFile, body(260));
	assert(doctorRow("source cap").status === "WARN", "a source file past 250 warns");
	fs.writeFileSync(longFile, body(20));
	assert(doctorRow("source cap").status === "PASS", "the source cap clears under 250");
	remove("src/quality-long.ts");

	for (let index = 0; index < 9; index += 1)
		make(`src/dense/f${index}.ts`, body(1));
	assert(doctorRow("folder density").status === "FAIL", "a ninth file in a folder fails");
	remove("src/dense/f8.ts");
	assert(doctorRow("folder density").status === "PASS", "the density clears at eight files");
	remove("src/dense");

	make("src/features/a/x.ts", body(1));
	make("src/features/a/index.ts", 'export * from "./x";\n');
	assert(doctorRow("feature barrels").status === "FAIL", "a feature barrel fails");
	remove("src/features/a/index.ts");
	assert(doctorRow("feature barrels").status === "PASS", "a real module index is not a barrel");
	make("src/config/theme.ts", body(1));
	make("src/config/index.ts", 'export * from "./theme";\n');
	assert(doctorRow("feature barrels").status === "PASS", "config/index is the allowed barrel");
	remove("src/config");
	remove("src/features");

	const projectPath = abs(tmp, ".agent-kit/project.md");
	const projectText = read(projectPath);
	fs.mkdirSync(abs(tmp, "tests"), { recursive: true });
	write(
		projectPath,
		/## Test roots/.test(projectText)
			? projectText.replace(/(## Test roots\r?\n\r?\n)- none detected/, "$1- tests")
			: `${projectText}\n## Test roots\n\n- tests\n`,
	);
	assert(doctorRow("declared roots").status === "PASS", "declared roots exist");

	make("src/features/b/other.ts", body(1));
	make("tests/features/b/demo.test.ts", 'test("demo", () => {});\n');
	assert(doctorRow("test mirror").status === "FAIL", "a test with no source file fails the mirror");
	make("src/features/b/demo.ts", body(1));
	assert(doctorRow("test mirror").status === "PASS", "the mirror clears when the source exists");

	remove("tests");
	remove("src/features");
	write(projectPath, projectText);
}
