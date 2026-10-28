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

Ask the owner; install only what comes back yes. The skills, the gaps they close, the opt-in
`agent-browser`, and the harness list are in [setup/3-skills.md](setup/3-skills.md).

## 4. Verify

`doctor --strict` must exit 0 after the fill. The full check table, including the markdown
ceiling, is in [setup/4-verify.md](setup/4-verify.md).

## 5. First verification baseline

`task new` records the baseline; command tiers, issue minting, the queue, commits and hooks are
in [setup/5-baseline.md](setup/5-baseline.md).

## 6. Report

The report lines and the re-run/upgrade path are in
[setup/6-report.md](setup/6-report.md).

## Re-running

See [setup/6-report.md](setup/6-report.md#re-running).

## What is deliberately checked in

`tasks/active/` and the archive are committed; see
[setup/6-report.md](setup/6-report.md#what-is-deliberately-checked-in).
