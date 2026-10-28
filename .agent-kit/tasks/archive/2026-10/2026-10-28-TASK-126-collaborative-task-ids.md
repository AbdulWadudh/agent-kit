---
id: TASK-126
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: f1b3cd0a902d6dcf30614ead9185d3ccb83bcd68
touches: [".agent-kit/lib/taskfile.mjs", ".agent-kit/lib/tasks/**", ".agent-kit/lib/github.mjs", ".agent-kit/lib/env.mjs", ".agent-kit/lib/setup.mjs", ".agent-kit/lib/project.mjs", ".agent-kit/lib/doctor/structure.mjs", ".agent-kit/lib/doctor/tasks.mjs", ".agent-kit/lib/selftest/**", ".agent-kit/lib/main.mjs", ".agent-kit/lib/INDEX.md", ".agent-kit/agent-kit.mjs", ".agent-kit/sync-manifest.json", ".agent-kit/tasks/.counter", ".agent-kit/tasks/INDEX.md", ".agent-kit/tasks/BACKLOG.md", ".agent-kit/templates/tasks-INDEX.seed.md", ".agent-kit/templates/AGENTS.seed.md", ".agent-kit/SKILL.md", ".agent-kit/project.md", "AGENTS.md", "SETUP.md", "README.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: "One allocator per repo — offline by default, the issue number on request"
---
# TASK-126 — collaborative task ids

## Scope (frozen once approved)

**Intent** — several people opening tasks at the same time must not mint the same id. The owner's
rule (2026-10-28): each repo has **one** id source, chosen at setup. Work stays offline unless the
owner opts into GitHub; when they do, the task id *is* the issue number — "TASK-126 is what issue
gives, i don't want two different things inside".

**In scope**
- `setup --ids local|issue`, default `local`, recorded as `| ids | … |` under `## Tasks` in
  `.agent-kit/project.md` (`owned`, so `pull` never resets it). Re-running setup with a different
  value is refused while any task is open, because two sequences would collide (`#131` and
  `TASK-131`).
- `ids: local` — `nextId` derives `1 + max(id)` over `tasks/active/`, `tasks/archive/` and the
  change cards in `logs/`, floor 100. `.counter` is deleted, pruned from the manifest, and named
  nowhere. Allocation is a read of the checkout: the merge is the only serialization point.
- `task renumber <old> <new>` / `--next` (local only): rewrites the id, the filename, a parent's
  children (`parent:` and dotted ids), `depends_on` references, then refreshes the index. Archived
  ids are history and are refused.
- `ids: issue` — `task new` mints `POST /repos/{o}/{r}/issues` and takes `number` as the id;
  `--from <n>` imports an existing issue; `task publish` sends the approved plan; `task close
  --sync` closes the issue with the change card's summary. Every other path stays offline.
- Credential order (owner 2026-10-28): `gh auth token` first — the recommended path — then
  `GH_TOKEN`, then `GITHUB_TOKEN`. One REST transport over `fetch`; `GITHUB_API_URL` as the base
  (GHES, and the selftest seam).
- `setup` validates the credential once over the network in issue mode (`GET /repos/{o}/{r}` →
  access + `has_issues`) and dies with both fixes on 401/403. It is the only eager auth check.
- Prerequisites become a gate (owner 2026-10-28, "make it mandatory"): one `env.mjs` list —
  runtime (Node 18+ or Bun), git, `rtk`; GitHub access only in issue mode — read by a `doctor` row
  `prerequisites` and by `setup` before it copies. The `token saver` WARN folds into it.
- `doctor` rows: `task ids` (the mode is `local` or `issue`) and `task ids unique` (active +
  archive task files; and change cards; plus id/filename agreement).
- Docs: `SETUP.md` prerequisites table, check rows, `--ids`; `README.md` prompt question;
  `AGENTS.md` layout; `tasks/INDEX.md` + seed; `project.md`; `SKILL.md`; both module indexes.
- `selftest`: derive, stale counter ignored, duplicate → renumber → pass, parent renumber with
  children, bad mode, switch refusal, `setup --ids issue` with a stubbed `fetch`, mint / `--from` /
  401 / publish with the stub, and "local mode never calls the network".

**Out of scope**
- Per-open override. Mixing allocators collides; the mode is per repo.
- `release --publish` and labels/assignees/projects. Parked with the rest of the projection work.
- A non-GitHub host. `--from` and `BACKLOG.md` are the manual paths until one is real.
- Changing the dotted-subtask scheme; `nextChildId` is unchanged.

**Decisions** — each with the pointer it rests on.
- One task, not a parent/child split: `task close` diffs `baseline..HEAD` plus the dirty tree, so
  a child would answer for the parent's uncommitted files (close.mjs:100-126). One delivery, one
  change card.
- Mode is per repo, not per task: a repo that mixes a local `TASK-131` with issue `#131` cannot
  answer "which is 131" (owner 2026-10-28).
- `local` is the default and allocates from files, so the default path writes no shared cell and
  calls no network (owner 2026-10-28, "let everything be offline").
- The id is minted once, at open. Only `task new`, `task publish` and `close --sync` reach the
  host; no gate, `close` (without `--sync`) or `selftest` does.
- `gh` is the preferred credential, not a second transport: `gh issue create` has no `--json`
  (gh 2.100.0), so driving it would mean parsing a URL. One REST path is testable in one place.
- Credential **presence** is the gate; validity is lazy (`task new`, publish) except in `setup`,
  which checks it once — a gate that called the network could not run in CI (owner 2026-10-28).
- The token is read into memory, sent in the `Authorization` header, and never printed, logged,
  written or put in an error. It is not exported to the commands `verify`/`close` run, because a
  target's own suite may legitimately use `GH_TOKEN`.
- ids floor at 101 so every existing repo (101-126) and every recorded example keeps meaning.
- `rtk` moves WARN → FAIL (owner 2026-10-28, "mandatory"); `--no-rtk` stays as a seam for a
  machine that already has it.

## Plan

1. `taskfile.mjs`: `idsMode`, `ID_MODES`, `usedIds`, `nextId` derived; drop the counter read/write.
2. `tasks/renumber.mjs` + dispatch/usage: `task renumber <old> <new>|--next`.
3. `github.mjs`: `credential`, `repoSlug`, `api`, `mintIssue`, `fetchIssue`, `patchIssue`,
   `commentIssue`; `env.mjs`: `prerequisites` and the GitHub item for issue mode.
4. `doctor/tasks.mjs`: `task ids`, `task ids unique`; `doctor/structure.mjs`: `prerequisites`
   replacing `token saver`.
5. `project.mjs` + `setup.mjs`: the `## Tasks` section, `--ids`, the switch refusal, the preflight
   and the one validation call; manifest `owned`/`prune`; delete `.counter`.
6. `tasks/open.mjs` + `tasks/publish.mjs` + `tasks/close.mjs`: mint, `--from`, `task publish`,
   `close --sync`; `main.mjs` awaits a promise-returning command.
7. `selftest/ids.mjs` + `rtk` shim + `family.mjs` counter assertions.
8. Docs: SETUP.md, README.md, AGENTS.md, both INDEX files, the seeds, SKILL.md, project.md.
9. `selftest`, `doctor --strict`, close.

**Test plan** — command → expected; a new check also shows its failing run.
- Empty fixture → first id is `TASK-101`; after 101 is archived, the next is 102 and no
  `.counter` exists.
- `.counter` holding `5` → the next id is still one past the highest id (the file is ignored).
- Two active files with `id: TASK-1xx` → `doctor` `task ids unique` FAIL naming both; `task
  renumber <dup> --next` → PASS, and the filename carries the new id.
- Rename a parent with one child → the child's id, `parent:` and filename follow; `doctor` PASS.
- `| ids | banana |` → `task ids` FAIL; `local` → PASS.
- `setup --ids issue` with a task open → the installed CLI exits 1 and `project.md` still says
  `local`; with none open → the file says `issue`.
- Stubbed `fetch` returning `{number:131}` → `task new demo` writes `…-TASK-131-demo.md`; the
  request is `POST <base>/repos/o/r/issues` with the credential in `Authorization`.
- `--from 131` twice → the second exits 1 naming the file; a free number creates the file with no
  POST.
- Stub returns 401 → the command exits 1 with the fix line and no token in stdout/stderr.
- `task publish` → one `PATCH …/issues/{n}` carrying the plan; `close --sync` → `PATCH state=closed`
  plus one comment.
- Local mode with a stubbed `fetch` that throws → every command still exits 0 (no call attempted).
- `PATH` with no `git`/`rtk` → `prerequisites` FAIL naming them; the shimmed fixture → PASS.
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
<!-- LOOP {"n":0,"fail":"","diff":"b48014bcb5cf56d5","plan":"c00039e8ecee8462"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — A repo now has one id source, recorded as a row in `project.md`. `setup --ids
local` keeps the kit offline: `task new` takes the next number on disk and `task renumber` moves
a collided id after a merge. `setup --ids issue` mints the GitHub issue at open and uses its
number as the task id, so `TASK-131` and `#131` are the same thing; `task publish` sends the
approved plan, `task close --sync` closes the issue with the final record, and `--from <n>`
imports one a teammate opened. Prerequisites — runtime, git, `rtk`, and the credential in issue
mode — are now a FAIL-level row that `setup` cannot pass over.

**Docs updated** — `SETUP.md` (§1 `--ids`, §1.1 id modes, §1.2 prerequisites, §4 rows, §5
issue mode), `README.md` (sixth question, `--ids`, id bullets, daily-use rows), `AGENTS.md`,
`.agent-kit/SKILL.md`, `.agent-kit/tasks/INDEX.md` + seed, `templates/AGENTS.seed.md`,
`.agent-kit/project.md` (`## Tasks`), the three module indexes and the usage header.

**Follow-ups** — release publishing and the GitHub projection (B-12) stay parked.

<!-- FILES:START -->
- `.agent-kit/SKILL.md`
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/lib/INDEX.md`
- `.agent-kit/lib/doctor/structure.mjs`
- `.agent-kit/lib/doctor/tasks.mjs`
- `.agent-kit/lib/env.mjs`
- `.agent-kit/lib/main.mjs`
- `.agent-kit/lib/project.mjs`
- `.agent-kit/lib/selftest/INDEX.md`
- `.agent-kit/lib/selftest/family.mjs`
- `.agent-kit/lib/selftest/index.mjs`
- `.agent-kit/lib/setup.mjs`
- `.agent-kit/lib/taskfile.mjs`
- `.agent-kit/lib/tasks/INDEX.md`
- `.agent-kit/lib/tasks/close.mjs`
- `.agent-kit/lib/tasks/index.mjs`
- `.agent-kit/lib/tasks/open.mjs`
- `.agent-kit/project.md`
- `.agent-kit/sync-manifest.json`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `.agent-kit/lib/github.mjs`
- `.agent-kit/lib/selftest/ids.mjs`
- `.agent-kit/lib/selftest/issue.mjs`
- `.agent-kit/lib/tasks/issue.mjs`
- `.agent-kit/lib/tasks/publish.mjs`
- `.agent-kit/lib/tasks/renumber.mjs`
- `.agent-kit/lib/tasks/show.mjs`
<!-- FILES:END -->
