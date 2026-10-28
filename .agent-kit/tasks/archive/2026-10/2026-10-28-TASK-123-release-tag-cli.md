---
id: TASK-123
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 6f1497a7bab3213c3d243c43a4c7f154529cc736
touches: [".agent-kit/agent-kit.mjs"]
depends_on: [TASK-121]
type: fixed  # added | changed | fixed | removed
summary: release --tag reads its version from the flag, so the documented command runs
---
# TASK-123 — release tag cli

## Scope (frozen once approved)

**Intent** — The owner asked that tags be assigned automatically. The first real run,
`agent-kit release --tag v1.0.1`, printed the usage line instead: the positional filter skips
the value that follows a flag, so the version reached `cmdRelease` as `undefined`.

**In scope**
- The `release` case in `main` reads `positional[0] || value("tag")`.
- Scenario 34 calls the CLI instead of running `git tag` by hand, so the flag is covered.

**Out of scope**
- The other commands' flag parsing. Only `release` takes its only argument after a flag.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The gate now goes through `main`, the same lesson as TASK-120: a function-level test would
  have passed while the documented command failed (`.agent-kit/agent-kit.mjs`, scenario 34).

## Plan

1. Read the version from the flag when there is no positional.
2. Prove the documented command in scenario 34.

**Test plan** — command → expected; a new check also shows its failing run.
- `agent-kit release --tag v0.1.0` → creates the tag; before the fix it printed the usage line.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0 with `release --tag makes the tag through
  the CLI`.

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
<!-- LOOP {"n":0,"fail":"","diff":"9ad9741bb11c6719","plan":"a902475a909f8982"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `release --tag vX.Y.Z` now reads the version from the flag, so the line a release
prints is the line that works. Scenario 34 calls the CLI, not `git tag`, which is why the defect
would have shipped otherwise.

**Docs updated** — none: the documented command did not change, it now runs.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
<!-- FILES:END -->
