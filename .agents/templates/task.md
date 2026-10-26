---
id: {{ID}}
lane: {{LANE}}
status: IN_PROGRESS
created: {{DATE}}
baseline: {{BASELINE}}
touches: []
depends_on: []
type: changed  # added | changed | fixed | removed — what kind of change this is
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

An assumption carries the evidence it stands on (`path:line`, a command's result, or the
owner's words); with no evidence, write the still-open question here instead.

## Plan

1. <!-- FILL:step-1 -->

**Files** — must match `touches` above.

**Evidence** — the `path:line`, command or owner quote each step rests on. A step resting on
none says `Assumption:` and the check that will settle it.

**Test plan** — the command, the expected result, and for a new check, its expected failure
on the unfixed tree. A probe never seen failing is unproven.

## Baseline (before the change)

`agent-kit verify --baseline` writes this table. It is the "was it already broken?" answer: a
failure present here is reported, not worked over.

<!-- BASELINE:START -->
<!-- BASELINE:END -->

## Verification

`agent-kit verify` writes this table. Do not hand-write exit codes. A quick run records the
`always` rows; `verify --full` and close add the `milestone` rows, so each row carries its
scope. `task close` refuses a table that records a non-zero exit.

<!-- EVIDENCE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| — | not run | — | — | — | — |
<!-- EVIDENCE:END -->

## Close-out

**Outcome** — <!-- FILL:outcome — one line, plain words, factual. Becomes the change file title. -->

**Docs updated**
- <!-- FILL:docs-updated — or write "none needed: <reason>" and delete the bullet. -->

**Learnings promoted**
- none

**Follow-ups**
- none

<!-- FILES:START -->
<!-- FILES:END -->
