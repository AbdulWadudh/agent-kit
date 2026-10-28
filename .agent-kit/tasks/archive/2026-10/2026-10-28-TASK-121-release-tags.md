---
id: TASK-121
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: c4bbe22d23f4a92c2afaa2ffb73b65d4c61d872f
touches: [".agent-kit/agent-kit.mjs", ".agent-kit/rules/releases.md", ".agent-kit/templates/AGENTS.seed.md", "SETUP.md"]
depends_on: [TASK-120]
type: added  # added | changed | fixed | removed
summary: a release gets its tag automatically, and the tag message is the release note
---
# TASK-121 — release tags

## Scope (frozen once approved)

**Intent** — The owner: "add the tags and how it will automatically assign tags with all the
release infromation attached to the tags to user can read it".

**In scope**
- `release --tag <version>`: creates an annotated tag whose message is the release note.
- A `release tags` doctor row (WARN) so a note with no tag is reported.
- The release procedure, the seed's command row and the doctor table.
- The two tags this repo owes: `v1.0.0` retroactively at its note commit, and `v1.0.1`.

**Out of scope**
- Committing inside `release`. The note must be committed before it can be tagged, and the commit
  message is the owner's; the command prints the exact line instead.
- Pushing. `release --tag` stops at the local tag; `git push origin vX.Y.Z` and
  `gh release create` stay the owner's step.
- A FAIL row. A release is briefly untagged between the note and the tag, so the row warns and
  never changes an exit code.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The tag message is `-F <note>`: one copy of the release text, so `git show v1.0.1` and the
  GitHub page cannot disagree with the file (`agent-kit.mjs`, `cmdRelease`).
- `--tag` refuses an uncommitted note: a tag created before the commit does not contain its own
  note in the tree (`git status --porcelain -- <note>`).
- `--tag` refuses an existing tag: a released tag is never moved, or an install pinned to it
  silently changes content (`.agent-kit/rules/releases.md`).
- WARN not FAIL for the doctor row: a transient untagged note is a state, not a broken repo.
- `v1.0.0` is tagged at the commit that added its note, not at HEAD: the tag has to point at the
  code it names, even though `--ref` did not exist then.

## Plan

1. Add `--tag` to `release` and the row to `doctor`, then prove both in `selftest`.
2. Update `releases.md`, the seed row and the doctor table.
3. Cut `v1.0.1`, commit the note, tag it; tag `v1.0.0` at its note commit; push both.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including `34. a release note without its
  tag is reported` (WARN, then `git tag` → PASS).
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0 with `release tags PASS` after step 3.
- `git show v1.0.1 --stat --format=%B` → the release note text.

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
<!-- LOOP {"n":0,"fail":"","diff":"e8df16e27459a424","plan":"163764050e7f4886"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `release --tag vX.Y.Z` now makes the annotated tag, using the release note as its
message, so `git show` and every release page carry the change list from one source. It refuses a
note that is not committed (the tag would lack the file), an existing tag (never moved), and a
missing note. `doctor` gains a `release tags` WARN so "cut but not tagged" is visible, and the two
owed tags are created: `v1.0.0` at the commit that added its note, `v1.0.1` at HEAD.

**Docs updated** — `.agent-kit/rules/releases.md`, `.agent-kit/templates/AGENTS.seed.md` (release
row), `SETUP.md` (doctor table).

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/rules/releases.md`
- `.agent-kit/templates/AGENTS.seed.md`
- `SETUP.md`
<!-- FILES:END -->
