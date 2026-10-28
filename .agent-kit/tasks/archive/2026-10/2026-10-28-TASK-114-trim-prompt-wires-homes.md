---
id: TASK-114
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: eed3fa49bb2f71e7245bb6ecfa00fbe64ddaaeb8
touches: [".agent-kit/prompts/trim-agents-md.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: the trim moves each fact to its home and wires the pointer that reaches it
---
# TASK-114 — trim prompt wires homes

## Scope (frozen once approved)

**Intent** — The owner: "so the agent trimmer should analyze the current agent file and decide if
it needs to be in separate rules or docs or fact files and move it there and add path for those
invocation".

**In scope**
- `.agent-kit/prompts/trim-agents-md.md`: each destination gets the thing that makes it reachable,
  a step that creates a home that does not exist yet, and a step that wires the pointer.

**Out of scope**
- Any other prompt, and any gate: the checks the prompt names already exist.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The prompt keeps four destinations and adds one column, "its invocation", instead of a fifth
  kind: a fact's home and the way it is reached are one decision (`trim-agents-md.md`).
- The removal test — delete the pointer, ask whether a fresh session can still reach the fact —
  is the prompt's own check, because `doctor` proves a row exists, never that a reader finds it.
- `doctor` already enforces the mechanical half: `rules indexed`, `directory indexes`,
  `doc paths resolve`, which is why no new gate is added.

## Plan

1. Rewrite step 2 as a sort with an invocation column, plus "a destination that does not exist is
   created, not skipped".
2. Add step 4, "move it, then point at it", and let step 5 keep only the seed shape.
3. Say what the gate covers in step 6 and add created files to the report.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0; a pointer at a missing path fails
  `doc paths resolve`, which is the row this prompt relies on.

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
<!-- LOOP {"n":0,"fail":"","diff":"9c0e483b733c9108","plan":"691740d8c1e31cbe"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The trim prompt now decides a destination for every line and the way it is reached:
a rule file gets a router row and a pointer, a docs page gets an index row, a stack fact appends to
`project.md`. A home that does not exist is created from `rule-examples/` rather than skipped, and
the test is removal — delete the pointer, and a fresh session must still reach the fact. Step 5
kept only the seed shape so the pointer rule has one home.

**Docs updated** — `.agent-kit/prompts/trim-agents-md.md`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/prompts/trim-agents-md.md`
<!-- FILES:END -->
