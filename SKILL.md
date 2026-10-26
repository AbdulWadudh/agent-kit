---
name: agent-kit
description: The work loop in an agent-kit repo — classify, open a task, pass the plan gate, edit inside the declared write set, prove it with real exit codes, pass the result gate, close, report. Use when the user asks for a change, fix, or investigation in a repo with .agents/sync-manifest.json, or asks what is in flight.
---

# agent-kit — the work loop

One request in, one verified task out. This file is the order. `AGENTS.md` holds the
boundaries and this repo's facts; `SETUP.md` holds the one-time install. If they disagree with
this file, they win.

## 1. Start of session

Read `AGENTS.md`, then `.agents/project.md`. Run `task show` — resume what is in flight before
opening anything new. Load only the rule files that match the files you will touch.

Every directory the kit owns has an `INDEX.md`. Open the index of the next directory you need,
then the one file it names; do not list a folder into context.

## Skills and tools, before you plan

List what the harness exposes — installed skills (its skill folder or plugin list), configured
MCP servers and their tools, and CLIs on `PATH` — then name the one that covers the task in the
plan. A skill that matches is part of the plan, not a preference: read it and follow it; several
fit, take the narrowest; none fits, say so and write the smallest step by hand. Use a configured
MCP server before a hand-written script that does the same, and an existing CLI or repo script
before a one-off. Re-check when the task changes shape. Installing a skill or wiring an MCP
server is `SETUP.md` §3 and the owner's yes — not a mid-task fix. The rule and its sources are
`.agents/rules/_behavior.md` §12.

`agent-kit harnesses` lists the coding agents installed on this machine — HOME config, PATH,
repo markers. The repo may show none of them. Say the list when you set up or report on a
repo, and wire `SKILL.md` for each harness that has a skill folder; the command prints those
paths. It is a report, not a gate.

Keep them current when the owner asks: reinstall from the skill's own source, listed in
`.agents/rules/_behavior.md` §12. Where `agent-browser` is installed it drives a real browser:
it never sends, posts, buys or logs in unless the task says to.

## Shell output — run it through rtk

`rtk` filters a command's output before you read it: same command, same exit code, less
context spent. Prefix the shell commands whose output you inspect:

| Instead of | Run |
|---|---|
| `git status`, `git diff`, `git log` | `rtk git status`, `rtk git diff`, `rtk git log` |
| `rg`, `find`, `ls`, `cat` | `rtk grep`, `rtk find`, `rtk ls`, `rtk read` |
| `npm test`, `cargo test`, `pytest` | `rtk npm test`, `rtk cargo test`, `rtk pytest` |

- `rtk bypass <cmd>` when the full text is the evidence: a stack trace you must read line by
  line, machine-readable output (`--porcelain`, `--json`), or a command the task must quote.
- File reads the edit needs go through the editor's Read tool, not `rtk read`: the filter
  trades bodies for signatures, which is wrong when you are editing the body.
- `verify` and `task close` run the declared commands themselves, unfiltered, so exit codes are
  untouched.

`rtk` history is machine-wide and has no task label. The task file is the reference: quote the
active task ID with any savings figure — `TASK-118 — rtk saved 82% across 14 commands` — and
the change file written at close carries the same ID. `rtk gain` is the source.

## 2. Classify

QUICK: at most three files, reversible, no public interface, schema, dependency or data
change. Everything else is PLANNED. When unsure, take PLANNED — the cost is a short plan, not
a rewrite.

## 3. Open

`task new <slug> --lane quick|planned`. It records the baseline run itself. Before the first
edit, fill the task's intent, scope and `touches` — the exact paths you will write.

## 4. G1 — plan approval (PLANNED only)

Put the plan in chat: the files, the steps, the risks, and the command that will prove it.
Wait for a yes. No edits before it.

## 5. Work

The smallest complete change, inside `touches`. Reuse what exists; delete before adding. Need
a file you did not declare? Say why, amend `touches` first. Never widen silently.

## 6. Prove it

`verify` mid-flight; `task close` runs it again. Real exit codes go in the evidence table.
Compare against the baseline: a red that was already red is not progress, and a green you did
not cause is not a fix.

## 7. G2 — result approval (PLANNED only)

Report what changed and the evidence, in the user's words. Wait for a yes, then close.

## 8. Close

`task close` runs the suite, refuses a red result, checks the diff against `touches`,
inventories the files, archives the plan and writes the change file
(`.agents/logs/MM-YYYY/`). `--amend "<why>"` accepts a declared breach and writes the
reason into the plan — only with the user's reason, never as a way past a red suite.

Commits are split by task and by kind of change: one task that adds, fixes and documents is
three commits. The subject is `type (TASK-ID): summary`; the body is the change file's
summary. Stage those files, never the tree. `.githooks/commit-msg` warns when the shape misses
and never blocks; keeping it right is on you. The rule and its type list are
`.agents/rules/_behavior.md` §10.

## 9. Report

One short message: what changed, what proved it, what is still open. Name the task ID. If rtk
ran, put its figure under the same ID (`TASK-118 — rtk 82% over 14 commands`). Then stop — no
follow-up suggestions unless asked.

## When the loop bends

- **Suite already red at open.** Record it, say so, keep the baseline. Do not "fix" it in this
  task unless that is the task.
- **The user changes the ask mid-flight.** Rewrite the scope section, keep the old text, and
  take a fresh G1 if it is PLANNED.
- **You cannot run the suite.** Say so and stop. Never close on an empty evidence table.
- **The change outgrows QUICK.** Stop, reopen it as PLANNED, take the gate.

## Not yours

- Installing or upgrading the kit, or a skill the owner has not approved. That is `SETUP.md`,
  once, and a chat decision.
- Editing machinery (`scripts/`, `.agents/templates/`, the manifest) to make a gate pass.
  `pull --force` takes it back, and the gate was the point.
