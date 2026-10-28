# Setup Contract

The one-time install that turns a repository into an agent-ready workspace. Idempotent:
running it twice changes nothing that already exists. Every step names its expected output,
because "the agent said it was done" is not a result.

## 0. Fetch the template

```bash
git clone --depth 1 https://github.com/AbdulWadudh/agent-kit "$TMPDIR/agent-kit"
```

No git? Download the archive and unpack it. The only requirement is that
`.agent-kit/agent-kit.mjs` and `.agent-kit/sync-manifest.json` are reachable.

No git and no archive? Copy `.agent-kit/` into the target and run
`bun .agent-kit/agent-kit.mjs setup . --source .` from the target root. The script adopts the
repo in place: it records the hash baseline of what is already there and clears `source`, so
`check` and `pull` report "not set up" until you install from a real source. That path loses
history, not correctness.

## 1. Scaffold

From the **target repo root**:

```bash
bun "$TMPDIR/agent-kit/.agent-kit/agent-kit.mjs" setup . --source https://github.com/AbdulWadudh/agent-kit --ref v1.0.0 --ids local
```

`--ref` is the release you install: `setup` clones exactly that tag. Omit it and you get the
newest release tag, never the branch tip. `git ls-remote --tags https://github.com/AbdulWadudh/agent-kit`
lists what you can choose from.

`--ids local|issue` picks where task ids come from — offline here, or GitHub's issue numbers.
It defaults to `local` and is asked in the README prompt; §1.1 below says which one to pick.
Re-running `setup --ids` with a different value is refused while any task is open.

Fallback if Bun is absent: `node` instead of `bun`. Same file, same behaviour.

What it does, in order:

1. Checks the prerequisites — runtime, git, `rtk`, and in issue mode the GitHub credential —
   and refuses to copy anything while one is missing (§1.2).
2. Resolves the id mode and, in issue mode, validates the credential once against the repo
   (`GET /repos/{owner}/{repo}`, which also reports `has_issues`).
3. Reads the target's manifests and writes `.agent-kit/project.md` — languages, package manager,
   `install`/`build`/`typecheck`/`lint`/`test`, entry points, generated directories, and the
   `## Tasks` section carrying `| ids | … |`.
4. Copies the machinery (the entry point and its modules, the manifest, the directory indexes,
   the seeds, the rule router, the prompts).
5. Copies each seed to its authored path **only if the path is absent**.
6. Installs `rtk` (the token saver) when it is missing. `--no-rtk` skips the install, but the
   gate still runs: setup exits 1, because `rtk` is a prerequisite (§1.2).
7. Detects the coding agents installed on this machine — HOME config folders, `PATH`, and repo
   markers — and prints `Harnesses found: ...`. A repo with no harness config can still be
   driven by several agents; the machine is the source. Where the repo already keeps a harness's
   folder (`.claude/`, `.opencode/`), it writes that harness's skill pointer, and prints
   `Skill pointer: <path>`; the rest are left in a `Wire the skill for each:` line.
8. Writes `.agent-kit/template.json`: source, the release tag it installed (`ref`, `release`,
   `commit`), the manifest version, the date, and a hash baseline per file.
9. Prints the fill list.

Expected output: `N copied, M kept, template v1, ids: local`, a per-file table including
`PRESENT` or `INSTALLED` for `rtk`, a `Harnesses found:` line (with `Skill pointer:` and `Wire
the skill for each:` where they apply), then the fill steps. Exit code 0 is the only "installed".

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
- `--no-rtk` skips the automatic install only. It is not a way to run without `rtk`: setup still
  exits 1 and `doctor`'s `prerequisites` row still fails until `rtk gain` answers.

### 1.1 Task ids — one allocator per repo

Ask the owner one question before the scaffold command, because the mode is recorded at setup:

> Are the tasks shared with other people? If yes, and this repo is on GitHub, I can take the
> task id from the issue number, so everyone sees the same board. If not, ids stay local and
> nothing ever touches the network.

| Mode | Id comes from | Network |
|---|---|---|
| `local` (default) | `1 + max(TASK-N)` over `tasks/active/`, `tasks/archive/` and the change cards in `logs/`, floor `TASK-100` | never |
| `issue` | the GitHub issue number — `task new` mints the issue and takes its `number` | only at mint, publish and close |

`local` is for solo work and for anyone who wants the kit entirely offline: the merge is the
only serialization point, so two branches that both take `TASK-131` collide visibly at merge and
`task renumber TASK-131 TASK-<free>` (or `task renumber TASK-131 --next`) fixes the branch that
lost. `doctor`'s `task ids unique` row is the check. There is no counter file to go stale.

`issue` is for collaborators: the id is the issue number, one identifier everywhere — the file
name, `task show`, the change card, the commit subject, the issue itself. The sync moments are
fixed and few: `task publish` after the plan gate sends the approved plan, `task close --sync`
closes the issue with the final record and comments the change card's path, and `task new
--from <n>` imports an issue a teammate opened instead of minting a second one. Nothing polls,
reverse-syncs or runs on a schedule.

The mode is a row in `project.md` (`| ids | local |`), which is `owned`: `pull` never resets it.
Switching it while a task is open is refused.

A repo that ran on local ids before switching keeps them: the archived ids are history, and a
release note or commit subject already cites them. Run `setup --ids issue` once, then
`task migrate` — it opens one closed issue per archived task, titled `TASK-N — summary` from that
task's change card, and reads the issue list to skip what already exists. Since the issue numbers
start low while the old ids are high, a future mint can reach a number an archived task carries;
`task new` refuses that mint and names both, rather than writing two files under one id.

### 1.2 Prerequisites — mandatory

One list, `prerequisites()` in `.agent-kit/lib/env.mjs`, read by `setup` (refuses to finish)
and by `doctor` (the `prerequisites` row, FAIL). Presence is checked offline; validity is only
proven where it is used — the credential at `setup --ids issue` and at the first `task new` in
issue mode.

| Tool | Needed for | Install / fix |
|---|---|---|
| Node 18+ or Bun | the entry point (built-in `fetch`) | install Node 18+ or Bun |
| git | the baseline at `task new` and the inventory at `task close` | install git |
| `rtk` | the token saver the skill runs shell output through | `winget install --id rtk-ai.rtk -e` / `brew install rtk`; `rtk gain` must answer |
| GitHub access — **issue mode only** | minting, publishing and closing an issue | `gh auth login` (**recommended**), or `GH_TOKEN` with Issues read/write as a fallback |

The credential order is `gh auth token` first, then `GH_TOKEN`, then `GITHUB_TOKEN`. `gh` is
recommended because the token it hands over is already scoped to the account and refreshed by
`gh auth login`; a pasted `GH_TOKEN` should be a fine-grained, repo-scoped token with an expiry.
A token is never printed, logged or written to a file — a failure reports the HTTP status only.
`GITHUB_API_URL` overrides the API base for GitHub Enterprise.

## 2. Fill

This is the only work that needs judgement. Four items, in this order:

| Item | What "filled" means |
|---|---|
| `AGENTS.md` | every `<!-- FILL:... -->` replaced; every `<UPPERCASE PLACEHOLDER>` replaced; rules 1-4 are constraints that are true **only** in this repo |
| `.agent-kit/project.md` | the detected commands are correct; the detection notes are confirmed or deleted; the `ids` row says the mode the owner chose in §1.1 (do not edit it by hand — `setup --ids` writes it); domain notes say what the code cannot |
| `.agent-kit/docs/ARCH_MAP.md`, `.agent-kit/docs/ENTRY_POINTS.md`, `.agent-kit/docs/API_SKELETON.md` | one real row or signature per entry; no invented layer. The full pass is `.agent-kit/prompts/docs-populate.md` |
| `.agent-kit/rules/` | one file per domain this repo actually has, copied from `.agent-kit/templates/rule-examples/` when one matches. `code` (the TypeScript example) earns its file in any TypeScript repo; `config` and `api` only where the repo has tunables or HTTP routes. Simplicity needs no file — it is `_behavior.md` §8, and `_behavior.md` ships with the machinery. No file, no rule: do not install a rule about a language the repo does not use |

`examples/minimal/` in the template shows all four after the fill, for a fictional repo.

**Populating the docs in full.** `.agent-kit/prompts/docs-populate.md` is the pass that fills
these pages from evidence: it inventories the tree with `path:line`, asks three to five
questions only where the code cannot answer, writes an exception comment's reason into
`.agent-kit/rules/learnings.md`, and parks every `TODO` in `.agent-kit/tasks/BACKLOG.md` with a
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
repo and not asked again unprompted. Sources are in the table.

| Skill | Gap the kit's own loop does not close | Source |
|---|---|---|
| ponytail | over-building: the smallest change that works, and the check that proves it | https://github.com/DietrichGebert/ponytail |
| prompt-master | a prompt written for one tool instead of prose the owner can read | https://github.com/nidhinjs/prompt-master |
| caveman | token cost of long sessions | https://github.com/juliusbrussee/caveman |
| anthropic skills | documents, spreadsheets, slides, PDFs, frontend polish | https://github.com/anthropics/skills |

`agent-browser` is **opt-in and asked separately**. It drives a real browser: live sites,
accounts, local pages. Never install it because it looked useful; ask whether this repo needs
an agent that can load and click pages, and take a no. Source:
https://github.com/vercel-labs/agent-browser (skill at https://agent-browser.dev/skills).

Install with the harness's own mechanism (its skill folder, or its plugin command). Leave it
as a pointer, never a copy: `doctor`'s `skill pointers` row fails a copy of an installed
skill, because the first edit to either side would make the two disagree.

### Harnesses — ask the machine

A repo can show no harness files and still be driven by four agents; looking only at the tree
misses them. `setup` ends with `Harnesses found: ...`, and `agent-kit harnesses` prints the
same list with the evidence: known HOME config folders, binaries on `PATH`, and harness
markers in the repo.

Say the list in the report. Wire `.agent-kit/SKILL.md` for each harness with a repo skill folder — the
command prints those paths (Claude Code and OpenCode today). For the rest, the kit's entry
point is `AGENTS.md`; where a harness reads a different file, put the trigger there. A
pointer, never a copy: `doctor`'s `skill pointers` row fails a copy.

The list is a report, not a check. `doctor` cannot see the machine's harnesses, and a repo
with none of them is not broken.

Then say what MCP servers the harness already has, and use those before writing the
equivalent by hand. `doctor` cannot see MCP; that is a report line, not a check.

## 4. Verify

```bash
bun .agent-kit/agent-kit.mjs doctor --strict
```

Expected, before the fill: `FAIL — N failure(s)`, naming `unfilled markers` and any doc path
that does not exist.

Expected, after the fill: `PASS — 0 failure(s)`. Warnings are allowed and are listed; they
are not a reason to keep editing.

| Check | Fails when |
|---|---|
| required files | a kit file is missing (including `.agent-kit/SKILL.md`) |
| directory indexes | a directory under `.agent-kit/` has no `INDEX.md` |
| kit modules covered | a `.mjs` under `.agent-kit/` is not covered by the manifest, so an install would miss it |
| source ceiling | a kit `.mjs` is past 300 lines - split it by area, keeping related functions in one file |
| skill pointers | a harness skill file is a copy of the loop instead of a pointer to `.agent-kit/SKILL.md` |
| context budget | one of the files a session reads before it plans is past its cap (`AGENTS.md` 9000, `SKILL.md` 10000, `_behavior.md` 7500, `rules/INDEX.md` 1800 characters) - move the detail behind an index, or run `.agent-kit/prompts/trim-agents-md.md` |
| prerequisites | a tool every repo needs is missing — runtime, git or `rtk`; in issue mode also the GitHub credential (§1.2). Presence only: the row never calls the network |
| task ids | `project.md` has no `| ids |` row (WARN), or its value is not `local` or `issue` (FAIL) |
| task ids unique | two active or archived task files share an id, an id disagrees with its filename, or two change cards name the same id |
| manifest integrity | an `owned` path is inside a `machinery` directory or is also a seed |
| encoding | a file is not UTF-8, has a BOM, or shows mojibake (`--fix` repairs the mechanical part) |
| unfilled markers | a `FILL` marker or uppercase placeholder survived (`--strict` only) |
| doc paths resolve | a path written in `.agent-kit/docs/`, `.agent-kit/` or the skill does not exist |
| markdown links resolve | an index link points at a missing file |
| declared commands | `project.md` names a package script that `package.json` does not have, or a `When` value is not `always` or `milestone` |
| active tasks indexed | a task file in `active/` is not in the task index |
| write-set collisions | two active tasks declare overlapping `touches` (a main task and its subtasks are one family and may overlap) |
| blocked tasks | a `BLOCKED` task carries no question, or a task carries the block marker without the status |
| subtasks | a subtask has no parent or its parent is not active, a main task is in progress with a subtask open, or a queued main task has every subtask done |
| task queue | a `## Queue` row has an unknown status, a reused `#`, an empty request, or names a subtask that is not this task's active subtask |
| backlog | a row in `.agent-kit/tasks/BACKLOG.md` has an unknown status, a reused ID, a missing cell, or an empty item, source or next step |
| rules are checkable | a rule file contains advice ("be careful", "try to", "consider") instead of a rule |
| rules indexed | a file in `.agent-kit/rules/` has no row in its `INDEX.md`, or a row names a missing file |
| archived tasks changelogged | a task is in `archive/` but has no file under `.agent-kit/logs/MM-YYYY/` |
| release notes | a file under `.agent-kit/releases/` does not start with `# Release vX.Y.Z` matching its filename; no folder is fine |
| release tags | WARN, not FAIL: a release note has no tag, so nothing can install that version (`agent-kit release --tag vX.Y.Z`) |
| commit guard | WARN, not FAIL: the optional `pre-commit` and `commit-msg` hooks are not wired in this clone |
| commit identity | a commit message carries AI attribution (FAIL); a commit author is not the configured identity (WARN) |

`harnesses` is not in this table: it reads the machine, so CI cannot reproduce it. Its output
is a report to the owner, not a gate.

`--json` prints the same rows as `{ ok, fails, warns, rows }` for a CI comment or a gate.

## 5. First verification baseline

`task new` records the baseline itself. The "was it already broken?" run happens at the moment
the task opens, so it cannot be forgotten:

```bash
bun .agent-kit/agent-kit.mjs task new bootstrap --lane quick
```

Expected: the task id, then one line per declared command and `PASS (full) — n/n command(s) exited 0`.
A failure here is the repo's problem, not the kit's: report it, do not work over it.
`--no-baseline` skips the run; it also throws away the only way to tell an old red from a new one.

In `ids: issue` this command also mints the GitHub issue and takes its number as the id; a
refused mint (bad credential, no access, Issues disabled) exits 1 and writes no task file.
`--summary "<one clause>"` is required there — it is the issue title and the card's — and
`--intent "<paragraph>"` is the issue body. `task publish` after the plan gate sends the approved
plan to that issue, and `task close --sync` closes it with the final record. `--from <n>` imports
an issue someone else opened.

The baseline is a **full** run. The `When` cell in `project.md` splits the rows:

- `always` — `verify` and every close run it. Setup marks test, typecheck and lint here.
- `milestone` — only the baseline, `verify --full` and a top-level task's close run it. Setup
  marks build here: a full build is what makes an iteration slow, and it is worth paying for
  once, at the end. A subtask's close is quick, so it does not run the milestone rows.

So the inner loop is `verify` (quick), and the expensive row cannot be skipped at close:
`task close` on a top-level task runs the full suite itself. Move a command between tiers in
`project.md`, not in the kit, and mark the slowest commands `milestone` while filling the file.

A request that arrives while a task is open goes in its `## Queue` and becomes its subtask:
`task new <slug> --parent TASK-N` opens `TASK-N.M` and queues the main task; only a separate
delivery earns a new task, and the owner decides that. A subtask closes on the quick suite, so
test, typecheck and lint run per subtask. The main task's close is where build runs: it refuses
while a subtask is open, runs the full suite, and an error found there is fixed in that moment
and the close re-run. The family then archives under the main id with one change file.

`task show` and `start` say when the quick run is the whole story and when the milestone rows
still wait. `start` is the read-only brief to begin a session with: branch, commands and tiers,
the five newest closes, active tasks, gate, last evidence, and one next action.

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
first task on, every commit names its task: the subject is `type (TASK-ID): summary`, and the
body is what that commit changed and why. A task carries as many commits as it has features and
fixes, grouped by the feature or issue each serves; close writes one change file per task. The
rule, the split and its type list are `.agent-kit/rules/commits.md`.

`setup` does not touch git config. If an agent will commit unattended in this clone and you want
the earlier warning, opt in once:

```bash
git config core.hooksPath .agent-kit/githooks
```

Git silently skips a hook it cannot execute, so both files are tracked as `100755`. Where a clone
lost that bit, `git ls-files -s .agent-kit/githooks` shows `100644` and `doctor`'s `hook mode` row
reports it; `git update-index --chmod=+x` on the two files repairs it.

It is per clone and bypassable (`git commit --no-verify`), so it is a speed bump, not the check.
`pre-commit` refuses a commit outside the write set, which `task close` also checks;
`commit-msg` prints the expected shape for a message that is not `type (TASK-ID): summary` or
carries no body summary, and exits 0 — it warns, never blocks. The message rule is the
session's instruction, not a hook's gate. Skip the hooks if the team would rather not have
them; `doctor` reports them as a WARN with that command, not a failure.

## 6. Report

Tell the owner, in plain words:

- what stack was detected and which commands were found (or which are missing);
- the id mode (`local` or `issue`), and in issue mode the repo and which credential source
  answered — `gh` or a token, never the token itself;
- which harnesses were found, and which of them now point at `.agent-kit/SKILL.md`;
- which files were filled and which placeholders you had to leave and why;
- the `doctor --strict` result;
- the next action: open a task with `agent-kit task new <slug> --lane planned`.

## Re-running

`setup` again: fills in anything missing, keeps everything present, refreshes the hash
baseline. Safe.

Later, to take template improvements: `check` (never writes) names the release tag this repo
tracks, whether a newer tag exists, and any file drift. `pull --dry-run` prints the diff per row,
then `pull --ref <tag>` moves the install. `pull` will not overwrite a file you modified unless
you pass `--force`, and reports `SEED-UPDATED` when an upstream seed changed after you authored
from it. The full procedure is `.agent-kit/prompts/upgrade.md`.

## What is deliberately checked in

`.agent-kit/tasks/active/` is committed. A task in flight is part of the repo's state, and a
future session resumes from it. The archive is committed too — it is the only record of why
a change happened.
