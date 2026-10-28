---
name: agent-kit
description: The work loop in an agent-kit repo — classify, open a task, pass the plan gate, edit inside the declared write set, prove it with real exit codes, pass the result gate, close, report. Use when the user asks for a change, fix, or investigation in a repo with .agent-kit/sync-manifest.json, or asks what is in flight.
---

# agent-kit — the work loop

One request in, one verified task out. This file is the order. `AGENTS.md` holds the
boundaries and this repo's facts; if it disagrees with this file, it wins.

## 1. Start of session

Read `AGENTS.md`, then `.agent-kit/project.md`. Run `agent-kit start`: it prints the branch, the
declared commands and tiers, the five newest closes, what is in flight, the gate, the last
evidence, and one next action. `task show` opens the active task. Resume what is in flight before
anything new. Load only the rules that match the files you touch.

Every directory the kit owns has an `INDEX.md`: open it, then the one file it names.

## Skills and tools, before you plan

List what the harness exposes — skills, MCP servers and their tools, CLIs on `PATH` — then name
the one that covers the task in the plan. A matching skill is part of the plan: read it, follow
it; several fit, take the narrowest; none fits, say so and write the smallest step by hand. Prefer
a configured MCP server to a hand-written script, and an existing CLI or repo script to a
one-off. Installing a skill or wiring an MCP server is the owner's yes, not a mid-task fix
(`rules/_behavior.md` §12).

`agent-kit harnesses` lists the coding agents on this machine — HOME config, PATH, repo
markers; a repo may show none. Say the list when you set up or report, and wire
`.agent-kit/SKILL.md` for each harness with a skill folder. A report, not a gate.

## Browser access — use `agent-browser`

Reach for `agent-browser` only when the task needs the UI: clicks, forms, a session, a rendered
page. No UI, use `curl`/`fetch`; never Playwright or your own driver.

## Shell output — run it through rtk

`rtk` filters a command's output: same command, same exit code, less context spent. Prefix the
commands whose output you inspect:

| Instead of | Run |
|---|---|
| `git status`, `git diff`, `git log` | `rtk git status`, `rtk git diff`, `rtk git log` |
| `rg`, `find`, `ls`, `cat` | `rtk grep`, `rtk find`, `rtk ls`, `rtk read` |
| `npm test`, `cargo test`, `pytest` | `rtk npm test`, `rtk cargo test`, `rtk pytest` |

- `rtk bypass <cmd>` when the full text is evidence: a stack trace, machine-readable output
  (`--porcelain`, `--json`), or output the task must quote.
- Edits read through the editor's Read tool, not `rtk read`: the filter trades bodies for
  signatures.
- `verify` and `task close` run the declared commands unfiltered, so exit codes stand.

`rtk` history has no task label: quote the active task ID with any savings figure
(`TASK-118 — rtk saved 82% across 14 commands`); the card carries the same ID. `rtk gain` is
the source.

## 2. Classify

MICRO: one file, reversible with `git revert`, one domain, and no public interface, schema,
dependency, env, security or `.agent-kit/` change. Anything else is not micro.
QUICK: reversible, one domain, no public interface, schema, dependency or data change.
PLANNED: everything else. When unsure, take PLANNED: a short plan, not a rewrite.

## 3. Open

`task new <slug> --lane micro|quick|planned`. It records the baseline run itself — a full one, so the
milestone rows are on record before you touch anything. The id comes from the `ids` row in
`project.md` — never type one; `ids: issue` also mints the issue, where `--summary` is its title
and `--intent` its body; `--from <n>` imports one.
MICRO records the same task file (intent, scope, touches) but runs only the always-tier
baseline, never halts at G1/G2, and takes a local `PATCH-N` id in both `ids` modes — it never
mints an issue.
Before the first edit, fill the task's intent, scope and `touches` — the exact paths you will
write. Keep it minimal: the decisions a later session would re-open (each with its pointer), the
plan, the proof and the summary.

A request that arrives while a task is open lands in its `## Queue` and is worked as a subtask,
not a new task: `task new <slug> --lane quick|planned --parent TASK-N` opens `TASK-N.M`, queues
the main task and records a quick baseline. Only a separate delivery — another domain, its own
dependency or contract, or more than one sitting — earns a new task, and the owner chooses that.
Close refuses while a queue row is open. One subtask runs at a time; the main task stays QUEUED
until its last closes. Do not use a subtask to dodge G1: the plan and the gate are the main
task's.

## 4. G1 — plan approval (PLANNED only)

Put the plan in chat: the files, the steps, the risks, and the command that will prove it.
Wait for a yes. No edits before it. In `ids: issue`, the yes is also when `task publish` sends
the plan to the issue.

## 5. Work

The smallest complete change, inside `touches`. Reuse what exists; delete before adding. Need
a file you did not declare? Say why, amend `touches` first. Never widen silently.

## 6. Prove it

`verify` mid-flight: it runs the `always` rows and holds the `milestone` ones for the baseline,
`verify --full` and `task close` — the inner loop stays short, and build is on record before
close. Real exit codes go in the evidence table, each row with its
scope. If `task show` says `Evidence: STALE`, the task's files moved after the green run —
verify again before quoting it. Compare against the baseline: a red that was already red is not
progress, and a green you did not cause is not a fix. Three identical red runs over the same
files make `verify` refuse — and `task close` with it — until the Plan says what the next
attempt changes; `task show` prints `Loop: n/3`.

A subtask's quick suite is its whole close: test, typecheck and lint, but not build. Build is
not skipped, only moved — it runs at the main task's close, over the family's union of files.

## 7. G2 — result approval (PLANNED only)

Report what changed and the evidence, in the user's words. Wait for a yes, then close.

## 8. Close

`task close` runs the full suite, refuses a red result, checks the diff against `touches`,
inventories the files, archives the plan and writes the change file (`.agent-kit/logs/MM-YYYY/`).
The card is the completion record: a `**Task:**` link to the archived plan, `**Scope:**`, then
`## What changed` with the close-out paragraph. No date, no file list (front matter and `FILES`
carry them); the plan, evidence and follow-ups stay in the task it links.
It prints the closing commit's message in the hook's shape; `--pr` adds a PR body from the
change file and evidence. `--amend "<why>"` accepts a declared breach and writes the reason
into the plan — only with the user's reason, never as a way past a red suite.

A subtask closes differently: `task close` runs the quick suite (lint included), marks it DONE
and leaves it in `active/`, and prints its own commit message. It writes no change file and
archives nothing. The last subtask close puts the main task back in progress.

MICRO closes on the always-tier commands (typecheck, lint), the scope check and one `PATCH-N`
change card; it never runs a milestone row, and it archives like a top-level task. Build proof
happens once, at release.

The main task's close is the milestone. It refuses while a subtask is open, then runs the full
suite, build included. A red build stops the close with its rows recorded: fix those errors
now, in this task, and close again; the suite re-runs. Green, the main task and its DONE
subtasks archive together, the change file is one, the write set is the main task's files plus
every subtask's, and every commit names the main id.

Before committing, read `.agent-kit/rules/commits.md` — the split, subject, body and staging.

Cutting a release is its own procedure: read `.agent-kit/rules/releases.md`. `agent-kit release
<version>` runs `verify --full` first and refuses a red suite (`--no-verify` only for a deliberate
cut), then writes the note from every card no earlier release claims; running git stays with the
owner.

## 9. Report

One short message: what changed, what proved it, what is still open. Name the task ID. If rtk
ran, put its figure under the same ID (`TASK-118 — rtk 82% over 14 commands`). Then stop — no
follow-up suggestions unless asked.

## When the loop bends

- **Suite already red at open.** Record it, say so, keep the baseline. Do not "fix" it in this
  task unless that is the task.
- **The user changes the ask mid-flight.** Rewrite the scope section, keep the old text, and
  take a fresh G1 if it is PLANNED.
- **The owner states a rule.** It is a task: find the home, add its row in
  `.agent-kit/rules/INDEX.md`, check it (`.agent-kit/templates/INDEX.md`); a rule that stays in
  chat does not exist.
- **You cannot run the suite.** Say so and stop. Never close on an empty evidence table.
- **You need an owner decision.** `task block "<the question>"` frees the slot; the question
  waits in the file and `start` shows it. `task resume` when answered. Do not guess.
- **You find work you will not do now.** Park it in `.agent-kit/tasks/BACKLOG.md` with a status,
  the `path:line` and a next step — never a task, the report or a comment. Later: `task new`,
  then delete the row.
- **The change outgrows QUICK.** Stop, reopen it as PLANNED, take the gate.
- **The process is the friction.** A rule or gate that cost two sessions is a kit task: cite the
  two changes, then follow `.agent-kit/prompts/kit-review.md`. It is not a product task.

## Not yours

- Installing or upgrading the kit, or a skill the owner has not approved. That is a one-time
  setup step and a chat decision.
- Editing machinery (`.agent-kit/agent-kit.mjs`, `.agent-kit/templates/`, the manifest) to make a gate pass.
  `pull --force` takes it back, and the gate was the point.
