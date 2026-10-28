# Using the kit

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

A request that arrives while a task is open joins its `## Queue` and becomes a subtask; a
separate delivery is what earns a new task, and the owner decides that. Work too large for one
sitting splits the same way: `task new --parent TASK-N` opens `TASK-N.1`, `TASK-N.2`, and so on.
Each subtask closes on the quick suite and stays in `active/`. The main task's close is the
milestone — it refuses while a subtask is open, runs build, and any error it reports is fixed
right there and the close re-run. Then the whole family archives under the main id with one
change file.

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

A commit is one change — a feature, a fix, a doc update or a test. Its subject is
`fix (TASK-118): rate-limit the invite endpoint`; the body is what that commit changed and why.
A task carries as many commits as it has features and fixes, each grouped by the feature or the
issue it serves, and every one names the same task ID. There is no bulk commit of a sitting's
work.

## What the changelog is

It is a folder, not a ledger: `.agent-kit/logs/MM-YYYY/YYYY-MM-DD-TASK-N-slug.md`, one file per
task, written by `task close`. The card is the completion record — what the task did, in the
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
| When | reversible, one domain, no contract change | everything else |
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
| `doctor` | do the docs name real paths, is every kit directory indexed, do the commands and prerequisites exist, is the id mode recorded and every id unique, is the encoding clean, is every rule checkable and indexed, is every reference doc under 12,000 characters, is the backlog triaged, is every blocked task carrying its question? |
| `check` | is a newer release tag published, and has the template moved under the tag this repo tracks, and did you edit machinery you should not have? |

Every one of them can fail. `selftest` asserts that by building a throwaway repo and
deliberately tripping each gate — from a red baseline to a scope breach.
