---
id: TASK-129
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 38f3393aa83ce7d41ede97a2c156d273aebdfd0a
touches: [".agent-kit/lib/github.mjs", ".agent-kit/lib/tasks/migrate.mjs", ".agent-kit/lib/tasks/issue.mjs", ".agent-kit/lib/tasks/index.mjs", ".agent-kit/lib/main.mjs", ".agent-kit/agent-kit.mjs", ".agent-kit/lib/selftest/issue.mjs", ".agent-kit/lib/selftest/migrate.mjs", ".agent-kit/lib/selftest/index.mjs", ".agent-kit/lib/INDEX.md", ".agent-kit/tasks/INDEX.md", ".agent-kit/templates/tasks-INDEX.seed.md", ".agent-kit/templates/AGENTS.seed.md", "SETUP.md", "README.md"]
depends_on: []
type: added  # added | changed | fixed | removed
summary: "Every task gets an issue — archived ones are backfilled, and a mint never lands on a taken id"
---
# TASK-129 — migrate archived tasks to issues

## Scope (frozen once approved)

**Intent** — the owner asked to move the whole history onto GitHub: "its ok you can migrate
everything to git issues too the tasks". The 27 archived tasks predate `ids: issue`, so nothing
was ever opened for them, and a future mint could land on one of their numbers.

**In scope**
- `task migrate [--dry-run]`: one closed issue per archived task, titled with its id, body from
  the task's change card; rerunnable, because the issue list is the record.
- `mintTask` refuses an issue number whose `TASK-N` is already on disk.
- Docs where a repo switches modes, selftest for both behaviours.

**Out of scope**
- Renumbering archived ids: history keeps its id (`renumber.mjs:41`), and release notes and
  commit messages already cite them.
- Labels, issue forms, a Projects board (B-12), rewriting old cards.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- Migrated title is `TASK-N — <card summary>`: the number cannot equal a frozen id, so the id
  must stay in the title for the mapping to be visible.
- Idempotency reads GitHub, not a state file: a title starting `TASK-N ` means that task has an
  issue. One home per fact — GitHub holds the mapping.
- `task migrate` works in either mode; it never changes an id. `publish` stays issue-mode only.

## Plan

1. `github.mjs`: `listIssues` — `state=all`, paginated, so a title match sees every issue.
2. `tasks/migrate.mjs`: join archived tasks to their cards (`entriesIn` + `cardNote`), skip ids
   already titled, create + close the rest; `--dry-run` prints titles offline.
3. `tasks/issue.mjs`: after the mint, refuse when `usedIds` already carries the number.
4. Wire it: `tasks/index.mjs`, `main.mjs`, the `agent-kit.mjs` usage block.
5. Docs: SETUP §5 switch, README, both `tasks/INDEX` copies, `AGENTS.seed.md`, `lib/INDEX.md`.
6. selftest: a fixture with archived tasks and a stub API proves create-once, closed state, the
   title/body shape, and the mint collision.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0; the new assertions fail before the change
  (no `migrate` command, no mint guard).
- `node .agent-kit/agent-kit.mjs doctor` → exit 0.
- `node .agent-kit/agent-kit.mjs task migrate --dry-run` in this repo → 27 titles, no writes.
- after close: `setup --ids issue`, `task migrate` → 28 closed issues (TASK-129 included).

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
<!-- LOOP {"n":0,"fail":"","diff":"f9e00a579a9c4bbb","plan":"378efb1ab8f000df"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — A repo that ran on local ids keeps its history when it switches: `task migrate` opens one closed issue per archived task, titled with its id and carrying the paragraph its close already wrote, and reads the issue list so a rerun adds nothing. `task new` now refuses an issue number an archived task already carries, naming both instead of writing a second file under one id.

**Docs updated** — SETUP §1.1, README (ids bullet and the FAQ row), both `tasks/INDEX` copies, `AGENTS.seed.md`, `lib/INDEX.md`, and the new `task migrate` usage line.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/lib/INDEX.md`
- `.agent-kit/lib/github.mjs`
- `.agent-kit/lib/main.mjs`
- `.agent-kit/lib/selftest/index.mjs`
- `.agent-kit/lib/selftest/issue.mjs`
- `.agent-kit/lib/tasks/index.mjs`
- `.agent-kit/lib/tasks/issue.mjs`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `README.md`
- `SETUP.md`
- `.agent-kit/lib/selftest/migrate.mjs`
- `.agent-kit/lib/tasks/migrate.mjs`
<!-- FILES:END -->
