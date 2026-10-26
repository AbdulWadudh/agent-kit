#!/usr/bin/env node
/**
 * agent-kit.mjs — the template's only executable surface.
 *
 * Zero dependencies. Runs on Bun or Node >= 18. Uses node: builtins only, so
 * `bun scripts/agent-kit.mjs <cmd>` and `node scripts/agent-kit.mjs <cmd>` are
 * the same program.
 *
 * Commands
 *   setup [target] [--source <path|url>]   scaffold a repo; never overwrites an authored file
 *   check                                  drift table vs the template; never writes
 *   pull [--force] [--seeds]               apply the sync, then doctor
 *   doctor [--strict]                      truth checks over the repo's own docs
 *   verify                                 run the declared commands, record the evidence
 *   task new <slug> [--lane quick|planned] open a task
 *   task close [--id TASK-N]               scope-check, record, archive, index
 *   selftest                               prove every gate can fail, in a temp repo
 *
 * Design rule: one canonical home per fact. Commands live in .agents/project.md
 * only; this file cites them, never restates them.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = '.agents/sync-manifest.json';
const STATE = '.agents/template.json';
const PROJECT = '.agents/project.md';
const TASKS = '.agents/tasks';
const TASK_INDEX = `${TASKS}/INDEX.md`;
const TASK_TEMPLATE = '.agents/templates/task.md';
const LOG_DIR = '.agents/logs';
const CHANGELOG = `${LOG_DIR}/changelog.md`;

const TEXT_EXT = new Set(['.md', '.mjs', '.js', '.json', '.yml', '.yaml', '.sh', '.txt', '.toml']);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'out', 'coverage', '.venv', 'venv', 'target', '__pycache__']);
// Common double-encoded UTF-8 sequences. Escaped so the pattern cannot match its own source.
const MOJIBAKE = new RegExp('(dY[\\x22\\x27~-]|\\u00c3[\\x80-\\xBF]|\\u00e2\\u20ac|\\ufffd)');

// ---------------------------------------------------------------- utilities

const abs = (root, p) => path.join(root, p);
const posix = (p) => p.split(path.sep).join('/');
const exists = (p) => fs.existsSync(p);
const isDir = (p) => exists(p) && fs.statSync(p).isDirectory();

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

function readIf(p) {
  return exists(p) ? read(p) : null;
}

function write(p, text) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text, 'utf8');
}

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function walk(dir, base = dir, acc = []) {
  if (!isDir(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(path.join(dir, e.name), base, acc);
    } else {
      acc.push(posix(path.relative(base, path.join(dir, e.name))));
    }
  }
  return acc;
}

/** Entries are repo-relative. A directory entry yields every file beneath it. */
function expand(root, entry) {
  const p = abs(root, entry);
  if (!exists(p)) return [];
  if (isDir(p)) return walk(p, root);
  return [entry];
}

/** Compare semantics, not encoding artifacts: BOM and CRLF are not drift. */
function normalize(buf) {
  let s = buf.toString('utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  return s.split('\r\n').join('\n');
}

function hashFile(p) {
  if (!exists(p) || isDir(p)) return null;
  return crypto.createHash('sha256').update(normalize(fs.readFileSync(p))).digest('hex').slice(0, 16);
}

function json(p, fallback = null) {
  const t = readIf(p);
  if (t === null) return fallback;
  try {
    return JSON.parse(t);
  } catch (e) {
    die(`${p}: invalid JSON (${e.message})`);
  }
}

function die(msg, code = 1) {
  console.error(`agent-kit: ${msg}`);
  process.exit(code);
}

function run(cmd, cwd, timeout = Number(process.env.AGENT_KIT_TIMEOUT || 600000)) {
  const r = spawnSync(cmd, { cwd, shell: true, encoding: 'utf8', timeout, env: process.env });
  return { code: r.status === null ? 124 : r.status, out: `${r.stdout || ''}${r.stderr || ''}` };
}

function git(root, args) {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  // Trailing whitespace only: porcelain output is column-sensitive, so a full trim
  // would eat the leading space of the first status line.
  return r.status === 0 ? r.stdout.replace(/\s+$/, '') : null;
}

function fenceFree(text) {
  return text.replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[ \t]*$/gm, '');
}

function frontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    out[line.slice(0, i).trim()] = line.slice(i + 1).replace(/\s+#.*$/, '').trim();
  }
  return out;
}

function list(value) {
  const t = (value || '').trim();
  if (!t.startsWith('[')) return t ? [t] : [];
  try {
    return JSON.parse(t.replace(/'/g, '"'));
  } catch {
    return t.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
}

function normGlob(s) {
  return posix(s).replace(/^\.\//, '').replace(/\/+$/, '').toLowerCase();
}

const segs = (s) => normGlob(s).split('/').filter(Boolean);

/** Does `glob` cover `file`? Segment-wise: * = one segment, ** = zero or more,
 *  and a shorter glob covers everything beneath it (path-prefix rule). */
function covers(glob, file) {
  const g = segs(glob);
  const f = segs(file);
  const m = (i, j) => {
    if (i === g.length) return true;
    if (g[i] === '**') return m(i + 1, j) || (j < f.length && m(i, j + 1));
    if (j >= f.length) return false;
    return (g[i] === '*' || g[i] === f[j]) && m(i + 1, j + 1);
  };
  return m(0, 0);
}

/** Conservative overlap used only to flag two in-flight tasks on the same files. */
function overlaps(a, b) {
  const A = segs(a);
  const B = segs(b);
  for (let i = 0; i < Math.min(A.length, B.length); i++) {
    if (A[i] === '**' || B[i] === '**') return true;
    if (A[i] !== '*' && B[i] !== '*' && A[i] !== B[i]) return false;
  }
  return true;
}

function block(text, name, body) {
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(text)) return text;
  return text.replace(re, `$1\n${body}\n$2`);
}

function sectionRows(text) {
  const m = text.match(/##\s+Commands\s*\n([\s\S]*?)(\n##\s|$)/);
  if (!m) return [];
  return m[1]
    .split(/\r?\n/)
    .map((l) => l.match(/^\|\s*([a-z]+)\s*\|\s*`?([^`|]+?)`?\s*\|/))
    .filter(Boolean)
    .map((mm) => [mm[1], mm[2].trim()]);
}

function table(rows) {
  const width = Math.max(7, ...rows.map((r) => r[0].length));
  for (const [status, name, detail] of rows) {
    console.log(`  ${status.padEnd(width)}  ${name}${detail ? `  ${detail}` : ''}`);
  }
}

// ---------------------------------------------------------------- manifest

function manifestOf(root) {
  const m = json(abs(root, MANIFEST));
  if (!m) return null;
  m.machinery = m.machinery || [];
  m.seeds = m.seeds || {};
  m.prune = m.prune || [];
  m.owned = m.owned || [];
  return m;
}

function sourceFor(root, override) {
  if (override) return resolveSpec(root, override);
  const state = json(abs(root, STATE));
  if (state && state.source) return resolveSpec(root, state.source);
  return null;
}

function resolveSpec(root, spec) {
  const looksRemote = /^(https?:\/\/|git@|ssh:\/\/)/.test(spec) || spec.endsWith('.git');
  if (!looksRemote) {
    const p = path.resolve(root, spec);
    if (!isDir(p)) die(`source not found: ${p}`);
    return { root: p, spec, temp: false };
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-kit-'));
  const r = run(`git clone --depth 1 "${spec}" "${tmp}"`, root);
  if (r.code !== 0) die(`git clone failed for ${spec}\n${r.out}`);
  return { root: tmp, spec, temp: true };
}

// ---------------------------------------------------------------- stack detection

function detectStack(root) {
  const out = { languages: [], manifests: [], pm: null, commands: {}, entry: [], generated: [], notes: [] };
  const pkg = json(abs(root, 'package.json'));

  if (pkg) {
    out.languages.push('JavaScript');
    out.manifests.push('package.json');
    if (exists(abs(root, 'tsconfig.json')) || pkg.devDependencies?.typescript || pkg.dependencies?.typescript) {
      out.languages.push('TypeScript');
    }
    const declared = (pkg.packageManager || '').split('@')[0];
    const lock = [
      ['bun', ['bun.lockb', 'bun.lock']],
      ['pnpm', ['pnpm-lock.yaml']],
      ['yarn', ['yarn.lock']],
      ['npm', ['package-lock.json']],
    ].find(([, files]) => files.some((f) => exists(abs(root, f))));
    out.pm = declared || (lock ? lock[0] : 'npm');
    const s = pkg.scripts || {};
    const pick = (...names) => names.find((n) => s[n]);
    const install = { bun: 'bun install', pnpm: 'pnpm install', yarn: 'yarn install', npm: 'npm install' }[out.pm];
    out.commands.install = install;
    const build = pick('build', 'compile');
    const test = pick('test', 'test:unit', 'vitest', 'jest');
    const lint = pick('lint', 'eslint');
    const typecheck = pick('typecheck', 'type-check', 'tsc');
    if (build) out.commands.build = `${out.pm} run ${build}`;
    if (test) out.commands.test = `${out.pm} run ${test}`;
    if (lint) out.commands.lint = `${out.pm} run ${lint}`;
    if (typecheck) out.commands.typecheck = `${out.pm} run ${typecheck}`;
    else if (out.languages.includes('TypeScript') && exists(abs(root, 'tsconfig.json'))) {
      out.commands.typecheck = `${out.pm === 'bun' ? 'bunx' : 'npx'} tsc --noEmit`;
    }
    const entry = [pkg.main, pkg.module, ...(Array.isArray(pkg.bin) ? pkg.bin : pkg.bin ? [pkg.bin] : [])]
      .filter(Boolean)
      .map((e) => posix(e));
    out.entry.push(...entry);
  }

  const py = ['pyproject.toml', 'requirements.txt', 'setup.py'].filter((f) => exists(abs(root, f)));
  if (py.length) {
    out.languages.push('Python');
    out.manifests.push(...py);
    out.commands.install = out.commands.install || 'python -m pip install -r requirements.txt';
    const hasTests = exists(abs(root, 'tests')) || exists(abs(root, 'test'));
    if (hasTests) out.commands.test = 'python -m pytest -q';
    const pyText = readIf(abs(root, 'pyproject.toml')) || '';
    if (/ruff/.test(pyText)) out.commands.lint = 'python -m ruff check .';
    if (/mypy/.test(pyText)) out.commands.typecheck = 'python -m mypy .';
  }

  if (exists(abs(root, 'go.mod'))) {
    out.languages.push('Go');
    out.manifests.push('go.mod');
    out.commands.install ||= 'go mod download';
    out.commands.build = 'go build ./...';
    out.commands.test = 'go test ./...';
    out.commands.lint ||= 'go vet ./...';
  }

  if (exists(abs(root, 'Cargo.toml'))) {
    out.languages.push('Rust');
    out.manifests.push('Cargo.toml');
    out.commands.install ||= 'cargo fetch';
    out.commands.build ||= 'cargo build';
    out.commands.test ||= 'cargo test';
    out.commands.lint ||= 'cargo clippy -- -D warnings';
  }

  if (out.languages.length === 0 && exists(abs(root, 'Makefile'))) {
    const mk = read(abs(root, 'Makefile'));
    out.manifests.push('Makefile');
    for (const target of ['build', 'test', 'lint']) {
      if (new RegExp(`^${target}:`, 'm').test(mk)) out.commands[target] = `make ${target}`;
    }
  }

  if (out.entry.length === 0) {
    for (const c of ['src/index.ts', 'src/index.js', 'src/main.ts', 'src/main.js', 'main.py', 'app/main.py', 'src/main.rs', 'cmd']) {
      if (exists(abs(root, c))) out.entry.push(c);
    }
  }

  for (const d of ['node_modules', 'dist', 'build', 'out', '.next', '.nuxt', '.svelte-kit', 'coverage', '.venv', 'venv', '__pycache__', 'target', 'vendor', '.turbo', '.cache']) {
    if (exists(abs(root, d))) out.generated.push(d);
  }

  return out;
}

function projectMd(stack, today) {
  const lines = [];
  lines.push('# Project Profile', '');
  lines.push('<!-- Generated by agent-kit setup. Review it, then keep it current.');
  lines.push('     This file is the ONLY home for stack facts and commands. AGENTS.md, the');
  lines.push('     rules and the verification gate cite it; none of them restate it. -->', '');
  lines.push('## Stack', '', '| Fact | Value |', '|---|---|');
  lines.push(`| Languages | ${stack.languages.join(', ') || 'undetected'} |`);
  lines.push(`| Package manager | ${stack.pm || 'n/a'} |`);
  lines.push(`| Manifests | ${stack.manifests.join(', ') || 'none found'} |`);
  lines.push('', '## Commands', '', '| Action | Command |', '|---|---|');
  const order = ['install', 'build', 'typecheck', 'lint', 'test'];
  for (const action of order) {
    if (stack.commands[action]) lines.push(`| ${action} | ${stack.commands[action]} |`);
  }
  if (Object.keys(stack.commands).length === 0) lines.push('| build | <!-- FILL:build-command --> |');
  lines.push('', '## Entry points', '');
  lines.push(...(stack.entry.length ? stack.entry.map((e) => `- ${e}`) : ['<!-- FILL:entry-points -->']));
  lines.push('', '## Never edit (generated)', '');
  lines.push(stack.generated.length ? stack.generated.map((g) => `- ${g}/`).join('\n') : '- none detected');
  lines.push('', '## Domain notes', '');
  lines.push('<!-- FILL:domain-notes — 3-6 bullets an agent cannot infer from the code:');
  lines.push('     ownership boundaries, external services, invariants that must not break. -->');
  lines.push('', '---', '', `Generated ${today}. Re-run \`agent-kit setup\` only to refresh a missing file.`, '');
  return lines.join('\n');
}

// ---------------------------------------------------------------- setup

function cmdSetup({ target, sourceRoot, sourceSpec }) {
  const root = path.resolve(target || process.cwd());
  const src = path.resolve(sourceRoot || SCRIPT_ROOT);
  const selfAdopt = root === src;
  const existing = json(abs(root, STATE), {});
  if (existing.role === 'template' && !selfAdopt) die('that directory is the template source, not a target');
  if (selfAdopt) {
    console.log('Adopting this repo in place: the hash baseline records what exists now.');
    console.log('Pass --source <path|url> to enable check/pull later.');
  }
  const manifest = manifestOf(src);
  if (!manifest) die(`no ${MANIFEST} in ${src}`);

  const today = new Date().toISOString().slice(0, 10);
  const state = json(abs(root, STATE), {}) || {};
  const rows = [];
  let copied = 0;
  let kept = 0;

  for (const entry of manifest.machinery) {
    for (const rel of expand(src, entry)) {
      const to = abs(root, rel);
      if (exists(to)) {
        kept++;
        continue;
      }
      copy(abs(src, rel), to);
      copied++;
      rows.push(['COPIED', rel, '']);
    }
  }

  for (const [dest, seed] of Object.entries(manifest.seeds)) {
    if (exists(abs(root, dest))) {
      kept++;
      continue;
    }
    if (!exists(abs(src, seed))) {
      rows.push(['MISSING', dest, `seed ${seed} not in template`]);
      continue;
    }
    copy(abs(src, seed), abs(root, dest));
    copied++;
    rows.push(['COPIED', dest, '']);
  }

  fs.mkdirSync(abs(root, `${TASKS}/active`), { recursive: true });
  fs.mkdirSync(abs(root, `${TASKS}/archive`), { recursive: true });
  fs.mkdirSync(abs(root, '.agents/logs'), { recursive: true });

  if (!exists(abs(root, PROJECT))) {
    write(abs(root, PROJECT), projectMd(detectStack(root), today));
    rows.push(['COPIED', PROJECT, 'generated from the manifests']);
  } else {
    kept++;
  }

  // Baseline = what we just installed. Drift is measured against this, never against memory.
  const next = {
    role: 'target',
    // In-place adoption has no upstream to diff against; an empty source keeps check honest.
    source: selfAdopt ? '' : sourceSpec || state.source || src,
    version: manifest.version || 1,
    installed_at: state.installed_at || today,
    last_pull: today,
    machinery: {},
    seeds: {},
  };
  for (const entry of manifest.machinery) {
    for (const rel of expand(src, entry)) {
      const h = hashFile(abs(src, rel));
      if (h) next.machinery[rel] = h;
    }
  }
  for (const [dest, seed] of Object.entries(manifest.seeds)) {
    const h = hashFile(abs(src, seed));
    if (h) next.seeds[dest] = h;
  }
  write(abs(root, STATE), `${JSON.stringify(next, null, 2)}\n`);

  console.log(`\nSetup -> ${root}`);
  console.log(`  ${copied} copied, ${kept} kept, template v${next.version}\n`);
  if (rows.length) table(rows);
  console.log('\nNext (the only work that needs judgement):');
  console.log('  1. AGENTS.md        fill every <!-- FILL:... --> and <PLACEHOLDER>');
  console.log('  2. .agents/project.md   confirm the detected commands, add domain notes');
  console.log('  3. docs/            ARCH_MAP, ENTRY_POINTS, API_SKELETON from the real tree');
  console.log('  4. AGENTS.md rule 1-4   the constraints that are true only in this repo');
  console.log('\nThen: agent-kit doctor --strict   (must exit 0 before you call setup done)\n');
  return 0;
}

// ---------------------------------------------------------------- sync

function computeSync(targetRoot, sourceRoot) {
  const manifest = manifestOf(sourceRoot);
  if (!manifest) die(`no ${MANIFEST} in ${sourceRoot}`);
  const state = json(abs(targetRoot, STATE), {}) || { machinery: {}, seeds: {} };
  const rows = [];

  for (const entry of manifest.machinery) {
    for (const rel of expand(sourceRoot, entry)) {
      const src = hashFile(abs(sourceRoot, rel));
      const tgt = hashFile(abs(targetRoot, rel));
      const base = state.machinery?.[rel];
      let status;
      if (tgt === null) status = 'MISSING';
      else if (tgt === src) status = 'CURRENT';
      else if (base && tgt === base) status = 'UPGRADE';
      else status = 'DRIFT';
      rows.push({ status, rel, src, tgt, base, entry });
    }
  }

  for (const [dest, seed] of Object.entries(manifest.seeds)) {
    const srcSeed = hashFile(abs(sourceRoot, seed));
    const tgt = hashFile(abs(targetRoot, dest));
    const base = state.seeds?.[dest];
    let status;
    if (tgt === null) status = 'MISSING';
    else if (srcSeed && base && srcSeed !== base) status = 'SEED-UPDATED';
    else status = 'CURRENT';
    rows.push({ status, rel: dest, seed, src: srcSeed, tgt, base });
  }

  for (const rel of manifest.prune) {
    if (exists(abs(targetRoot, rel))) rows.push({ status: 'PRUNE', rel });
  }

  const version = manifest.version || 1;
  const mine = state.version || 0;
  rows.push({
    status: mine === version ? 'CURRENT' : mine > version ? 'AHEAD' : 'BEHIND',
    rel: 'template version',
    detail: `installed v${mine}, template v${version}`,
  });

  return { manifest, state, rows };
}

function cmdCheck({ target, sourceRoot }) {
  const root = path.resolve(target || process.cwd());
  if (!sourceRoot) {
    console.log('Not set up: no .agents/template.json source recorded. Run "agent-kit setup . --source <path|url>".');
    return 0;
  }
  if (root === path.resolve(sourceRoot)) {
    console.log('This is the template itself: nothing to compare.');
    return 0;
  }
  const { rows } = computeSync(root, sourceRoot);
  console.log(`\nDrift check: ${root}`);
  table(rows.map((r) => [r.status, r.rel, r.detail || '']));
  const bad = rows.filter((r) => !['CURRENT'].includes(r.status));
  console.log(
    bad.length === 0
      ? '\nIN SYNC\n'
      : `\n${bad.length} item(s) need attention. Run "agent-kit pull" (never writes over DRIFT without --force).\n`
  );
  return bad.length === 0 ? 0 : 1;
}

function cmdPull({ target, sourceRoot, force, seeds }) {
  const root = path.resolve(target || process.cwd());
  if (!sourceRoot) die('not set up: no provenance in .agents/template.json. Run setup --source <path|url> first.');
  const { manifest, state, rows } = computeSync(root, sourceRoot);
  if (rows.some((r) => r.status === 'AHEAD')) die('installed version is ahead of the template; refusing to rewind (reconcile by hand)');

  const applied = [];
  for (const r of rows) {
    if (r.status === 'DRIFT' && !force) continue;
    if (r.status === 'UPGRADE' || (r.status === 'DRIFT' && force) || r.status === 'MISSING') {
      if (r.rel === 'template version') continue;
      copy(abs(sourceRoot, r.seed || r.rel), abs(root, r.rel));
      applied.push(['WROTE', r.rel, '']);
      continue;
    }
    if (r.status === 'PRUNE') {
      fs.rmSync(abs(root, r.rel), { recursive: true, force: true });
      applied.push(['PRUNED', r.rel, '']);
      continue;
    }
    if (r.status === 'SEED-UPDATED' && seeds) {
      copy(abs(sourceRoot, r.seed), abs(root, r.rel));
      applied.push(['REPLACED SEED', r.rel, 'your authored copy was overwritten (--seeds)']);
    }
  }

  const next = {
    role: 'target',
    source: state.source || sourceRoot,
    version: manifest.version || 1,
    installed_at: state.installed_at || new Date().toISOString().slice(0, 10),
    last_pull: new Date().toISOString().slice(0, 10),
    machinery: {},
    seeds: {},
  };
  for (const entry of manifest.machinery) {
    for (const rel of expand(sourceRoot, entry)) {
      const h = hashFile(abs(root, rel));
      if (h) next.machinery[rel] = h;
    }
  }
  for (const [dest, seed] of Object.entries(manifest.seeds)) {
    const h = hashFile(abs(sourceRoot, seed));
    if (h) next.seeds[dest] = h;
  }
  write(abs(root, STATE), `${JSON.stringify(next, null, 2)}\n`);

  console.log(`\nPull v${next.version}: ${applied.length} change(s)`);
  if (applied.length) table(applied);
  const skipped = rows.filter((r) => r.status === 'DRIFT' && !force);
  if (skipped.length) {
    console.log('\nLeft alone (locally modified, use --force to overwrite):');
    for (const r of skipped) console.log(`  ${r.rel}`);
  }
  const seedDrift = rows.filter((r) => r.status === 'SEED-UPDATED' && !seeds);
  if (seedDrift.length) {
    console.log('\nUpstream seed changed since install (your copy was kept):');
    for (const r of seedDrift) console.log(`  ${r.rel}  <- ${r.seed}`);
  }
  console.log('');
  return cmdDoctor({ root, strict: false });
}

// ---------------------------------------------------------------- doctor

function cmdDoctor({ root, strict }) {
  const base = path.resolve(root || process.cwd());
  const state = json(abs(base, STATE), {});
  const isTemplate = state.role === 'template';
  const rows = [];
  const add = (status, name, detail = '') => rows.push([status, name, detail]);

  const required = ['AGENTS.md', 'CLAUDE.md', MANIFEST, TASK_INDEX, CHANGELOG, 'docs/INDEX.md', 'scripts/agent-kit.mjs'];
  if (!isTemplate) required.push(PROJECT, STATE);
  const missing = required.filter((r) => !exists(abs(base, r)));
  add(missing.length ? 'FAIL' : 'PASS', 'required files', missing.join(', '));

  if (!isTemplate) {
    const manifest = manifestOf(base) || { owned: [], machinery: [], seeds: {} };
    const conflict = manifest.owned.filter(
      (o) =>
        manifest.machinery.some((m) => path.extname(m) === '' && (normGlob(o) === normGlob(m) || normGlob(o).startsWith(`${normGlob(m)}/`))) ||
        Object.keys(manifest.seeds).includes(o)
    );
    add(conflict.length ? 'FAIL' : 'PASS', 'manifest integrity', conflict.join(', '));
    if (!state.source) add('WARN', 'provenance', 'no .agents/template.json source recorded');
  }

  // 1. encoding
  const badEncoding = [];
  for (const dir of ['.agents', 'docs', 'scripts', '.github']) {
    for (const rel of expand(base, dir)) {
      if (!TEXT_EXT.has(path.extname(rel))) continue;
      const p = abs(base, rel);
      const buf = fs.readFileSync(p);
      if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) badEncoding.push(`${rel} (BOM)`);
      try {
        const s = new TextDecoder('utf-8', { fatal: true }).decode(buf);
        // Built from escapes so this line cannot match itself.
        if (MOJIBAKE.test(s)) badEncoding.push(`${rel} (mojibake)`);
      } catch {
        badEncoding.push(`${rel} (not UTF-8)`);
      }
    }
  }
  add(badEncoding.length ? 'FAIL' : 'PASS', 'encoding', badEncoding.slice(0, 5).join(', '));

  // 2. placeholders (seeds legitimately carry them)
  const unfilled = [];
  const scanned = ['AGENTS.md', 'docs', '.agents'].flatMap((e) => expand(base, e)).filter((rel) => {
    if (!rel.endsWith('.md')) return false;
    if (rel.startsWith('.agents/templates/')) return false;
    if (rel.startsWith('.agents/tasks/archive/')) return false;
    if (rel.startsWith('.agents/tasks/active/')) return false;
    return true;
  });
  for (const rel of scanned) {
    const text = fenceFree(read(abs(base, rel)));
    const fills = (text.match(/<!--\s*FILL:[\s\S]*?-->/g) || []).length;
    const placeholders = (text.match(/<[A-Z][A-Z0-9 _-]{1,30}>/g) || []).length;
    if (fills + placeholders > 0) unfilled.push(`${rel} (${fills + placeholders})`);
  }
  if (isTemplate) {
    // This repo's docs ARE the seeds: markers here are the content, not a debt.
    add('PASS', 'unfilled markers', 'n/a: template docs are seeds and carry the markers on purpose');
  } else {
    add(unfilled.length ? (strict ? 'FAIL' : 'WARN') : 'PASS', 'unfilled markers', unfilled.slice(0, 6).join(', '));
  }

  // 3. every path an index or doc names must exist
  const dangling = [];
  for (const rel of scanned) {
    const text = fenceFree(read(abs(base, rel)));
    const re = /\b((?:\.agents|docs|scripts|src|app|lib|tests?|packages|infra)\/[A-Za-z0-9_\-./[\]]+)/g;
    for (const m of text.matchAll(re)) {
      let ref = m[1].replace(/[.,;:)]+$/, '');
      if (!ref || /[*{}<>$]/.test(ref) || ref.endsWith('/') || ref.includes('..')) continue;
      if (!exists(abs(base, ref))) dangling.push(`${rel} -> ${ref}`);
    }
  }
  add(dangling.length ? 'FAIL' : 'PASS', 'doc paths resolve', [...new Set(dangling)].slice(0, 6).join(', '));

  // 3b. every markdown link resolves (index rot)
  const brokenLinks = [];
  for (const rel of scanned) {
    const text = fenceFree(read(abs(base, rel)));
    for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|#)/.test(href) || /[<>*{}]/.test(href)) continue;
      const target = href.split('#')[0];
      if (!target) continue;
      const fromFile = path.resolve(path.dirname(abs(base, rel)), target);
      if (!exists(fromFile) && !exists(abs(base, target))) brokenLinks.push(`${rel} -> ${href}`);
    }
  }
  add(brokenLinks.length ? 'FAIL' : 'PASS', 'markdown links resolve', [...new Set(brokenLinks)].slice(0, 6).join(', '));

  // 4. declared commands exist
  const cmdProblems = [];
  for (const [action, command] of sectionRows(readIf(abs(base, PROJECT)) || '')) {
    const m = command.match(/\brun\s+([\w:.-]+)/);
    if (m) {
      const pkg = json(abs(base, 'package.json'));
      if (!pkg) cmdProblems.push(`${action}: no package.json for "${command}"`);
      else if (!pkg.scripts?.[m[1]]) cmdProblems.push(`${action}: script "${m[1]}" not in package.json`);
    }
  }
  add(cmdProblems.length ? 'FAIL' : 'PASS', 'declared commands', cmdProblems.join(', '));

  // 5. task hygiene
  const activeDir = abs(base, `${TASKS}/active`);
  const active = exists(activeDir) ? fs.readdirSync(activeDir).filter((f) => f.endsWith('.md')) : [];
  const index = readIf(abs(base, TASK_INDEX)) || '';
  const unindexed = active.filter((f) => {
    const id = frontMatter(read(abs(activeDir, f))).id;
    return !id || !index.includes(id);
  });
  add(unindexed.length ? 'FAIL' : 'PASS', 'active tasks indexed', unindexed.join(', '));

  const collisions = [];
  const touches = active.map((f) => ({ f, t: list(frontMatter(read(abs(activeDir, f))).touches) }));
  for (let i = 0; i < touches.length; i++) {
    for (let j = i + 1; j < touches.length; j++) {
      for (const a of touches[i].t) for (const b of touches[j].t) if (covers(a, b) || covers(b, a) || overlaps(a, b)) collisions.push(`${touches[i].f} <> ${touches[j].f}`);
    }
  }
  add(collisions.length ? 'FAIL' : 'PASS', 'write-set collisions', [...new Set(collisions)].join(', '));

  const unknown = active
    .map((f) => ({ f, s: frontMatter(read(abs(activeDir, f))).status }))
    .filter(({ s }) => !['QUEUED', 'IN_PROGRESS', 'BLOCKED', 'REVIEW', 'DONE'].includes(s));
  add(unknown.length ? 'WARN' : 'PASS', 'task statuses', unknown.map((u) => `${u.f} (${u.s || 'missing'})`).join(', '));

  // 6. learnings cap
  const learn = readIf(abs(base, '.agents/rules/learnings.md'));
  if (learn !== null) {
    const n = learn.split(/\r?\n/).filter((l) => l.trim().startsWith('-')).length;
    add(n > 30 ? 'WARN' : 'PASS', 'learnings size', `${n} entries (cap 30)`);
  }

  // 7. changelog shape
  const log = readIf(abs(base, CHANGELOG));
  if (log !== null) {
    const bad = log
      .split(/\r?\n/)
      .filter((l) => l.startsWith('- '))
      .filter((l) => !/^- \*\*\d{4}-\d{2}-\d{2}\*\*/.test(l));
    add(bad.length ? 'WARN' : 'PASS', 'changelog lines', bad.slice(0, 3).join(' | '));
  }

  console.log(`\nDoctor${strict ? ' (strict)' : ''}: ${base}`);
  table(rows);
  const fails = rows.filter((r) => r[0] === 'FAIL').length;
  const warns = rows.filter((r) => r[0] === 'WARN').length;
  console.log(`\n${fails === 0 ? 'PASS' : 'FAIL'} — ${fails} failure(s), ${warns} warning(s)\n`);
  return fails === 0 ? 0 : 1;
}

// ---------------------------------------------------------------- verify

function cmdVerify({ root }) {
  const base = path.resolve(root || process.cwd());
  const declared = sectionRows(readIf(abs(base, PROJECT)) || '');
  const runnable = declared.filter(([a]) => ['build', 'typecheck', 'lint', 'test'].includes(a));
  if (runnable.length === 0) {
    console.log('SKIPPED — no build/typecheck/lint/test command declared in .agents/project.md');
    return 0;
  }
  const evidence = [];
  let failed = 0;
  for (const [action, command] of runnable) {
    console.log(`\n> ${action}: ${command}`);
    const r = run(command, base);
    const tail = r.out.trim().split(/\r?\n/).slice(-4).join('\n');
    if (tail) console.log(tail);
    const ok = r.code === 0;
    if (!ok) failed++;
    evidence.push(`| ${action} | \`${command}\` | exit 0 | exit ${r.code} | ${r.code} |`);
  }

  const activeDir = abs(base, `${TASKS}/active`);
  const active = exists(activeDir) ? fs.readdirSync(activeDir).filter((f) => f.endsWith('.md')) : [];
  if (active.length === 1) {
    const file = abs(activeDir, active[0]);
    const body = ['| Action | Command | Expected | Observed | Exit |', '|---|---|---|---|---|', ...evidence].join('\n');
    write(file, block(read(file), 'EVIDENCE', body));
    console.log(`\nRecorded in ${TASKS}/active/${active[0]}`);
  } else if (active.length > 1) {
    console.log('\nNot recorded: more than one active task. Paste the rows into the right one.');
  }

  console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'} — ${evidence.length - failed}/${evidence.length} command(s) exited 0\n`);
  return failed === 0 ? 0 : 1;
}

// ---------------------------------------------------------------- tasks

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'task';
}

function nextId(root) {
  const p = abs(root, `${TASKS}/.counter`);
  const n = exists(p) ? parseInt(read(p).trim(), 10) || 100 : 100;
  write(p, `${n + 1}\n`);
  return n + 1;
}

function cmdTaskNew({ root, slug, lane, force }) {
  const base = path.resolve(root || process.cwd());
  if (!slug) die('usage: task new <slug> [--lane quick|planned]');
  const activeDir = abs(base, `${TASKS}/active`);
  const active = exists(activeDir) ? fs.readdirSync(activeDir).filter((f) => f.endsWith('.md')) : [];
  if (active.length && !force) die(`a task is already active (${active[0]}). Close it, or pass --force.`);
  if (!exists(abs(base, TASK_TEMPLATE))) die(`missing ${TASK_TEMPLATE}`);

  const today = new Date().toISOString().slice(0, 10);
  const id = `TASK-${nextId(base)}`;
  const file = `${today}-${id}-${slugify(slug)}.md`;
  const baseline = git(base, ['rev-parse', 'HEAD']) || 'none';
  const body = read(abs(base, TASK_TEMPLATE))
    .replaceAll('{{ID}}', id)
    .replaceAll('{{DATE}}', today)
    .replaceAll('{{LANE}}', (lane || 'planned').toUpperCase())
    .replaceAll('{{TITLE}}', slug.replace(/-/g, ' '))
    .replaceAll('{{BASELINE}}', baseline);
  write(abs(activeDir, file), body);

  const index = read(abs(base, TASK_INDEX));
  write(abs(base, TASK_INDEX), block(index, 'ACTIVE', `- \`${id}\` [IN_PROGRESS] ${(lane || 'planned').toUpperCase()} — [${file}](active/${file})`));

  console.log(`\nOpened ${id} -> ${TASKS}/active/${file}`);
  console.log('Fill: touches, scope, plan. PLANNED halts for approval before the first edit.\n');
  return 0;
}

function currentTask(root, id) {
  const dir = abs(root, `${TASKS}/active`);
  const files = exists(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
  const hit = id ? files.filter((f) => f.includes(id)) : files;
  if (hit.length !== 1) die(hit.length === 0 ? 'no active task' : `ambiguous: ${hit.join(', ')}; pass --id`);
  return hit[0];
}

function cmdTaskClose({ root, id }) {
  const base = path.resolve(root || process.cwd());
  const file = currentTask(base, id);
  const rel = `${TASKS}/active/${file}`;
  let text = read(abs(base, rel));
  const fm = frontMatter(text);
  const today = new Date().toISOString().slice(0, 10);
  const problems = [];

  if (!fm.summary) problems.push('front-matter summary is empty (it becomes the changelog line)');
  const touches = list(fm.touches);
  if (touches.length === 0) problems.push('front-matter touches is empty (declare the write set)');
  if (/<!--\s*FILL:/.test(text)) problems.push('unfilled <!-- FILL: --> marker left in the task file');

  // Mechanical inventory: what actually changed, never what the session remembers.
  let changed = [];
  if (fm.baseline && fm.baseline !== 'none' && git(base, ['rev-parse', 'HEAD'])) {
    const diff = git(base, ['diff', '--name-only', `${fm.baseline}..HEAD`]) || '';
    const dirty = (git(base, ['status', '--porcelain']) || '')
      .split(/\r?\n/)
      .map((l) => l.slice(3).trim().split(' -> ').pop())
      .filter(Boolean);
    changed = [...new Set([...diff.split(/\r?\n/), ...dirty].filter(Boolean))];
  } else {
    problems.push('no git baseline recorded; the changed-file inventory cannot be derived');
  }
  // Inventory is product files only: the kit's own bookkeeping (task file, index, counter,
  // changelog) is written by these commands, so counting it would flag every close as a breach.
  changed = changed.filter(
    (c) => c !== rel && !c.startsWith(`${TASKS}/`) && !c.startsWith(`${LOG_DIR}/`)
  );

  const outOfScope = touches.length ? changed.filter((c) => !touches.some((t) => covers(t, c))) : [];
  if (outOfScope.length) problems.push(`scope breach — not covered by touches: ${outOfScope.join(', ')}`);

  if (problems.length) {
    console.error(`\nCannot close ${file}:`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error('');
    return 1;
  }

  text = block(text, 'FILES', changed.length ? changed.map((c) => `- \`${c}\``).join('\n') : '- none detected');
  text = text.replace(/^status:.*$/m, 'status: DONE');

  const month = today.slice(0, 7);
  const archive = `${TASKS}/archive/${month}`;
  fs.mkdirSync(abs(base, archive), { recursive: true });
  write(abs(base, `${archive}/${file}`), text);
  fs.rmSync(abs(base, rel));

  const line = `- **${today}** — \`${fm.id}\` — ${fm.summary} — [plan](../tasks/archive/${month}/${file})`;
  const log = readIf(abs(base, CHANGELOG)) || '# Agent Changelog\n\n## Index\n';
  write(abs(base, CHANGELOG), `${log.replace(/\s*$/, '')}\n${line}\n`);

  let index = read(abs(base, TASK_INDEX));
  index = block(index, 'ACTIVE', '_Nothing in flight._');
  const row = `| ${today} | \`${fm.id}\` | ${fm.lane || 'PLANNED'} | ${fm.summary} | [${file}](archive/${month}/${file}) |`;
  const recent = index.match(/<!-- RECENT:START -->([\s\S]*?)<!-- RECENT:END -->/);
  const existing = recent ? recent[1].split(/\r?\n/).filter((l) => l.trim().startsWith('|')) : [];
  const kept = existing.filter((l) => l.trim() !== row).slice(0, 4);
  index = block(index, 'RECENT', [row, ...kept].join('\n'));
  write(abs(base, TASK_INDEX), index);

  console.log(`\nClosed ${fm.id}`);
  console.log(`  archived  ${archive}/${file}`);
  console.log(`  inventory ${changed.length} file(s)`);
  console.log(`  changelog ${CHANGELOG}\n`);
  return 0;
}

// ---------------------------------------------------------------- selftest

function cmdSelftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-kit-test-'));
  let junkDir = null;
  const failures = [];
  const assert = (ok, label) => {
    if (!ok) failures.push(label);
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${label}`);
  };
  const quiet = (fn) => {
    const log = console.log;
    const err = console.error;
    console.log = () => {};
    console.error = () => {};
    try {
      return fn();
    } finally {
      console.log = log;
      console.error = err;
    }
  };

  try {
    write(abs(tmp, 'package.json'), JSON.stringify({ name: 'fixture', scripts: { build: 'node -e ""', test: 'node -e ""' } }, null, 2));
    write(abs(tmp, 'src/index.ts'), 'export const x = 1;\n');

    console.log('\n1. setup');
    assert(quiet(() => cmdSetup({ target: tmp, sourceRoot: SCRIPT_ROOT, sourceSpec: SCRIPT_ROOT })) === 0, 'setup exits 0');
    assert(exists(abs(tmp, PROJECT)), 'project.md generated');
    assert(read(abs(tmp, PROJECT)).includes('npm run build'), 'detected build command');
    assert(exists(abs(tmp, '.agents/template.json')), 'provenance recorded');

    console.log('\n2. doctor fails before the fill work');
    assert(quiet(() => cmdDoctor({ root: tmp, strict: true })) === 1, 'doctor --strict exits 1 on unfilled markers');

    console.log('\n3. fill, then doctor passes');
    for (const rel of ['AGENTS.md', PROJECT, 'docs/INDEX.md', 'docs/ARCH_MAP.md', 'docs/API_SKELETON.md', 'docs/ENTRY_POINTS.md', '.agents/tasks/INDEX.md']) {
      const p = abs(tmp, rel);
      if (!exists(p)) continue;
      write(p, read(p).replace(/<!--\s*FILL:[\s\S]*?-->/g, 'Filled by selftest.').replace(/<[A-Z][A-Z0-9 _-]{1,30}>/g, 'fixture'));
    }
    assert(quiet(() => cmdDoctor({ root: tmp, strict: true })) === 0, 'doctor --strict exits 0 after the fill');

    console.log('\n4. drift is detected and refused');
    fs.appendFileSync(abs(tmp, 'scripts/agent-kit.mjs'), '\n// local edit\n');
    assert(quiet(() => cmdCheck({ target: tmp, sourceRoot: SCRIPT_ROOT })) === 1, 'check exits 1 on DRIFT');

    console.log('\n5. pull --force repairs it');
    quiet(() => cmdPull({ target: tmp, sourceRoot: SCRIPT_ROOT, force: true }));
    assert(quiet(() => cmdCheck({ target: tmp, sourceRoot: SCRIPT_ROOT })) === 0, 'check exits 0 after pull --force');

    console.log('\n6. the scope guard bites');
    const gitOk = git(tmp, ['init']) !== null;
    if (gitOk) {
      write(abs(tmp, '.gitignore'), 'node_modules/\n');
      git(tmp, ['add', '-A']);
      git(tmp, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-m', 'init']);
    }
    assert(quiet(() => cmdTaskNew({ root: tmp, slug: 'scoped-change', lane: 'quick' })) === 0, 'task new exits 0');
    const activeDir = abs(tmp, `${TASKS}/active`);
    const taskFile = fs.readdirSync(activeDir).find((f) => f.endsWith('.md'));
    let task = read(abs(activeDir, taskFile));
    task = task
      .replace(/touches: \[\]/, 'touches: ["src/index.ts"]')
      .replace(/summary: ""/, 'summary: "fixture change"')
      .replace(/<!--\s*FILL:[\s\S]*?-->/g, 'filled by selftest');
    write(abs(activeDir, taskFile), task);
    write(abs(tmp, 'src/index.ts'), 'export const x = 2;\n');
    write(abs(tmp, 'src/other.ts'), 'export const y = 1;\n');
    assert(quiet(() => cmdTaskClose({ root: tmp })) === 1, 'task close exits 1 on an out-of-scope file');

    console.log('\n7. in-scope close records evidence and archives');
    fs.rmSync(abs(tmp, 'src/other.ts'));
    const before = quiet(() => cmdTaskClose({ root: tmp }));
    assert(before === 0, 'task close exits 0 when the write set holds');
    assert(exists(abs(tmp, `${TASKS}/archive`)) && fs.readdirSync(abs(tmp, `${TASKS}/archive`)).length > 0, 'task archived');
    assert(fs.readFileSync(abs(tmp, CHANGELOG), 'utf8').includes('fixture change'), 'changelog line appended');
    assert(fs.readFileSync(abs(tmp, TASK_INDEX), 'utf8').includes('TASK-101'), 'recent row indexed');
    const archived = walk(abs(tmp, `${TASKS}/archive`)).map((f) => read(abs(tmp, `${TASKS}/archive/${f}`)))[0] || '';
    assert(archived.includes('`src/index.ts`'), 'inventory lists the changed file');
    assert(!archived.includes('`.agents/tasks/'), 'inventory excludes the kit bookkeeping');

    console.log('\n8. a manual copy can adopt itself in place');
    junkDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-kit-copy-'));
    fs.cpSync(SCRIPT_ROOT, junkDir, { recursive: true });
    assert(quiet(() => cmdSetup({ target: junkDir, sourceRoot: junkDir, sourceSpec: junkDir })) === 0, 'setup exits 0 on a self-copy');
    const selfState = JSON.parse(read(abs(junkDir, '.agents/template.json')));
    assert(selfState.role === 'target' && selfState.source === '', 'self-copy becomes a target with no upstream');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
    if (junkDir) fs.rmSync(junkDir, { recursive: true, force: true });
  }

  console.log(failures.length ? `\nSELFTEST FAILED (${failures.length})\n` : '\nSELFTEST PASSED\n');
  return failures.length ? 1 : 0;
}

// ---------------------------------------------------------------- main

function main(argv) {
  const args = argv.slice(2);
  const cmd = args[0];
  const flag = (name) => args.includes(`--${name}`);
  const value = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const positional = args.slice(1).filter((a, i, all) => !a.startsWith('--') && !(all[i - 1] || '').startsWith('--'));

  switch (cmd) {
    case 'setup': {
      const target = path.resolve(positional[0] || process.cwd());
      const src = sourceFor(target, value('source')) || { root: SCRIPT_ROOT, spec: SCRIPT_ROOT };
      return cmdSetup({ target, sourceRoot: src.root, sourceSpec: src.spec });
    }
    case 'check': {
      const target = path.resolve(process.cwd());
      const src = sourceFor(target, value('source'));
      return cmdCheck({ target, sourceRoot: src ? src.root : null });
    }
    case 'pull': {
      const target = path.resolve(process.cwd());
      const src = sourceFor(target, value('source'));
      return cmdPull({ target, sourceRoot: src ? src.root : null, force: flag('force'), seeds: flag('seeds') });
    }
    case 'doctor':
      return cmdDoctor({ root: process.cwd(), strict: flag('strict') });
    case 'verify':
      return cmdVerify({ root: process.cwd() });
    case 'task': {
      const sub = args[1];
      if (sub === 'new') return cmdTaskNew({ root: process.cwd(), slug: args[2], lane: value('lane'), force: flag('force') });
      if (sub === 'close') return cmdTaskClose({ root: process.cwd(), id: value('id') });
      return die('usage: task new <slug> | task close [--id TASK-N]');
    }
    case 'selftest':
      return cmdSelftest();
    case 'help':
    case undefined:
      console.log(read(path.join(SCRIPT_ROOT, 'scripts/agent-kit.mjs')).split('\n').slice(1, 24).join('\n'));
      return 0;
    default:
      return die(`unknown command: ${cmd} (setup|check|pull|doctor|verify|task|selftest)`);
  }
}

process.exitCode = main(process.argv);
