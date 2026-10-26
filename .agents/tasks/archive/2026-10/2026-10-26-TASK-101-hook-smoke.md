---
id: TASK-101
lane: QUICK
status: DONE
created: 2026-10-26
baseline: 2f7b5c1fa5ee6a490c21b7dd1dc86b80309436b0
touches: [".githooks/", "scripts/agent-kit.mjs", ".agents/sync-manifest.json", ".agents/rules/_behavior.md", ".agents/templates/", ".opencode/skills/agent-kit/", "AGENTS.md", "README.md", "SETUP.md"]
depends_on: []
summary: "prove the hook fires"
---
# TASK-101 — hook smoke

## Scope (frozen once approved)

**Intent**
The workflow asked for five commands a user would never type. Answer it in the code: make the two that matter automatic, and make the boundary fire without anyone remembering it.

**In scope**
- 	ask new records the baseline; 	ask close runs the suite and refuses a red result.
- A pre-commit guard that refuses a commit outside the active task's write set.
- Docs and the skill say who types what.

**Out of scope**
- Rewriting the lane model or the evidence format.

**Assumptions taken without asking**
- none

## Plan

1. Fold the baseline into 	ask new and the evidence run into 	ask close.
2. Add 	ask guard plus .githooks/pre-commit; wire core.hooksPath in setup.
3. Assert both directions in selftest, then prove the hook through real git in this repo.

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
| test | `node scripts/agent-kit.mjs selftest` | exit 0 | exit 0 | 0 |
| lint | `node scripts/agent-kit.mjs doctor` | exit 0 | exit 0 | 0 |
<!-- EVIDENCE:END -->

## Close-out

**Outcome** — the common path is two agent commands, and git refuses an out-of-scope commit on its own.

**Docs updated**
- AGENTS.md, README.md, SETUP.md, the AGENTS seed, the skill
- .agents/rules/_behavior.md rule 1

**Learnings promoted**
- none

**Follow-ups**
- none

<!-- FILES:START -->
- `.agents/rules/_behavior.md`
- `.agents/sync-manifest.json`
- `.agents/templates/AGENTS.seed.md`
- `.githooks/pre-commit`
- `.opencode/skills/agent-kit/SKILL.md`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `scripts/agent-kit.mjs`
- `.agents/templates/tasks-INDEX.seed.md`
<!-- FILES:END -->
