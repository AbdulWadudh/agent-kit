---
id: TASK-111
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 49b06860de7350afb838d49dd6c446247e5a2e58
touches: [".agent-kit/releases/", ".agent-kit/SKILL.md", ".agent-kit/agent-kit.mjs"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: the release rule says who picks the number, and v1.0.0 is cut
---
# TASK-111 — release version rule and v1

## Scope (frozen once approved)

**Intent** — The owner: "work on releases and then push, i think template should be there or have
be hardcoded it in the skill or agent or _behaviour file?" — the release step had a command but no
rule for choosing the version.

**In scope**
- The version rule, in the one place the loop already describes `release`: `.agent-kit/SKILL.md`
  §8.
- Cut `v1.0.0` over the nine change files the log holds.

**Out of scope**
- A `release.md` template seed: `agent-kit release` writes the whole file, so a seed would be a
  second copy of the same shape that nothing reads.
- `_behavior.md` and `AGENTS.md`: behaviour rules are cross-cutting session rules, and `AGENTS.md`
  is the map, not the loop.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- One home: `SKILL.md` §8 already holds the `release` paragraph, so the number rule joins it
  rather than opening a new section in `_behavior.md`.
- The rule states who decides, not a checkable invariant: "major when an installed repo must edit
  a path or a command" cannot be judged by a script, and a rule file with an uncheckable phrase
  would fail doctor's `rules are checkable` row.
- `v1.0.0` is the first release of the `.agent-kit/` install surface; the layout move in
  TASK-108 is why it is major rather than `0.x`.
- The generated notes put a blank line between bullets; the fix is in `cmdRelease`, not in the
  file, so the next release inherits it.

## Plan

1. Add the version rule to `SKILL.md` §8.
2. Remove the blank line `cmdRelease` writes between bullets.
3. Run `release 1.0.0`, then the suite.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs release 1.0.0` → one file, nine tasks, tight list.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including `28. a release collects the change
  files no release claims`.
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
<!-- LOOP {"n":0,"fail":"","diff":"3296c599b2aaa68d","plan":"75032d829da6b3f8"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The kit could cut a release but never said who picks the number, so the rule now sits
beside the command in `SKILL.md` §8: `v1.0.0` first, major when an installed repo must edit a path,
minor for a new command or rule, patch for fixes. `cmdRelease` no longer writes a blank line between
bullets. `v1.0.0` claims the nine change files in the log.

**Docs updated** — `.agent-kit/SKILL.md` (the version rule).

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/SKILL.md`
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/releases/v1.0.0.md`
<!-- FILES:END -->
