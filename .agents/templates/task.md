---
id: {{ID}}
lane: {{LANE}}
status: IN_PROGRESS
created: {{DATE}}
baseline: {{BASELINE}}
touches: []
depends_on: []
summary: ""
---
# {{ID}} — {{TITLE}}

## Scope (frozen once approved)

**Intent**
<!-- FILL:intent — the user's request in one or two sentences, in their words. -->

**In scope**
- <!-- FILL:in-scope -->

**Out of scope**
- <!-- FILL:out-of-scope — say what you are deliberately not touching. -->

**Assumptions taken without asking**
- none

## Plan

1. <!-- FILL:step-1 -->

**Files** — must match `touches` above.

**Test plan** — the command, the expected result, and for a new check, its expected failure
on the unfixed tree. A probe never seen failing is unproven.

## Verification

`agent-kit verify` writes this table. Do not hand-write exit codes.

<!-- EVIDENCE:START -->
| Action | Command | Expected | Observed | Exit |
|---|---|---|---|---|
| — | not run | — | — | — |
<!-- EVIDENCE:END -->

## Close-out

**Outcome** — <!-- FILL:outcome — one line, plain words, factual. Becomes the changelog line. -->

**Docs updated**
- <!-- FILL:docs-updated — or write "none needed: <reason>" and delete the bullet. -->

**Learnings promoted**
- none

**Follow-ups**
- none

<!-- FILES:START -->
<!-- FILES:END -->
