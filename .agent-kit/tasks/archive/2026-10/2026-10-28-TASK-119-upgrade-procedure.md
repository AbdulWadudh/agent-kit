---
id: TASK-119
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: ab8a3cdb766bcd10faf2f62b70289859a1a29f9c
touches: [".agent-kit/prompts/", ".agent-kit/INDEX.md"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: "upgrade agent-kit" has a procedure: check the source, show the diff, pull as one task
---
# TASK-119 — upgrade procedure

## Scope (frozen once approved)

**Intent** — The owner: "for upgrading or checking and updating the agent-kit from the source do
we have any commands or instruction... user saying upgrade agent-kit and the agent will check the
agent-kit repo and see if any upgrade is there and upgrading post informing the users".

**In scope**
- `.agent-kit/prompts/upgrade.md`: the job an agent runs on that sentence.
- The prompts router row, and `.agent-kit/INDEX.md`'s pointers row, which still listed two of the
  four prompts.

**Out of scope**
- A release-version handshake. `check` already compares file hashes against a fresh clone of the
  recorded source, so "is there an upgrade" is answered; a version label would change no action.
- A new command. `check`, `pull --dry-run`, `pull`, `--force` and `--seeds` already exist and are
  documented in `AGENTS.md`'s command table; what was missing was the order and the report.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The task is opened before `pull`, `touches: [".agent-kit/", "AGENTS.md"]`: `pull` writes files
  no task declared and `task close` scope-checks the diff (`agent-kit.mjs`, `cmdClose`).
- The report names files, not a version: `template version` is `manifest.version`
  (`agent-kit.mjs:961`), a schema number, and `releases/` is `owned`, so an install never receives
  it (`sync-manifest.json`).
- `--force` and `--seeds` are the owner's yes, and only after the dry-run diff: both overwrite a
  file the repo authored (`agent-kit.mjs`, `cmdPull`).
- The source is a fresh `git clone --depth 1` per run when it was recorded as a URL
  (`agent-kit.mjs:355`), so no local clone has to be kept up to date.

## Plan

1. Write the procedure.
2. Add the router row and fix the two stale pointer rows.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0, which covers `directory indexes`,
  `docs indexed` and `context budget`.
- `agent-kit check` in this repo → "This is the template itself", unchanged behaviour.

## Baseline (before the change)

<!-- BASELINE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- BASELINE:END -->

## Verification

<!-- VERIFY:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- LOOP {"n":0,"fail":"","diff":"8c7e1e84ca9a6b1d","plan":"8b9bc5997ff60a51"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `.agent-kit/prompts/upgrade.md` is the job "upgrade agent-kit" now lands on:
`check` the recorded source (`IN SYNC` stops it), `pull --dry-run` and report the rows, open a task
with the write set so the close can pass its scope check, `pull` (never `--force` or `--seeds`
without the owner's yes), then `doctor --strict` and one logged commit. The routers that point at
`prompts/` were listing two of the four prompts; both now match the folder.

**Docs updated** — `.agent-kit/prompts/upgrade.md`, `.agent-kit/prompts/INDEX.md`,
`.agent-kit/INDEX.md`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/INDEX.md`
- `.agent-kit/prompts/INDEX.md`
- `.agent-kit/prompts/upgrade.md`
<!-- FILES:END -->
