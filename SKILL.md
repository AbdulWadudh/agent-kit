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

## Skills and tools, before you plan

Check what is installed. A skill that covers the task is part of the plan, not a preference:
name it, follow it, and never do from memory what it already solves. Nothing fits — say so.
Same order for MCP servers and tools: the configured one first, hand-written code second.

Keep them current when the owner asks: reinstall from the skill's own source, listed in
`.agents/rules/_behavior.md` §12. Where `agent-browser` is installed it drives a real browser:
it never sends, posts, buys or logs in unless the task says to.

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
inventories the files, archives the plan and files the changelog entry. `--amend "<why>"`
accepts a declared breach and writes the reason into the plan — only with the user's reason,
never as a way past a red suite.

## 9. Report

One short message: what changed, what proved it, what is still open. Name the task ID. Then
stop — no follow-up suggestions unless asked.

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
- The release version, and the one-sentence summary. Draft both, get a yes, then run
  `release`.
- Editing machinery (`scripts/`, `.agents/templates/`, the manifest) to make a gate pass.
  `pull --force` takes it back, and the gate was the point.
