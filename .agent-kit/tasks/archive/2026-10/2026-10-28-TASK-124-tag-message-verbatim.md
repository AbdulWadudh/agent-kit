---
id: TASK-124
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: f0f44534b64bea2e90a9095ee09dd615610882e3
touches: [".agent-kit/agent-kit.mjs"]
depends_on: [TASK-121]
type: fixed  # added | changed | fixed | removed
summary: a release tag keeps the note's headings, so the whole note reaches the reader
---
# TASK-124 — tag message verbatim

## Scope (frozen once approved)

**Intent** — The owner wants "all the release information attached to the tags". The first real
tag (`git show v1.0.1`) began at `**Date:**` and dropped `# Release v1.0.1` and every `### Added`
heading, because `git tag -F` strips lines starting with `#` by default.

**In scope**
- `release --tag` passes `--cleanup=verbatim`, so the tag message is the note byte for byte.
- Scenario 34 asserts the heading survives into the annotation.

**Out of scope**
- The note format. `# Release vX.Y.Z` stays, because doctor and the filename already agree on it.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- `verbatim`, not `whitespace`: `whitespace` still keeps `#`, but `verbatim` makes "the message
  is the file" literally true (`git show v1.0.1 --format=%B`).
- The assertion reads `git tag -n99`, the annotation as git renders it, not the file it came from.

## Plan

1. Pass `--cleanup=verbatim` and prove the heading in scenario 34.
2. Re-create the two local tags that were made before the fix.

**Test plan** — command → expected; a new check also shows its failing run.
- Before the fix: `git show v1.0.1 --format=%B` starts at `**Date:**` (observed on the real tag).
- `node .agent-kit/agent-kit.mjs selftest` → exit 0 with `the tag message keeps the note's
  heading, not just its body`.

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
<!-- LOOP {"n":0,"fail":"","diff":"e80c633427171a3f","plan":"ca1b64bb11464b33"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — `release --tag` now writes the annotation verbatim, so `git show vX.Y.Z` prints
the release note as the file holds it — title and section headings included. The two tags made
before the fix were recreated locally; nothing had been pushed.

**Docs updated** — none: `releases.md` already says the tag message is the note, and now it is.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
<!-- FILES:END -->
