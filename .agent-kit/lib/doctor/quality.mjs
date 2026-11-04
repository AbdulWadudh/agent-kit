/** doctor/quality.mjs — source cap, folder density, feature barrels, test mirror */
import path from "node:path";
import { PROJECT } from "../consts.mjs";
import { abs, expand, isDir, read, readIf } from "../io.mjs";

const CODE_EXT = new Set([
	".ts",
	".tsx",
	".js",
	".jsx",
	".mjs",
	".cjs",
	".py",
	".go",
	".rs",
	".java",
	".rb",
	".php",
	".cs",
	".kt",
	".swift",
	".vue",
	".svelte",
]);
const FILE_CAP = 300;
const TARGET_CAP = 250;
const FOLDER_CAP = 8;

/** Bullets under a `## Heading` in project.md. `- none` means no paths. */
function sectionPaths(text, heading) {
	const lines = text.split(/\r?\n/);
	const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
	if (start === -1) return [];
	const paths = [];
	for (let index = start + 1; index < lines.length; index += 1) {
		if (/^##\s/.test(lines[index])) break;
		const match = lines[index].match(/^\s*-\s+`?([^`\s]+)`?/);
		if (!match) continue;
		const value = match[1].replace(/\/+$/, "");
		if (/^none$/i.test(value)) continue;
		paths.push(value);
	}
	return paths;
}

function lineTotal(filePath) {
	const text = read(filePath).replace(/\r\n/g, "\n");
	return text.replace(/\n$/, "").split("\n").length;
}

function isTestName(name) {
	return (
		/\.(test|spec)\.[^.]+$/.test(name) ||
		/^test_.+\.py$/.test(name) ||
		/_test\.go$/.test(name)
	);
}

function testStem(name) {
	let stem = name.replace(/\.(test|spec)(\.[^.]+)$/, "$2");
	if (stem.startsWith("test_")) stem = stem.slice(5);
	stem = stem.replace(/_test(\.[^.]+)$/, "$1");
	return stem.replace(/\.[^.]+$/, "");
}

/** True when every code line is a re-export: the file adds no behaviour. */
function isBarrelText(text) {
	const lines = text
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(
			(line) =>
				line &&
				!line.startsWith("//") &&
				!line.startsWith("/*") &&
				!line.startsWith("*") &&
				!line.startsWith("*/"),
		);
	return (
		lines.length > 0 &&
		lines.every((line) =>
			/^export\s+(type\s+)?(\*|\{[^}]*\})\s+from\s+["']/.test(line),
		)
	);
}

export function qualityChecks({ base, add }) {
	const projectText = readIf(abs(base, PROJECT)) || "";
	const declaredSources = sectionPaths(projectText, "Source roots");
	const declaredTests = sectionPaths(projectText, "Test roots");
	const exceptionPaths = sectionPaths(projectText, "Structure exceptions");
	const isExempt = (rel) =>
		exceptionPaths.some((entry) => rel === entry || rel.startsWith(`${entry}/`));

	const missingRoots = [...declaredSources, ...declaredTests].filter(
		(entry) => !isDir(abs(base, entry)),
	);
	add(
		missingRoots.length ? "FAIL" : "PASS",
		"declared roots",
		missingRoots.length
			? `missing: ${missingRoots.join(", ")}`
			: [...declaredSources, ...declaredTests].join(", ") || "none declared",
	);

	const sourceFiles = declaredSources
		.flatMap((root) => expand(base, root))
		.filter((rel) => CODE_EXT.has(path.extname(rel)) && !isExempt(rel));

	if (sourceFiles.length === 0) {
		add("PASS", "source cap", "no source files declared");
		add("PASS", "folder density", "no source files declared");
		add("PASS", "feature barrels", "no source files declared");
	} else {
		const sized = sourceFiles.map((rel) => [rel, lineTotal(abs(base, rel))]);
		const over = sized.filter(([, count]) => count > FILE_CAP);
		const near = sized.filter(
			([, count]) => count > TARGET_CAP && count <= FILE_CAP,
		);
		add(
			over.length ? "FAIL" : near.length ? "WARN" : "PASS",
			"source cap",
			[
				...over.slice(0, 4).map(([rel, count]) => `${rel} ${count}/${FILE_CAP}`),
				...near
					.slice(0, 4)
					.map(([rel, count]) => `${rel} ${count}/${TARGET_CAP} target`),
			].join(", "),
		);

		const byDir = new Map();
		for (const rel of sourceFiles) {
			const dir = path.posix.dirname(rel);
			byDir.set(dir, (byDir.get(dir) || 0) + 1);
		}
		const dense = [...byDir]
			.filter(([, count]) => count > FOLDER_CAP)
			.map(([dir, count]) => `${dir} ${count}/${FOLDER_CAP}`);
		add(
			dense.length ? "FAIL" : "PASS",
			"folder density",
			dense.slice(0, 4).join(", "),
		);

		const barrels = [];
		const publicEntries = new Set(declaredSources);
		for (const rel of sourceFiles) {
			if (!/(^|\/)index\.[^.]+$/.test(rel)) continue;
			const dir = path.posix.dirname(rel);
			// A package's own entry re-exports its public surface; a feature folder may not.
			if (publicEntries.has(dir)) continue;
			if (/(^|\/)config\/index\.[^.]+$/.test(rel)) continue;
			if (isBarrelText(read(abs(base, rel)))) barrels.push(rel);
		}
		add(
			barrels.length ? "FAIL" : "PASS",
			"feature barrels",
			barrels.slice(0, 4).join(", "),
		);
	}

	if (declaredTests.length === 0) {
		add("PASS", "test mirror", "no test roots declared");
		return;
	}

	const sourceFileSet = new Set(sourceFiles);
	const sourceDirSet = new Set(
		sourceFiles.map((rel) => path.posix.dirname(rel)),
	);
	const testFiles = declaredTests
		.flatMap((root) => expand(base, root))
		.filter((rel) => isTestName(path.posix.basename(rel)) && !isExempt(rel));
	const problems = [];

	for (const rel of testFiles) {
		const testRoot = declaredTests.find(
			(root) => rel === root || rel.startsWith(`${root}/`),
		);
		const relative = rel.slice(testRoot.length + 1);
		const dir = path.posix.dirname(relative);
		// A test outside a mirrored folder is integration/e2e, not a broken mirror.
		if (dir === ".") continue;
		const mirroredDirs = declaredSources
			.map((root) => path.posix.join(root, dir))
			.filter((candidate) => sourceDirSet.has(candidate));
		if (mirroredDirs.length === 0) continue;
		const stem = testStem(path.posix.basename(relative));
		const matches = mirroredDirs.some((candidate) =>
			[...CODE_EXT].some((ext) => sourceFileSet.has(`${candidate}/${stem}${ext}`)),
		);
		if (!matches) problems.push(rel);
	}

	add(
		problems.length ? "FAIL" : "PASS",
		"test mirror",
		problems.length
			? problems.slice(0, 4).join(", ")
			: `${testFiles.length} test file(s) map to source`,
	);
}
