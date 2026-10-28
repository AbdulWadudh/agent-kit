---
id: TASK-112
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 45f7c1c0aa10c28895c30c98a833b1179a2343ce
touches: [".agent-kit/rules/", ".agent-kit/SKILL.md", ".agent-kit/sync-manifest.json"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: the release procedure lives in its own rule file, one pointer in the loop
---
# TASK-112 — release procedure own file

## Scope (frozen once approved)

**Intent** — The owner: "should we do this 'Before committing, read `.agent-kit/rules/commits.md`'
for release too and all major instructions which are rarely used should we just create a dedicated
.md and add the instruction for this job follow the this .md file?"

**In scope**
- Move the release procedure out of `SKILL.md` into `.agent-kit/rules/releases.md`, with one
  pointer left in §8, and a row in the rules router.
- Declare the new file in the manifest's `machinery`, so `pull` ships it.

**Out of scope**
- `8. Close` as a whole: it is the step every task takes, and splitting it would make the loop a
  table of contents. It stays inline until it passes ~3,000 characters.
- The other sections, all of which apply to every session: start, classify, open, work, prove,
  report.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The home is `rules/`, not `templates/`: `commits.md` set the precedent for a procedure that
  hangs off one step, and `rules/INDEX.md`'s "read when" column is what keeps it unread otherwise.
- `rules/releases.md` was not listed in the manifest, so a `pull` would have left it behind; the
  entry is part of the move (`sync-manifest.json`).
- A pointer only pays when the text it replaces is longer than itself: the release block was 1,048
  characters, the pointer 232. Sections under ~300 characters, like browser access, stay inline.

## Plan

1. Write `rules/releases.md` with the command, the note shape, the version table and publishing.
2. Replace the block in `SKILL.md` §8 with one pointer.
3. Add the router row and the manifest entry.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0, including `rules indexed`,
  `rules are checkable`, `doc paths resolve`, `manifest integrity`.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0.

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
<!-- LOOP {"n":0,"fail":"","diff":"56278c0858fbe0d3","plan":"0432107e77095140"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The release procedure moved to `.agent-kit/rules/releases.md`, the home `commits.md`
already set for a procedure that hangs off one step of the loop: the command, the note shape, the
version table and the publish step. `SKILL.md` §8 keeps one pointer, so a session that does not cut
a release pays 232 characters instead of 1,048. The other sections stay inline — they apply to every
session, and a loop made of pointers is a table of contents.

**Docs updated** — `.agent-kit/SKILL.md` §8, `.agent-kit/rules/INDEX.md`, `.agent-kit/sync-manifest.json`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/SKILL.md`
- `.agent-kit/rules/INDEX.md`
- `.agent-kit/sync-manifest.json`
- `.agent-kit/rules/releases.md`
<!-- FILES:END -->
