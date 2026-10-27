# Setup Contract

The one-time install that turns a repository into an agent-ready workspace. Idempotent:
running it twice changes nothing that already exists. Every step names its expected output,
because "the agent said it was done" is not a result.

## 0. Fetch the template

```bash
git clone --depth 1 https://github.com/AbdulWadudh/agent-kit "$TMPDIR/agent-kit"
```

No git? Download the archive and unpack it. The only requirement is that
`scripts/agent-kit.mjs` and `.agents/sync-manifest.json` are reachable.

No git and no archive? Copy `scripts/`, `.agents/` and `docs/` into the target and run
`bun scripts/agent-kit.mjs setup . --source .` from the target root. The script adopts the
repo in place: it records the hash baseline of what is already there and clears `source`, so
`check` and `pull` report "not set up" until you install from a real source. That path loses
history, not correctness.

## 1. Scaffold

From the **target repo root**:

```bash
bun "$TMPDIR/agent-kit/scripts/agent-kit.mjs" setup . --source https://github.com/AbdulWadudh/agent-kit
```

Fallback if Bun is absent: `node` instead of `bun`. Same file, same behaviour.

What it does, in order:

1. Reads the target's manifests and writes `.agents/project.md` — languages, package manager,
   `install`/`build`/`typecheck`/`lint`/`test`, entry points, generated directories.
2. Copies the machinery (the script, the workflow, the manifest, the directory indexes, the seeds, the rule router).
3. Copies each seed to its authored path **only if the path is absent**.
4. Installs `rtk` (the token saver) when it is missing, unless `--no-rtk` is passed.
5. Detects the coding agents installed on this machine — HOME config folders, `PATH`, and repo
   markers — and prints `Harnesses found: ...`. A repo with no harness config can still be
   driven by several agents; the machine is the source.
6. Writes `.agents/template.json`: source, version, date, and a hash baseline per file.
7. Prints the fill list.

Expected output: `N copied, M kept, template v1`, a per-file table including `PRESENT` or
`INSTALLED` for `rtk`, a `Harnesses found:` line, then the four fill steps.

Guard rails: it never overwrites an existing file, and it refuses a directory whose
`template.json` says `"role": "template"` unless that directory is also the source (the
manual-copy fallback in §0).

### Token saver — `rtk`

`rtk` filters shell output before the agent reads it: same command, same exit code, less
context spent. It is a machine tool, not a repo dependency, and `setup` patches no harness.
The skill calls it explicitly (`rtk git status`, `rtk npm test`), so nothing changes until a
command asks for it.

- Windows: `winget install --id rtk-ai.rtk -e --accept-source-agreements --accept-package-agreements`
- macOS / Linux: `brew install rtk`, or the official `install.sh` when Homebrew is absent
- Verify: `rtk gain` must print the savings dashboard, not "command not found"
- Wrong package: `rtk --version` working while `rtk gain` fails is the other project named
  `rtk` (Rust Type Kit). `cargo uninstall rtk`, then install `rtk-ai.rtk`.
- Skip: `setup . --no-rtk`. `doctor` reports the gap as a `token saver` warning, not a failure.

## 2. Fill

This is the only work that needs judgement. Four items, in this order:

| Item | What "filled" means |
|---|---|
| `AGENTS.md` | every `<!-- FILL:... -->` replaced; every `<UPPERCASE PLACEHOLDER>` replaced; rules 1-4 are constraints that are true **only** in this repo |
| `.agents/project.md` | the detected commands are correct; the detection notes are confirmed or deleted; domain notes say what the code cannot |
| `docs/ARCH_MAP.md`, `docs/ENTRY_POINTS.md`, `docs/API_SKELETON.md` | one real row or signature per entry; no invented layer. The full pass is `.agents/templates/docs-populate.md` |
| `.agents/rules/` | one file per domain this repo actually has, copied from `.agents/templates/rule-examples/` when one matches. `code` (the TypeScript example) earns its file in any TypeScript repo; `config` and `api` only where the repo has tunables or HTTP routes. Simplicity needs no file — it is `_behavior.md` §8, and `_behavior.md` ships with the machinery. No file, no rule: do not install a rule about a language the repo does not use |

`examples/minimal/` in the template shows all four after the fill, for a fictional repo.

**Populating the docs in full.** `.agents/templates/docs-populate.md` is the pass that fills
these pages from evidence: it inventories the tree with `path:line`, asks three to five
questions only where the code cannot answer, writes an exception comment's reason into
`.agents/rules/learnings.md`, and parks every `TODO` in `.agents/tasks/BACKLOG.md` with a
status. It opens a PLANNED task, so run it after the fill commit in §5 — that commit is the
only one that predates a task.

**Ask, do not invent.** Rules 1-4 and the domain notes are facts only the owner has. Propose two
or three candidates from the tree in the session, get a yes, then write them. An invented rule
is worse than an empty section: the next agent will treat it as true.

Convention: **uppercase** placeholders are obligations. Lowercase `<like-this>` inside prose
is an illustration and is ignored by the checker.

## 3. Skills and MCP

`setup` installs none of these. **Ask the owner; install only what comes back yes.** One
message, in these words or close to them:

> Shall I install the recommended skills — ponytail, prompt-master, caveman and the anthropic
> skills? I have said what each one fixes below. And separately: agent-browser drives a real
> browser, including live sites and accounts, so it is opt-in — install that too, or leave it?

Then read the answer as a list: each yes is installed and reported, each no is dropped for this
repo and not asked again unprompted. Sources for every one of them are in
`.agents/rules/_behavior.md` §12 — one home, so the list cannot drift between files.

| Skill | Gap the kit's own loop does not close |
|---|---|
| ponytail | over-building: the smallest change that works, and the check that proves it |
| prompt-master | a prompt written for one tool instead of prose the owner can read |
| caveman | token cost of long sessions |
| anthropic skills | documents, spreadsheets, slides, PDFs, frontend polish |

`agent-browser` is **opt-in and asked separately**. It drives a real browser: live sites,
accounts, local pages. Never install it because it looked useful; ask whether this repo needs
an agent that can load and click pages, and take a no.

Install with the harness's own mechanism (its skill folder, or its plugin command). Leave it
as a pointer, never a copy: `doctor`'s `skill pointers` row fails a copy of an installed
skill, because the first edit to either side would make the two disagree.

### Harnesses — ask the machine

A repo can show no harness files and still be driven by four agents; looking only at the tree
misses them. `setup` ends with `Harnesses found: ...`, and `agent-kit harnesses` prints the
same list with the evidence: known HOME config folders, binaries on `PATH`, and harness
markers in the repo.

Say the list in the report. Wire `SKILL.md` for each harness with a repo skill folder — the
command prints those paths (Claude Code and OpenCode today). For the rest, the kit's entry
point is `AGENTS.md`; where a harness reads a different file, put the trigger there. A
pointer, never a copy: `doctor`'s `skill pointers` row fails a copy.

The list is a report, not a check. `doctor` cannot see the machine's harnesses, and a repo
with none of them is not broken.

Then say what MCP servers the harness already has, and use those before writing the
equivalent by hand. `doctor` cannot see MCP; that is a report line, not a check.

## 4. Verify

```bash
bun scripts/agent-kit.mjs doctor --strict
```

Expected, before the fill: `FAIL — N failure(s)`, naming `unfilled markers` and any doc path
that does not exist.

Expected, after the fill: `PASS — 0 failure(s)`. Warnings are allowed and are listed; they
are not a reason to keep editing.

| Check | Fails when |
|---|---|
| required files | a kit file is missing (including `SKILL.md`) |
| directory indexes | a directory under `.agents/`, `docs/`, `scripts/` or `.githooks/` has no `INDEX.md` |
| skill pointers | a harness skill file is a copy of the loop instead of a pointer to `SKILL.md` |
| token saver | WARN, not FAIL: `rtk gain` failed, so shell output is not being compressed |
| manifest integrity | an `owned` path is inside a `machinery` directory or is also a seed |
| encoding | a file is not UTF-8, has a BOM, or shows mojibake (`--fix` repairs the mechanical part) |
| unfilled markers | a `FILL` marker or uppercase placeholder survived (`--strict` only) |
| doc paths resolve | a path written in `docs/`, `.agents/` or the skill does not exist |
| markdown links resolve | an index link points at a missing file |
| declared commands | `project.md` names a package script that `package.json` does not have, or a `When` value is not `always` or `milestone` |
| active tasks indexed | a task file in `active/` is not in the task index |
| write-set collisions | two active tasks declare overlapping `touches` (a main task and its subtasks are one family and may overlap) |
| blocked tasks | a `BLOCKED` task carries no question, or a task carries the block marker without the status |
| subtasks | a subtask has no parent or its parent is not active, a main task is in progress with a subtask open, or a queued main task has every subtask done |
| backlog | a row in `.agents/tasks/BACKLOG.md` has an unknown status, a reused ID, a missing cell, or an empty item, source or next step |
| rules are checkable | a rule file contains advice ("be careful", "try to", "consider") instead of a rule |
| rules indexed | a file in `.agents/rules/` has no row in its `INDEX.md`, or a row names a missing file |
| archived tasks changelogged | a task is in `archive/` but has no file under `.agents/logs/MM-YYYY/` |
| recent lists | a task or logs index is missing its `RECENT` block, or the last five entries are stale |
| release notes | a file under `releases/` does not start with `# Release vX.Y.Z` matching its filename; no folder is fine |
| commit guard | WARN, not FAIL: the optional `pre-commit` and `commit-msg` hooks are not wired in this clone |
| commit identity | a commit message carries AI attribution (FAIL); a commit author is not the configured identity (WARN) |

`harnesses` is not in this table: it reads the machine, so CI cannot reproduce it. Its output
is a report to the owner, not a gate.

`--json` prints the same rows as `{ ok, fails, warns, rows }` for a CI comment or a gate.

## 5. First verification baseline

`task new` records the baseline itself. The "was it already broken?" run happens at the moment
the task opens, so it cannot be forgotten:

```bash
bun scripts/agent-kit.mjs task new bootstrap --lane quick
```

Expected: the task id, then one line per declared command and `PASS (full) — n/n command(s) exited 0`.
A failure here is the repo's problem, not the kit's: report it, do not work over it.
`--no-baseline` skips the run; it also throws away the only way to tell an old red from a new one.

The baseline is a **full** run. The `When` cell in `project.md` splits the rows:

- `always` — `verify` and every close run it. Setup marks test, typecheck and lint here.
- `milestone` — only the baseline, `verify --full` and a top-level task's close run it. Setup
  marks build here: a full build is what makes an iteration slow, and it is worth paying for
  once, at the end. A subtask's close is quick, so it does not run the milestone rows.

So the inner loop is `verify` (quick), and the expensive row cannot be skipped at close:
`task close` on a top-level task runs the full suite itself. Move a command between tiers in
`project.md`, not in the kit, and mark the slowest commands `milestone` while filling the file.

A task too large for one sitting splits into subtasks: `task new <slug> --parent TASK-N` opens
`TASK-N.M` and queues the main task. A subtask closes on the quick suite, so test, typecheck
and lint run per subtask. The main task's close is where build runs: it refuses while a
subtask is open, runs the full suite, and an error found there is fixed in that moment and the
close re-run. The family then archives under the main id with one change file and one commit
message.

`task show` and `start` say when the quick run is the whole story and when the milestone rows
still wait. `start` is the read-only brief to begin a session with: branch, commands and tiers,
active tasks, gate, last evidence, and one next action.

`verify` also counts attempts: a red run with the same failing set over the same declared files
is the same attempt repeated. At three, it refuses — and `task close` with it — until the Plan
section changes. `task show` prints `Loop: n/3`.

Commit the fill work **before** opening the first task. `task new` records the current `HEAD`
as the baseline, and `task close` derives the changed-file inventory from it — a repo with no
commit at all has no baseline to diff against.

Commit it as the repo's own identity: never `-c user.name`/`-c user.email`, never the harness
or session name, and never a `Co-Authored-By` or "Generated with" trailer. `doctor`'s
`commit identity` row fails a trailer and warns when the author is not the configured identity.
If git has no identity here, stop and ask — do not invent one.

The fill commit is the one commit that needs no task ID, because no task exists yet. From the
first task on, a commit is one task and one kind of change: the subject is
`type (TASK-ID): summary`, and the body is the change file's `## What changed` paragraph. The
rule and its type list are `.agents/rules/_behavior.md` §10.

`setup` does not touch git config. If an agent will commit unattended in this clone and you want
the earlier warning, opt in once:

```bash
git config core.hooksPath .githooks
```

It is per clone and bypassable (`git commit --no-verify`), so it is a speed bump, not the check.
`pre-commit` refuses a commit outside the write set, which `task close` also checks;
`commit-msg` prints the expected shape for a message that is not `type (TASK-ID): summary` or
carries no body summary, and exits 0 — it warns, never blocks. The message rule is the
session's instruction, not a hook's gate. Skip the hooks if the team would rather not have
them; `doctor` reports them as a WARN with that command, not a failure.

## 6. Report

Tell the owner, in plain words:

- what stack was detected and which commands were found (or which are missing);
- which harnesses were found, and which of them now point at `SKILL.md`;
- which files were filled and which placeholders you had to leave and why;
- the `doctor --strict` result;
- the next action: open a task with `agent-kit task new <slug> --lane planned`.

## Re-running

`setup` again: fills in anything missing, keeps everything present, refreshes the hash
baseline. Safe.

Later, to take template improvements: `check` (never writes), `pull --dry-run` (prints the
diff per row), then `pull`. `pull` will not overwrite a file you modified unless you pass
`--force`, and reports `SEED-UPDATED` when an upstream seed changed after you authored from it.

## What is deliberately checked in

`.agents/tasks/active/` is committed. A task in flight is part of the repo's state, and a
future session resumes from it. The archive is committed too — it is the only record of why
a change happened.
