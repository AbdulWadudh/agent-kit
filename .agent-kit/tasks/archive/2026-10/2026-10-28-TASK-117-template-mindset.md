---
id: TASK-117
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 5a706c58f090785ccf7e1bfcc20ff99580b28327
touches: ["AGENTS.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: a template change is judged by the install it reaches, not by this repo's tidiness
---
# TASK-117 — template mindset

## Scope (frozen once approved)

**Intent** — The owner: "whatever you are making the changes in the agent-kit you know right this
is just a template which will be install in other repo or codebase where the actual agent-kit
works... add these fact in the agents.md so that when im try to change or making enhancing this
template it should not literally try to enhance this repos codebase, it should think in a way how
the codebase or user who install and use the agent-kit will get the advantages".

**In scope**
- One block in `AGENTS.md`, under "If you were asked to change the template", stating the test a
  change has to pass: a symptom in a target repo, and the check in the throwaway repo.

**Out of scope**
- `AGENTS.seed.md`: an installed repo's entry file must not carry the template's own editing
  rules.
- A gate. The sentence changes who a plan is for, not what a file contains, and no command can
  check intent.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The block sits above "Read, in order" because it decides whether the reading is worth doing
  (`AGENTS.md`).
- "The check in the throwaway repo `selftest` builds" is named as the proof because that fixture
  is an installed repo, which is the only place a target symptom can be reproduced
  (`agent-kit.mjs`, scenario 1).

## Plan

1. Write the block.
2. Run the suite, then close.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0, `context budget` included
  (`AGENTS.md` 6,889 of 9,000).

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
<!-- LOOP {"n":0,"fail":"","diff":"c623461617b6e2c1","plan":"680f4ba8a46f5f05"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `AGENTS.md` now opens the template-change section with the test a change has to
pass: this repo is the installer and the product is what a target repo gets, so a change needs a
symptom an installed repo would hit and the check in the throwaway repo `selftest` builds; tidying
the template is not a reason, and a change with neither a symptom nor a check is a proposal, not a
patch.

**Docs updated** — `AGENTS.md`.

**Follow-ups** — none

<!-- FILES:START -->
- `AGENTS.md`
<!-- FILES:END -->
