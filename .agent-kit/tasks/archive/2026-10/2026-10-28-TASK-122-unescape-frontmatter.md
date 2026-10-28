---
id: TASK-122
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 6657958b86332ccddba223040f0007e295558a55
touches: [".agent-kit/agent-kit.mjs"]
depends_on: [TASK-121]
type: fixed  # added | changed | fixed | removed
summary: a quoted task summary no longer leaks YAML escapes into the release note
---
# TASK-122 — unescape front matter

## Scope (frozen once approved)

**Intent** — The owner asked for tags carrying "all the release information attached ... to user
can read it". Cutting v1.0.1 produced `\"upgrade agent-kit\"` in the note, because the parser
stripped the wrapping quotes but not the escapes inside them.

**In scope**
- `frontMatter`: a double-quoted scalar loses `\"` and `\\`.
- One selftest assertion, inside scenario 34.

**Out of scope**
- Rewriting the quoted change file. The parser is the defect; a record stays as it was written.
- A YAML parser dependency. Two escapes cover what a `summary:` can contain.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- Single-quoted scalars are left alone: YAML does not unescape them (the parser already treats
  `'` as a literal delimiter).
- The assertion sits in scenario 34, next to the release note it protects
  (`.agent-kit/releases/` is not installed, so the note is the reader's only copy).

## Plan

1. Unescape a double-quoted scalar.
2. Assert it in the scenario that already governs releases.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0 with `a quoted summary loses its YAML
  escapes`; before the fix it read `a \"b\" c`.
- `agent-kit release v1.0.1` → the TASK-119 line reads `"upgrade agent-kit" has a procedure…`.

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
<!-- LOOP {"n":0,"fail":"","diff":"7fb70b2ab8f751db","plan":"1a378accd2fc4d31"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `frontMatter` now unescapes a double-quoted scalar, so a task summary that contains
quotes reaches the release note as written. Scenario 34 asserts it, next to the note it protects.

**Docs updated** — none needed: the parser is internal, and the note it produces was the symptom.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
<!-- FILES:END -->
