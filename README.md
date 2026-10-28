# agent-kit

A template that turns any repository into a place where a coding agent can work predictably.

It is one idea: **the work has one home, the gates have evidence, and the setup can be
verified.** Everything here serves that, and anything that stops serving it gets deleted.

## What you get

- `AGENTS.md` — the entry point. Read once, then follow its start-here steps.
- `.agent-kit/project.md` — generated from your manifests: stack, real build/test/lint commands
  with a tier (`always` on every verify, `milestone` at the baseline and close), entry points,
  generated directories. One home, cited by everything else.
- `.agent-kit/tasks/` — one task file per unit of work, with a lane (QUICK or PLANNED), two
  gates, an evidence table that records each run's scope, and a close-out that derives the
  changed files from git. A task can park on an owner question (`task block`) without holding
  the single in-progress slot. A parked candidate lives in `BACKLOG.md` with a status; it is
  not a task until `task new` opens it.
- Task ids — one allocator per repo, chosen at setup. `ids: local` takes the next number on
  disk, entirely offline; `ids: issue` mints a GitHub issue and uses its number, so
  collaborators share one board and there is never a `TASK-131` beside an `#131`. `task new
  --summary "…" --intent "…"` writes the issue's title and body (the title is the card's summary
  too), `task publish` sends the approved plan, `task close --sync` closes the issue with the
  final record, and `task new --from 42` imports an issue someone else opened. A repo that ran
  on local ids first keeps them: `task migrate` opens a closed issue for each archived task,
  titled `TASK-N — summary`, so the history is visible too.
- `.agent-kit/rules/` — a router plus short rule files. One home per rule; indexes cite. Ready-made
  examples for TypeScript, Bun, Biome, API versioning, config and library docs sit in
  `.agent-kit/templates/rule-examples/`; you install only the ones that are true.
- `.agent-kit/docs/` — the knowledge seed: architecture map, API skeleton, entry points, and
  `.agent-kit/prompts/docs-populate.md`, the pass that fills them from `path:line` evidence,
  interviews the gaps, moves exception comments into learnings and TODOs into the backlog.
- `.agent-kit/prompts/` — the long jobs a session runs instead of improvising them: filling the
  docs from evidence, trimming `AGENTS.md` back to its constraints. One file per job, run as a task.
- Indexed directories — every directory the kit owns has an `INDEX.md` saying what lives there,
  why, and when to open it. A session reads one index and one file, never a folder listing, so
  the always-on context stays small. `doctor` fails an unindexed directory.
- `.agent-kit/SKILL.md` — the work loop: classify, open, gate, verify, close, report.
- `rtk` — the token saver: setup installs it when missing, and the skill runs shell output
  through it (`rtk git status`, `rtk npm test`) so the agent reads less of it.
- `agent-kit harnesses` — lists the coding agents installed on the machine (HOME config, PATH,
  repo markers), so a repo with no harness files still gets the skill wired for each one.
- `examples/minimal/` — what a filled repo looks like, for a fictional project.
- `.agent-kit/agent-kit.mjs` — the only entry point; it imports a module or folder per command
  area from `.agent-kit/lib/`. Zero dependencies. Bun or Node.

## Start here

Copy the block below into a fresh agent session **in the repository you want to set up**, then
answer its six questions. The template URL is already in it.

```text
Set up agent-kit in this workspace: https://github.com/AbdulWadudh/agent-kit

Read the repo before you ask anything: manifests, entry points, and which rule examples in
the template fit this codebase; a rule about a language this repo does not use does not get
installed. Repo harness config is a hint, not the list: after setup, run
`.agent-kit/agent-kit.mjs harnesses` and say which harnesses you found — the machine may have
several while the repo shows none. Setup writes the pointer where the repo already keeps that
harness's folder; wire the rest, and say which are left.

Then ask me these six questions, and wait for the answers before changing anything:

1. Harnesses: after setup I will detect them from HOME, PATH and the repo. Is there one
   installed somewhere unusual that the detection may miss?
2. Task ids: will other people open tasks in this repo too? If the repo is on GitHub I can
   take each task id from its issue number — one number everywhere, and the board shows what
   everyone is doing. That needs `gh auth login` (recommended) or a `GH_TOKEN` with Issues
   read/write, and setup validates it once. If it is just me, or I want everything offline,
   ids are allocated locally and nothing touches the network. Which one — and if issue, is
   the repo yours to open issues in? If I say issue, run setup with `--ids issue`; otherwise
   `--ids local`.
3. Should the commit guard be wired on this clone? It refuses a commit that leaves the
   active task's write set, and warns — never blocks — on a message that does not name the
   task and carry a summary. It is git config, so it is off by default.
4. What is off-limits: directories, generated or vendored paths, secrets, anything you must
   ask before changing?
5. What is the first task you want to hand over?
6. Skills: shall I install the recommended ones — ponytail, prompt-master, caveman and the
   anthropic skills? Ask me, install only what I say yes to, and say what each is for.
   Separately, on its own: agent-browser drives a real browser, including live sites and
   accounts, so it is opt-in — ask me that one apart from the rest.

Then run every step yourself; I am in chat, not a terminal. Follow SETUP.md from the
template exactly — it wins if it disagrees with this message:

1. git clone --depth 1 https://github.com/AbdulWadudh/agent-kit "$TMPDIR/agent-kit"
   bun "$TMPDIR/agent-kit/.agent-kit/agent-kit.mjs" setup . --source https://github.com/AbdulWadudh/agent-kit --ids <the answer to question 2>
   (node instead of bun if Bun is absent; download the archive and pass the unpacked
   path as --source if git is unavailable. Setup installs rtk, the token saver, when it is
   missing — rtk, git and Node 18+ (or Bun) are prerequisites, and setup exits non-zero
   without them, so fix one rather than passing --no-rtk. Do not add --no-rtk to get past it.)
2. Fill AGENTS.md, .agent-kit/project.md, .agent-kit/docs/ARCH_MAP.md, .agent-kit/docs/ENTRY_POINTS.md and
   .agent-kit/docs/API_SKELETON.md from the real tree. Ask, do not invent: propose candidates for
   rules 1-4 from my answers and the code, get a yes, then write them. Install the rule
   examples that are true here — code, config, api — and say which ones you skipped and why.
3. Install the skills I approved for each harness (SETUP.md §3), and list the files you wrote.
   If I said yes to agent-browser, install it and its skill; if I said no, do not.
4. Run `.agent-kit/agent-kit.mjs harnesses`, say the list, then wire the skill for every harness
   setup left in a `Wire the skill for each:` line. Take the frontmatter (name and description)
   from .agent-kit/SKILL.md, put it in that harness's skill folder, and make the body one line:
   "Read .agent-kit/SKILL.md at the repository root." A pointer, never a copy. Do not rewrite a
   pointer setup already wrote. If a harness has no skill mechanism, put the trigger in the file
   it does read. List the files you wrote.
5. Record the off-limits answers in AGENTS.md (Ask first and rules 1-4). Wire the guard if
   I said yes. Then run bun .agent-kit/agent-kit.mjs doctor --strict until it exits 0.
6. Run bun .agent-kit/agent-kit.mjs verify --full and report the baseline honestly.

Report: the harnesses found and wired, the files you wrote, the detected stack, the commands
you found and any you could not, the `rtk` row, the task-id mode (and in issue mode the repo
and whether gh or a token answered — never the token itself), what you filled, the doctor
table, and the next action. Do not claim a step passed without showing its output. Do not
start the first task until I say go.
```

`SETUP.md` is the contract; if this prompt and that file ever disagree, `SETUP.md` wins.

## What setup does

`setup` checks its prerequisites (Node 18+ or Bun, git, `rtk`; plus GitHub access in issue
mode), detects your stack, writes `.agent-kit/project.md` — including the task-id mode — copies
the kit, installs `rtk` when it is missing, and lists the coding agents found in HOME and on
PATH. It never overwrites a file that already exists, and it exits non-zero while a
prerequisite is missing.
`doctor --strict` exits non-zero until the fill work is done — that is the definition of
"set up", and the point of the whole thing.

See `SETUP.md` for the contract and the expected output of each step.

## Daily use

You do not type commands. You describe the task:

> "Login fails when the email has a plus sign. Fix it."

The agent opens the task (`task new`, which records the full baseline run for you), edits
inside the declared write set, and closes it (`task close`, which runs the full suite itself
and refuses a red result). While working it runs `verify`, the quick suite — test, typecheck and lint.
Build is `milestone`, so it runs at the baseline, on `verify --full`, and at the main close,
not on every pass.
The kit exists so that path is checkable — not so that you drive it.

A task that is too large for one sitting splits into subtasks: `task new --parent TASK-N` opens
`TASK-N.1`, `TASK-N.2`, and so on. Each subtask closes on the quick suite and stays in
`active/`. The main task's close is the milestone — it refuses while a subtask is open, runs
build, and any error it reports is fixed right there and the close re-run. Then the
whole family archives under the main id with one change file.

What to ask instead of typing:

| You say | The agent runs |
|---|---|
| "where are we?" | `start` — branch, commands and tiers, the five newest closes, what is in flight, the last evidence, one next action |
| "what's in flight?" | `task show` |
| "we're stuck on a decision" | `task block "<the question>"`; the answer goes in chat, then `task resume` |
| "this is too big for one sitting" | split it: `task new --parent TASK-N` per piece; each closes quick with lint, and the main close runs build |
| "put this plan on the issue" | `task publish` (issue mode; `--id TASK-N` if more than one is open) — the approved plan, without the front matter |
| "put the old tasks on GitHub too" | `task migrate [--dry-run]` (issue mode, after the switch) — one closed issue per archived task, titled `TASK-N — summary`; rerun it freely, the issue list is the record |
| "close it out on GitHub too" | `task close --sync` — closes the issue and comments the change card |
| "work the issue a teammate opened" | `task new --from 42 --lane planned` — imports it; the id is the issue number |
| "two of us took the same number" | `task renumber TASK-131 --next` (local mode) — rewrites the id, the file name and every reference |
| "what's parked?" | read `.agent-kit/tasks/BACKLOG.md`; picking a row means `task new` and then deleting it |
| "populate the docs" | run `.agent-kit/prompts/docs-populate.md`; it opens a PLANNED task and fills the pages, learnings and backlog |
| "`AGENTS.md` has grown too big" | run `.agent-kit/prompts/trim-agents-md.md`; each fact moves to its home and the report shows the character delta |
| "which agents can drive this repo?" | `harnesses`, then wire each skill folder it names |
| "is this repo actually healthy?" | `doctor --strict` and reports the failing row |
| "what changed since the template?" | `check` (names the release tag and any newer one), then `pull --ref <tag>` |
| "how much did rtk save?" | `rtk gain`, reported under the active task ID |

The only commands in this document that are yours to run are the ones inside a chat message.
If the agent asks you to open a terminal, that is a defect in its instructions, not a step in
the workflow. If its environment cannot execute commands at all, it must say so and stop: an
agent that cannot run the gates cannot claim the work is verified, and telling you to paste a
script moves the problem instead of solving it.

And when an agent commits outside its declared write set, the optional scope hook refuses it;
the message hook only warns:

```bash
git config core.hooksPath .agent-kit/githooks   # per clone, off by default
```

It is off by default on purpose. It is git config, not a repo file: every clone would
otherwise get a hook nobody asked for. The scope check also runs at `task close`. The message
check prints the expected shape and exits 0 — it never blocks a human's commit — and it stays
quiet until the repo's first task exists. Turn it on where an agent commits unattended; skip
it if your team would rather not have a hook.

A commit is one task and one kind of change. Its subject is
`fix (TASK-118): rate-limit the invite endpoint`; the body is the change file's
`## What changed` paragraph.

## What the changelog is

It is a folder, not a ledger: `.agent-kit/logs/MM-YYYY/YYYY-MM-DD-TASK-N-slug.md`, one file per
commit, written by `task close`. The card is the completion record — what the task did, in the
close-out paragraph, and where the plan lives:

```
---
id: TASK-118
type: fixed
date: 2026-10-26
summary: "Rate-limited the invite endpoint"
---

# TASK-118 — Rate-limited the invite endpoint

**Task:** [TASK-118](../../tasks/archive/2026-10/2026-10-26-TASK-118-invite-rate-limit.md)
**Scope:** src

## What changed

The invite endpoint now allows five requests a minute per address, and the limit is a
constant rather than a magic number in the route.
```

The date lives in the front matter, and the files live in the task's `FILES` block, so the card
repeats neither. The plan, its evidence and its follow-ups stay in the task file the link points
at; the card never restates them, so there is only one record to keep true. `doctor` fails an
archived task with no file.

A version can be rolled up for people and git: `release v0.2.0` writes `.agent-kit/releases/v0.2.0.md`
from every card no earlier release claims — `# Release v0.2.0`, the date, then `### Added`,
`### Changed`, `### Fixed` and `### Removed`. Each task is a bold title with the commit that
shipped it (`TASK-127 · 544f2dc`) and the card's `## What changed` paragraph beneath it, so the
note reads like prose and points at the code. It prints the `gh release create --notes-file` line
and never runs git itself.

`start` prints the five newest closes, derived from the cards, so nobody scans a month folder
and no close has to rewrite an index to keep a list true. A close writes the archived task and
its card; the index's `ACTIVE` block is the only list it maintains.

## Token economy

Shell output is the part of the context an agent pays for most often. `setup` installs
[rtk](https://github.com/rtk-ai/rtk), and `.agent-kit/SKILL.md` runs the commands whose output the agent
inspects through it:

```bash
rtk git status      # compact, grouped
rtk npm test        # failures only
rtk gain            # what the filter saved
```

The command and its exit code are unchanged; only what reaches the context shrinks.
`rtk bypass <cmd>` runs one command unfiltered when the full text is the evidence, and
`verify` / `task close` never go through the filter, so gates keep their exact exit codes.

rtk's history is machine-wide, not per task. The skill reports savings under the active task
ID, and the change file carries the same ID, so a number in the report points at a record in
`.agent-kit/logs/`.

## The two lanes

| | QUICK | PLANNED |
|---|---|---|
| When | three files or fewer, reversible, no contract change | everything else |
| Halts | none; verify and record | one before the first edit, one before close |
| Always halts | destructive actions, new dependencies, schema changes, scope breaches | same |

The lane exists because the alternative is either ceremony for a typo or no review for a
schema change. Choosing per task is what keeps the gates honest.

## What the gates actually check

| Command | Question |
|---|---|
| `start` | what is the state of this repo right now — branch, commands and tiers, the five newest closes, tasks, gate, last evidence, loop, stale flag, and the one next action? (read-only; it never writes) |
| `verify` | do the `always` commands exit 0, and is this the fourth identical red run? `--full` adds the `milestone` rows, so the slow build is checked before close, not every pass |
| `task close` | did the diff stay inside the declared write set, is the full suite green, and is the outcome written down? A subtask closes on the quick suite (lint included); the main task's close runs build. It also prints the commit message in the hook's shape |
| `doctor` | do the docs name real paths, is every kit directory indexed, do the commands and prerequisites exist, is the id mode recorded and every id unique, is the encoding clean, is every rule checkable and indexed, is the backlog triaged, is every blocked task carrying its question? |
| `check` | is a newer release tag published, and has the template moved under the tag this repo tracks, and did you edit machinery you should not have? |

Every one of them can fail. `selftest` asserts that by building a throwaway repo and
deliberately tripping each gate — from a red baseline to a scope breach.

## The skill

`.agent-kit/SKILL.md` is the work loop, and it is the only place that order lives: classify the request,
open a task, stop for the plan gate, edit inside the declared write set, prove it with real
exit codes, stop for the result gate, close, report. Pressure is where agents skip steps, so
the failure branches live there too — red suite, scope that grows, a suite you cannot run.

It is procedure, not knowledge. The repo's facts stay in `.agent-kit/project.md`, its rules in
`.agent-kit/rules/`, its install in `SETUP.md`. The skill cites them; it never restates them.

So install is not the skill's job — it happens once, before any of this exists, from the
README prompt. That is also why one file is enough for every harness: `AGENTS.md` lists it as
step 1 of "start here", so an agent reads the loop even where no skill mechanism exists. A
harness with its own skill folder gets a four-line pointer, not a copy; `setup` writes it when
the repo already keeps that folder, and `agent-kit harnesses` finds them even when the repo
shows no harness config.

Companion skills are recommended, not bundled: ponytail, prompt-master, caveman and the
anthropic skills — and `agent-browser` only if you say yes, because it drives a real browser
and can reach live sites and accounts. The sources and the exact question to ask are in
`SETUP.md` §3.

No plugin: a plugin is code that runs on every turn, and this needs instructions at the
moment the work starts. `examples/minimal/` shows a filled repo, for when you want to see the
target instead of reading about it.

## Adding a rule, or extending the kit

State the rule in chat; the agent writes it in the file that owns the domain, adds its trigger
to `.agent-kit/rules/INDEX.md`, and checks it. The steps — including how a rule is moved or
deleted — are in `.agent-kit/templates/INDEX.md`. A rule that stays in the conversation is gone
at the next session.

Extending the kit itself — a new command, seed, check or rule example — follows the
"What goes where" table in `AGENTS.md`. The gates are the contract: `selftest` has to show a
new check failing before it can be trusted.

## Staying current

An install follows a **release tag**, not the branch. `setup --ref v1.0.0` clones that tag;
omitting `--ref` takes the newest one, so an install never receives unreleased commits.
`.agent-kit/template.json` records `ref`, `release` and `commit`.

`check` never writes and prints one row per file: `CURRENT`, `UPGRADE`, `DRIFT`, `MISSING`,
`PRUNE`, `SEED-UPDATED`, plus a `release` row — `CURRENT`, `BEHIND` with the tag to move to, or
`UNPINNED` for an install that still tracks a branch. `pull` applies the safe rows, refuses to
overwrite a file you modified unless you pass `--force`, and never deletes without a `prune`
entry. `pull --ref v1.0.1` moves the install; `--ref` accepts any tag, so a jump backwards is a
choice, not an accident. Provenance and per-file hashes live in `.agent-kit/template.json`.

## What is deliberately not here

No sprint system, no persona fleet, no 10-phase pipeline, no per-rule report script, no
PowerShell engine, no plugin. Each of those is real machinery with a real maintenance cost,
and none of them earns that cost at this size. If a repo outgrows this, add one thing at a
time and give it a check.
