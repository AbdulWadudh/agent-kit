---
id: TASK-115
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: dd51f8ef23ee611bb198e55654b6d90c4fac2feb
touches: [".agent-kit/agent-kit.mjs", ".agent-kit/rules/_behavior.md", "SETUP.md"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: the files a session reads before it plans now have a cap, and doctor fails past it
---
# TASK-115 — context budget gate

## Scope (frozen once approved)

**Intent** — The owner: the kit must stay "very dynamic and adaptable and extensible without
losing the soul of the agent-kit which is to reduce the session context by following the JIT".

**In scope**
- A `context budget` doctor row over the four files a session reads before it plans, and the
  `_behavior.md` line that states the rule the row enforces.
- A selftest case proving the row fails past a cap and clears below it.

**Out of scope**
- Caps on files reached through an index (`docs/`, `prompts/`, the rule files a task loads):
  those are already JIT, and a cap there would bound the wrong thing.
- A configurable cap list. A number in the code is a decision; a config key invites drift.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The budget is `AGENTS.md`, `.agent-kit/SKILL.md`, `.agent-kit/rules/INDEX.md` and
  `_behavior.md`: SKILL.md §1 reads exactly these before `task show` (`SKILL.md`, §1).
- Caps sit above the seed sizes, so a fresh install passes: `AGENTS.seed.md` is 7,599 against a
  9,000 cap for `AGENTS.md` (`agent-kit.mjs`, `budget`).
- `_behavior.md` moved from 6,753 to 7,007 characters to state its own rule, so its cap is 7,500
  and not 7,000 - the first run of the row failed on it, which is what a binding cap looks like.
- FAIL, not WARN: a warning is a cap nobody acts on, and the fix is a known prompt
  (`.agent-kit/prompts/trim-agents-md.md`).

## Plan

1. Add the row and the budget list to `doctor`.
2. State the rule in `_behavior.md` §2, next to the character-cost paragraph.
3. Add the row to `SETUP.md`'s table, then prove it in `selftest`.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including `32. a session's fixed cost has a
  ceiling`, which asserts `FAIL` after 2,400 filler characters and `PASS` after restoring.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0.

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
<!-- LOOP {"n":0,"fail":"","diff":"e884d625dc3ab2dd","plan":"89a0de53abacaf1d"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `doctor` now has a `context budget` row: the four files a session reads before it
plans (`AGENTS.md`, `SKILL.md`, `rules/INDEX.md`, `_behavior.md`) each have a character cap, and a
file past its cap fails with the number and the prompt that fixes it. `_behavior.md` §2 states the
rule the row enforces, so extension adds a file behind an index instead of a paragraph in front of
one. The row is proven in `selftest` both ways.

**Docs updated** — `.agent-kit/rules/_behavior.md` §2, `SETUP.md` (doctor table).

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/rules/_behavior.md`
- `SETUP.md`
<!-- FILES:END -->
