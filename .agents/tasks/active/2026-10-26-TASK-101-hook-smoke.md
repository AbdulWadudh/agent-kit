---
id: TASK-101
lane: QUICK
status: IN_PROGRESS
created: 2026-10-26
baseline: 2f7b5c1fa5ee6a490c21b7dd1dc86b80309436b0
touches: [".githooks/", "scripts/agent-kit.mjs", ".agents/sync-manifest.json", ".agents/rules/_behavior.md", ".agents/templates/", ".opencode/skills/agent-kit/", "AGENTS.md", "README.md", "SETUP.md"]
depends_on: []
summary: "prove the hook fires"
---
# TASK-101 — hook smoke

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

## Baseline (before the change)

`agent-kit verify --baseline` writes this table. It is the "was it already broken?" answer: a
failure present here is reported, not worked over.

<!-- BASELINE:START -->
<!-- BASELINE:END -->

## Verification

`agent-kit verify` writes this table. Do not hand-write exit codes. `task close` refuses a
table that records a non-zero exit.

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
