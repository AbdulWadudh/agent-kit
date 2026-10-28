---
id: TASK-127
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 17d71166a76e3360131e11b2a316955fabb67b24
touches: [".agent-kit/lib/consts.mjs", ".agent-kit/lib/changelog.mjs", ".agent-kit/lib/sync.mjs", ".agent-kit/lib/tasks/start.mjs", ".agent-kit/lib/tasks/close.mjs", ".agent-kit/lib/doctor/history.mjs", ".agent-kit/lib/selftest/tasks.mjs", ".agent-kit/lib/INDEX.md", ".agent-kit/tasks/INDEX.md", ".agent-kit/logs/INDEX.md", ".agent-kit/templates/tasks-INDEX.seed.md", ".agent-kit/templates/logs-INDEX.seed.md", ".agent-kit/templates/AGENTS.seed.md", ".agent-kit/SKILL.md", "SETUP.md", "README.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: "A close writes two files, not four — the five newest closes are derived by `start`"
---
# TASK-127 — derive recent closes

## Scope (frozen once approved)

**Intent** — the owner counted the bookkeeping a one-line fix writes: "for small changes its
creating 4 to 5 files its gonna be very difficult when its scales". Two of those four are the
`RECENT` blocks that every close rewrites into `tasks/INDEX.md` and `logs/INDEX.md` — shared
files, so two collaborators closing at once conflict on them, which is the case issue mode
exists for.

**In scope**
- `start` prints the five newest closes, derived from the change cards at read time.
- `close` stops rewriting the two `RECENT` blocks; a close writes the task, the card and the
  `ACTIVE` block only.
- Upgraded repos: the first close retires an existing `RECENT` block (heading included) instead
  of leaving stale links behind.
- `doctor` drops the `recent lists` row — it checked a copy that no longer exists — and the
  selftest proves the replacement: `start` lists the close, and the block is gone.

**Out of scope**
- The `ACTIVE` block stays: it is the in-flight list a session reads without scanning `active/`,
  and it changes only while a task is open.
- The card and the archived task stay as they are; the split was settled in TASK-126's review.

**Decisions** — each with the pointer it rests on.
- Derive, do not store: a stored list is a second home for a fact the cards already hold, and
  every close pays to keep it true (owner 2026-10-28, "4 to 5 files … when its scales").
- `start` is the reader, not a new index: one command a session already runs (SKILL §1) gains
  the list; no file gains a section.
- Retire on close, not on pull: `pull` never rewrites authored files, and the block markers make
  the removal unambiguous (`<!-- RECENT:START -->`).

## Plan

1. `consts.mjs`: `RECENT_LISTS` → `RECENT_INDEXES` (two paths); `RECENT_LIMIT` stays.
2. `changelog.mjs`: drop `recentLines` / `refreshRecents`; add `retireRecent(base)`, and remove
   the now-dead `refreshRecents` call `pull` made after replacing a seed index.
3. `tasks/start.mjs`: print the five newest closes from `entriesIn` before the task section.
4. `tasks/close.mjs`: call `retireRecent` instead of `refreshRecents`.
5. `doctor/history.mjs`: remove 7b and its now-unused imports.
6. Indexes (live + seeds), `SKILL.md`, `SETUP.md` check table, `README.md`, `lib/INDEX.md`.
7. `selftest/tasks.mjs`: plant a `RECENT` block, close, assert it is gone and `start` lists it.

**Test plan** — command → expected; a new check also shows its failing run.
- Fixture with a planted `RECENT` block → close → the block and its heading are gone, and
  `start` prints `TASK-101` with the card's summary.
- No close → the block stays (nothing else rewrites an index).
- `doctor` on the fixture after a close → exit 0, no `recent lists` row in `--json`.
- `selftest` and `doctor --strict` exit 0.

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
<!-- LOOP {"n":0,"fail":"","diff":"321720cf47b9992d","plan":"1a9697821c8df751"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — A close now writes the task, the card and the `ACTIVE` block only: the two `RECENT` index rewrites are gone, and `start` derives the five newest closes from the cards at read time. A pre-TASK-127 install retires its `RECENT` block on the first close, and doctor's `recent lists` row is replaced by the selftest assertion that proves both halves.

**Docs updated** — `SKILL.md` §1 and the `start` rows in `AGENTS.seed.md` and `README.md` name the derived list; `SETUP.md`'s check table drops `recent lists`; both index seeds and the live indexes lose `## Recent`; `lib/INDEX.md` records `retireRecent`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/SKILL.md`
- `.agent-kit/lib/INDEX.md`
- `.agent-kit/lib/changelog.mjs`
- `.agent-kit/lib/consts.mjs`
- `.agent-kit/lib/doctor/history.mjs`
- `.agent-kit/lib/selftest/tasks.mjs`
- `.agent-kit/lib/sync.mjs`
- `.agent-kit/lib/tasks/close.mjs`
- `.agent-kit/lib/tasks/start.mjs`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/logs-INDEX.seed.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `README.md`
- `SETUP.md`
<!-- FILES:END -->
