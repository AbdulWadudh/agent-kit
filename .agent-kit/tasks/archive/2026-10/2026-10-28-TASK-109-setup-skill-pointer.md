---
id: TASK-109
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: cfe4471b94b499a3452c94811b26b58e42978017
touches: [".agent-kit/agent-kit.mjs", "SETUP.md", "README.md"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: setup writes the harness skill pointer for a harness whose folder the repo already keeps
---
# TASK-109 — setup skill pointer

## Scope (frozen once approved)

**Intent** — The owner: "do the changes in setup which u describe" — setup should stop telling the
session to wire each harness skill by hand and write the pointer itself.

**In scope**
- `writeSkillPointers()`: a detected harness that already keeps its folder in the repo
  (`.claude/`, `.opencode/`) gets `.claude/skills/agent-kit/SKILL.md`, generated from
  `.agent-kit/SKILL.md`'s own frontmatter plus the one line that names the loop.
- `setup` prints `Skill pointer: <path>` and only asks the session to wire harnesses it left alone.
- A selftest case: the pointer is written, its frontmatter is the loop's, a harness folder the repo
  does not have is not created, `doctor` accepts it, and an authored pointer is never overwritten.

**Out of scope**
- Harnesses with no known skill folder: setup still only prints their path.
- Refreshing a pointer whose description went stale; `setup` never overwrites an authored file.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The pointer is generated from `.agent-kit/SKILL.md`'s frontmatter, so the harness's skill list
  carries the real trigger text; the owner chose that over a fixed label.
- The body stays one line naming `.agent-kit/SKILL.md`: a copy drifts on the first edit and
  `doctor` fails one (`agent-kit.mjs:1179-1184`).
- The harness folder is a precondition, never created: a repo that does not use Claude should not
  grow a `.claude/` because it installed a kit.
- An existing pointer is kept, in line with setup's "never overwrites" rule (`SETUP.md:48`).

## Plan

1. Add `skillPointer()` and `writeSkillPointers()`, and call them from `cmdSetup`.
2. Report what was written and leave only the unwired paths in the "Wire the skill" line.
3. Prove it in `selftest`, then update the two install docs that describe the manual step.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including `setup writes the pointer a harness
  discovers`; without the setup call the pointer is absent and that case fails.
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
<!-- LOOP {"n":0,"fail":"","diff":"0950c015494a1911","plan":"0796116d24003ed5"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `setup` now writes the harness skill pointer itself where the repo already keeps
that harness's folder, instead of only printing the path. The pointer is generated from
`.agent-kit/SKILL.md`'s frontmatter and one line naming the loop, so the skill is discoverable
without a manual step and the loop still has exactly one home.

**Docs updated** — `SETUP.md` (what setup does, expected output) and `README.md` (the install
prompt's harness step and the one-file explanation).

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
- `README.md`
- `SETUP.md`
<!-- FILES:END -->
