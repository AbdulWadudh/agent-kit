---
id: TASK-106
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-27
created: 2026-10-27
baseline: 6fe93eb3d5216aa0c000fd4362e70305884b449d
touches: [".agent-kit/agent-kit.mjs", ".agent-kit/rules/_behavior.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: a session pays for characters, not lines
---
# TASK-106 — character cost

## Scope (frozen once approved)

**Intent** — The owner's fact: an LLM pays for characters, not line breaks — 1,000 one-word
lines are cheaper than 10 lines of 100 characters. Record it as a kit rule and pin the unit in
the selftest.

**In scope**
- `_behavior.md` §2: the fact, and that every size cap in the kit counts characters.
- Selftest: a pointer of 150 one-word lines passes the character cap, so a line count cannot
  return unnoticed.

**Out of scope**
- Changing any existing cap or threshold.
- Re-measuring task files, cards or docs; only the unit is asserted.

**Decisions**
- Caps keep their numbers; only the unit gains a test. A new threshold would change behaviour
  the owner did not ask for (`.agent-kit/agent-kit.mjs:1183`, the 700-character pointer cap).

## Plan

1. `_behavior.md` §2: state the fact and the unit rule; the file is read every session.
2. `.agent-kit/agent-kit.mjs` scenario 15: a 150-line, one-word-per-line pointer must pass.

**Test plan**
- `node .agent-kit/agent-kit.mjs selftest` → 0; the new assertion fails if the pointer cap counts
  lines (150 short lines, under 700 characters).
- `node .agent-kit/agent-kit.mjs doctor --strict` → 0.

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
<!-- LOOP {"n":0,"fail":"","diff":"8a678c26810caa50","plan":"156dcd8eadb26c15"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The kit now states its cost unit: a session pays for characters, not lines. `_behavior.md` §2 records the fact, and the selftest pins it with a 150-line pointer that passes the character cap.

**Docs updated** — `.agent-kit/rules/_behavior.md` §2 — the fact and the unit rule.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/rules/_behavior.md`
- `.agent-kit/agent-kit.mjs`
<!-- FILES:END -->
