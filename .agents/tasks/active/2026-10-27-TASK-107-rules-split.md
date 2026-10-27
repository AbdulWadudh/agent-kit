---
id: TASK-107
parent: ""
lane: PLANNED
status: BLOCKED
created: 2026-10-27
baseline: 6fe93eb3d5216aa0c000fd4362e70305884b449d
touches: [".agents/rules/_behavior.md", ".agents/rules/commits.md", ".agents/rules/INDEX.md", ".agents/sync-manifest.json", ".agents/templates/AGENTS.seed.md", ".agents/templates/INDEX.md", ".agents/templates/rule-examples/typescript.md", "AGENTS.md", "README.md", "SETUP.md", "SKILL.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: commit conventions and skill sources leave the always-read rule file
---
# TASK-107 — rules split

<!-- BLOCKED:START -->
**BLOCKED 2026-10-27** — TASK-107's write set lists rule-examples/typescript.md but not rule-examples/config.md, and the owner has now asked for config.md changes too. Does the config.md rewrite belong in TASK-107 (add it to touches), or is it its own task?
Resume with `agent-kit task resume` once the owner answers.
<!-- BLOCKED:END -->

## Scope (frozen once approved)

**Intent** — The owner: "i dont want those infor in every session" — the commit conventions and
the skill list are read every session but are used at commit and install time. `_behavior.md`
keeps the commit-only-when-asked rule and a pointer; the conventions get their own file, and the
skills become names with a one-line use, no links.

**In scope**
- `.agents/rules/commits.md`: the commit conventions moved out of §10 — identity, attribution,
  split, staging, subject, body, hooks, change file, no bypass — plus a rules INDEX row and a
  manifest `machinery` entry so it ships.
- `_behavior.md` §10: "commit or push only when asked" and "read commits.md before the first
  commit"; nothing else. §12: skill names with a one-line use each, no URLs.
- Pointers updated: `AGENTS.seed.md`, `SETUP.md` §3 (skill sources and links moved here) and
  line 232, `SKILL.md` §3/§8 pointers, `README.md`, `.agents/templates/INDEX.md`, `AGENTS.md`
  home table.
- `.agents/templates/rule-examples/typescript.md` item 2: a source file's ceiling counts lines
  (300, split at 250); `_behavior.md` §2 scopes the character rule to text a session reads.

**Out of scope**
- Changing what the conventions say; `.githooks` and the doctor commit rows stay as they are.
- A new gate: this split is documentation, and the existing checks already enforce the rules.

**Decisions**
- Commit conventions load at commit time; "only when asked" stays in the always-read file because
  it prevents the action. The owner: "here we are just guiding the llm for commiting follow this
  file conventions before commiting".
- Skill sources are install-time: `SETUP.md` §3 carries the links, the always-read file carries
  names and uses. The owner: "u dont have to mention the links".
- `commits.md` ships as machinery because these are the kit's conventions, not a per-repo domain rule.
- A source file's ceiling counts lines, because its job is to decide when to split one file — not
  a context cost. The owner: "this should be line base its a code written in one file".

## Plan

1. Add `.agents/rules/commits.md`, its `.agents/rules/INDEX.md` row and the manifest entry.
2. Cut §10 and §12 in `_behavior.md` to the policy, the pointer and the compact list.
3. Move the skill links into `SETUP.md` §3; update every pointer found by grep.
4. Run the gates and present the result for G2.

**Test plan**
- `node scripts/agent-kit.mjs selftest` → 0.
- `node scripts/agent-kit.mjs doctor --strict` → 0 (rules INDEX and folder agree, rules checkable).
- `rg -n "§10|§12"` → every surviving pointer names a section that exists.
- `node scripts/agent-kit.mjs verify --full` → 0.

## Baseline (before the change)

<!-- BASELINE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node scripts/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node scripts/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- BASELINE:END -->

## Verification

<!-- VERIFY:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node scripts/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node scripts/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- LOOP {"n":0,"fail":"","diff":"3eab055f8d8915cc","plan":"f7f8049b10c9d6f7"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The commit conventions moved to `.agents/rules/commits.md`, read before the first commit; `_behavior.md` §10 keeps "commit or push only when asked" and a pointer. §12 lists the skills with a one-line use each and no URLs, whose sources now live in `SETUP.md` §3. §2 scopes the character rule to text a session reads; a source file's ceiling counts lines, because its job is splitting one file. The always-read file drops 1,305 characters.

**Docs updated** — README, SKILL (§3 pointer, §8 commit and release), SETUP §3 source table and line 232, AGENTS + `.agents/templates/AGENTS.seed.md`, `.agents/templates/INDEX.md`, `.agents/templates/rule-examples/typescript.md`, `.agents/rules/INDEX.md`, `.agents/sync-manifest.json`.

**Follow-ups** — none

<!-- FILES:START -->
<!-- FILES:END -->
