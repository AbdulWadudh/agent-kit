---
id: TASK-128
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 8c96b649af4cf8335ab2fa0dfdb09efaa984d534
touches: [".agent-kit/agent-kit.mjs", ".agent-kit/lib/main.mjs", ".agent-kit/lib/tasks/open.mjs", ".agent-kit/lib/tasks/issue.mjs", ".agent-kit/lib/tasks/publish.mjs", ".agent-kit/lib/release.mjs", ".agent-kit/lib/selftest/issue.mjs", ".agent-kit/lib/selftest/release.mjs", ".agent-kit/lib/tasks/INDEX.md", ".agent-kit/lib/INDEX.md", ".agent-kit/rules/releases.md", ".agent-kit/SKILL.md", ".agent-kit/tasks/INDEX.md", ".agent-kit/templates/tasks-INDEX.seed.md", ".agent-kit/templates/AGENTS.seed.md", "README.md", "SETUP.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: "Issues open with a real title and body; release notes carry each card's paragraph"
---
# TASK-128 — readable issue and release

## Scope (frozen once approved)

**Intent** — the two artifacts the kit writes for people read like the tool talking to itself. A
task opened in `ids: issue` became "detail layouts #1", titled from the slug with a body explaining
`task publish`; the owner: "the issue creator should never generalize the title its like some newbie
has opened an issue you have the details everything you can create an issue with better title and
description". A release note is one clause per task — "the releases is not having much details its
not readable for human".

**In scope**
- `task new --summary "<one clause>"` writes the front-matter `summary:` and, in `ids: issue`, is
  the issue title. Minting without it refuses with the usage line and sends no request.
- `task new --intent "<paragraph>"` seeds the task's Intent block and is the minted issue's body;
  without it the body is the summary.
- The minted body carries the work, not agent-kit: the "Opened from agent-kit …" text is gone.
- `task publish` and `task close --sync` patch the issue title from `fm.summary`, so a summary
  sharpened during planning is the title at G1 and at close.
- A release entry is the summary as a bold line, then the card's `## What changed` paragraph — the
  prose the close already wrote, not a second text. The line names the commit that shipped the
  task (`TASK-127 · 544f2dc`), read from `git log` on the card; a card that is not committed yet
  is named in the command's output so the note is not shipped without its pointer.
- Usage text, `SKILL.md` §3, the `task new` rows, the issue-mode docs and the README release
  paragraph describe both; selftest 28 and 36 prove them.

**Out of scope**
- Labels, issue forms and the board (parked B-12); `--from` import keeps reading the issue as it is.
- Rewriting a note already released: v1.3.0's tag carries its text, and a tag is never moved.
- Validating summary length at mint: close already caps it at `ENTRY_LIMIT`.

**Decisions**
- Title = the front-matter summary, not a second field: one fact with two readers, so a rename
  during planning is paid once (owner 2026-10-28, "you have the details").
- `--summary` is required by the mint, not by the file: a local repo still opens from a slug alone,
  because nobody there reads an issue.
- Body = intent at open, plan at G1: the mint says what the agent already knows, and `publish`
  already replaces the whole body (`tasks/publish.mjs:9`).
- The release reuses the card's paragraph instead of asking for a second summary, for the same
  reason the commit body reuses the Close-out Summary: the card is the home.
- No card links in the note: a relative path resolves in the repo file but not in a `gh release
  create` body, and a full URL would hard-code one remote.

## Plan

1. `agent-kit.mjs` header and the `task new` usage line: `[--summary "<one clause>"]`
   `[--intent "<paragraph>"]`; `main.mjs` passes both through.
2. `tasks/open.mjs`: seed `summary:` and the Intent block from the flags; heading stays the slug.
3. `tasks/issue.mjs`: `mintTask(base, { summary, intent })` sends `title: summary`,
   `body: intent || summary`; `cmdTaskNew` refuses issue mode without `--summary` (return 1, no POST).
4. `tasks/publish.mjs`: `patchIssue({ title: fm.summary, body })` in `cmdTaskPublish` and in
   `syncAfterClose`.
5. `release.mjs`: `unreleasedChanges` also returns the card's `## What changed` paragraph and the
   short SHA of the commit that last touched it; each entry is `**<summary>** (<id> · <sha>)`, then
   that paragraph. Cards with no commit are listed after the note is written.
6. Docs: `SKILL.md` §3, the `task new` row in `tasks/INDEX.md` and its seed, the issue bullet in
   `templates/tasks-INDEX.seed.md`, the kit rows in `templates/AGENTS.seed.md`, the release
   paragraph in `README.md`, `SETUP.md` §5, the `release.mjs` row in `lib/INDEX.md`.
7. `selftest/issue.mjs`: title/body assertions, the no-summary refusal, and the title on publish
   and on close --sync.
8. `selftest/release.mjs`: assert the bold summary line and the card's paragraph replace the
   one-line bullet.

**Test plan** — command → expected; a new check also shows its failing run.
- Fixture `ids: issue`, `task new` with `--summary` and `--intent` → the POST's `title` is the
  summary, `body` is the intent, and neither mentions agent-kit.
- `task new` without `--summary` in issue mode → exit 1, no POST, no task file.
- Edit the task's summary, `task publish` → the PATCH carries `title` = that summary.
- `task close --sync` → the PATCH carries `title` = the summary and `state: closed`.
- Release fixture → the note holds `**fixture change** (TASK-101 · <sha>)` and the card's paragraph
  "The fixture changed one file…", and no `- fixture change (TASK-101)` line; `<sha>` is the commit
  the card was committed in.
- Failing runs: with the mint left on the slug title, the title assertion fails; with the release
  left on one line, the paragraph assertion fails.
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
<!-- LOOP {"n":0,"fail":"","diff":"cf9afda34d21093b","plan":"dd0163cb83123302"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — A task opened in `ids: issue` now carries the work into its issue: `--summary` is the title and the card's, `--intent` is the body, and publish and close keep the title in step with the summary. A release note quotes each card's `## What changed` paragraph under a bold title with the commit that shipped it, so the note reads as prose and points at the code instead of repeating a clause no reader can act on.

**Docs updated** — `SKILL.md` §3, the `task new` rows in `tasks/INDEX.md` and its seed, the issue bullet in `tasks-INDEX.seed.md`, the kit row in `AGENTS.seed.md`, `README.md` (task ids and the release paragraph), `SETUP.md` §5, `rules/releases.md`, and the `release.mjs` row in `lib/INDEX.md`.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/SKILL.md`
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/lib/INDEX.md`
- `.agent-kit/lib/main.mjs`
- `.agent-kit/lib/release.mjs`
- `.agent-kit/lib/selftest/issue.mjs`
- `.agent-kit/lib/selftest/release.mjs`
- `.agent-kit/lib/tasks/issue.mjs`
- `.agent-kit/lib/tasks/open.mjs`
- `.agent-kit/lib/tasks/publish.mjs`
- `.agent-kit/rules/releases.md`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `README.md`
- `SETUP.md`
<!-- FILES:END -->
