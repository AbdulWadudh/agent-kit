---
id: TASK-30
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 3b7b43aeba0c58d4824ba8c31c9fac032a90a6b0
touches: [".agent-kit/", "AGENTS.md", "README.md", "SETUP.md", "docs/", "setup/"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: "Link release task ids and split large docs at 12,000 characters"
---
# TASK-30 — Link release task ids and split large docs at 12,000 characters

## Scope (frozen once approved)

**Intent** — The owner asked that release notes link each task id to its archived task file and, when the repo uses issue ids, to its issue as well. They also asked that the 300-line source ceiling apply to reference Markdown, measured in characters, and left the threshold to the agent. The delivery links both artifacts in release notes, adds a 12,000-character ceiling with a doctor row and a selftest, and splits README.md and SETUP.md behind docs/INDEX.md and setup/INDEX.md without changing their prose. Task files, cards and release notes stay exempt because they are records.

**In scope**
- Release notes: each task id links to its archived task file at the release tag, and in issue mode to its issue as well.
- A 12,000-character ceiling for reference Markdown (`DOC_LIMIT`), a `markdown ceiling` doctor row and its selftest.
- Split `README.md` into `docs/using.md`, `docs/inside.md` and `docs/INDEX.md`.
- Split `SETUP.md` into `setup/3-skills.md`, `4-verify.md`, `5-baseline.md`, `6-report.md` and `setup/INDEX.md`.
- Align the `AGENTS.md` layout and both check tables.

**Out of scope**
- Rewriting the moved prose; the sections move verbatim.
- Linking commit hashes or changing issue state.
- Applying the ceiling to task files, change cards, release notes, `learnings.md` or `BACKLOG.md`.
- Moving the existing `v1.5.0` tag; a tag is never moved.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- 12,000 characters is the ceiling: about 3,000 tokens, just above the 10,000-character always-read cap, and low enough to split the only two offenders while leaving `AGENTS.seed.md` (8,954) headroom.
- Records stay exempt: task files, cards, release notes, `learnings.md` and `BACKLOG.md` are state, not pages read for guidance; splitting them would break their single-record rule.
- The issue map comes from `gh issue list --state all --limit 500 --json number,title`: a backfilled issue starts its title with the task id, a minted task is `TASK-<number>`. If `gh` fails, the note cuts without issue links.
- The task-file link comes from the card's `**Task:**` link, anchored at the release tag so it never drifts with the branch.
- `README.md` and `SETUP.md` keep their headings and a short summary per moved section, so `SETUP.md §N` references still resolve.

## Queue — requests that arrive while this task is open

Append each request here instead of opening a new task. A row is `queued`, becomes `in progress`
with its `TASK-N.M` id when work starts, and ends `done` or `dropped`.

| # | Request | Status | Subtask |
|---|---|---|---|

## Plan

1. Add the task-file and issue links to `release.mjs`, with the issue map from `gh`.
2. Add `DOC_LIMIT`, the `_behavior.md` clause, the `markdown ceiling` row and its selftest.
3. Split `README.md` and `SETUP.md` behind `docs/INDEX.md` and `setup/INDEX.md`.
4. Align the `AGENTS.md` layout and both check tables.
5. Close, split the commits by feature, cut v1.6.0 and update the published v1.5.0 page with links.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including the note-link assertion and the markdown ceiling failing then passing.
- `node .agent-kit/agent-kit.mjs doctor` → 0 failures, `markdown ceiling` PASS.
- A cut note in issue mode carries `[TASK-N](…/blob/vX.Y.Z/….md)` and `[issue #N](…/issues/N)`.

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
<!-- LOOP {"n":0,"fail":"","diff":"374898c2fd56e244","plan":"b388d77cfe9936ed"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The release note now links each task id to its archived task file and, in issue mode, to its issue, so a reader reaches the plan and the board from the note. Reference Markdown has a 12,000-character ceiling, enforced by the `markdown ceiling` doctor row and its selftest: past it, a doc becomes a folder with an `INDEX.md` and one file per section. `README.md` and `SETUP.md` were split behind `docs/` and `setup/` accordingly, with their prose unchanged; task files, change cards and release notes stay exempt because they are records.

**Docs updated** — `README.md`, `SETUP.md`, `docs/`, `setup/`, `AGENTS.md`, `.agent-kit/rules/_behavior.md`, `docs/using.md`, `setup/4-verify.md`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/lib/consts.mjs`
- `.agent-kit/lib/doctor/structure.mjs`
- `.agent-kit/lib/release.mjs`
- `.agent-kit/lib/selftest/release.mjs`
- `.agent-kit/lib/selftest/surface.mjs`
- `.agent-kit/rules/_behavior.md`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `docs/INDEX.md`
- `docs/inside.md`
- `docs/using.md`
- `setup/3-skills.md`
- `setup/4-verify.md`
- `setup/5-baseline.md`
- `setup/6-report.md`
- `setup/INDEX.md`
<!-- FILES:END -->
