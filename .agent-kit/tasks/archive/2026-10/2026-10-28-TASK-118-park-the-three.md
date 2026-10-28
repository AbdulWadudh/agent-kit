---
id: TASK-118
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 529596ba70f07c2e8132dfab97e7187d6f73c539
touches: [".agent-kit/tasks/BACKLOG.md"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: the three kit-review limits are decided in the backlog, so a later session does not re-open them
---
# TASK-118 — park the three

## Scope (frozen once approved)

**Intent** — The owner: "the points you mentioned should we or can we build those or handle". The
three were: runtime telemetry, automatic detection, self-modification in an install.

**In scope**
- Three `BACKLOG.md` rows: one `later` (the only one worth building), two `not-important` with the
  reason that closes them.

**Out of scope**
- Any code. A row is not a task; the `later` row's next step is what a session would open.
- `.agent-kit/templates/backlog.seed.md`: an installed repo must not inherit the kit's own decisions.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- Telemetry is `not-important`: the kit already stores characters, exit codes and `LOOP n`
  (`agent-kit.mjs`, `loopState`); a token count would be an estimate of a harness read the kit
  cannot see.
- Detection is `later`, not `not-important`: the signal already ships in every archived card as
  `<!-- LOOP {"n":…} -->`, so the row is cheap and only the window is a judgement
  (`SKILL.md`, the loop guard at 3).
- Self-modification is `not-important`: `pull --force` reverts machinery and `check` reports the
  drift, so the patch loses by construction (`prompts/kit-review.md`, "Then decide").

## Plan

1. Append the three rows to `.agent-kit/tasks/BACKLOG.md`.
2. Run `doctor` — it validates a row's status, cells and empty fields.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0 with the rows read; a bad status or a
  short row fails the `backlog` row (existing check).

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
<!-- LOOP {"n":0,"fail":"","diff":"e3b0c44298fc1c14","plan":"79ee47946c89d36e"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — three rows in `.agent-kit/tasks/BACKLOG.md` decide the kit-review limits: automatic
detection stays open with a concrete next step (a WARN row over the last ten archived cards where
`LOOP n >= 2`), runtime telemetry and self-modification are `not-important` with the reason that
closes them. Nothing is built; the next session reads a decision instead of re-deriving it.

**Docs updated** — `.agent-kit/tasks/BACKLOG.md`.

**Follow-ups** — none

<!-- FILES:START -->
- none detected
<!-- FILES:END -->
