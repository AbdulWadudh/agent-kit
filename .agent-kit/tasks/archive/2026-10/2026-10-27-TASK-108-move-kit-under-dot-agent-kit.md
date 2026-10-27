---
id: TASK-108
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-27
created: 2026-10-27
baseline: 47e1a6a3669c7184f1eac8f6d919e0298916bd0f
touches: [".agents/", ".githooks/", ".agent-kit/", ".github/workflows/agent-kit.yml", ".gitignore", "AGENTS.md", "CLAUDE.md", "README.md", "SETUP.md", "docs/", "examples/", "SKILL.md", "scripts/"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: every installed path lives under .agent-kit, except the three a harness pins to a fixed location
---
# TASK-108 — move kit under dot agent kit

## Scope (frozen once approved)

**Intent** — The owner: rename the kit's folder to a unique name and move everything the kit
installs or bootstraps under it, except the harness skill pointers and the root entry file.

**In scope**
- `.agents/` → `.agent-kit/`, `SKILL.md` → `.agent-kit/SKILL.md`, `scripts/agent-kit.mjs` →
  `.agent-kit/agent-kit.mjs`, `docs/` → `.agent-kit/docs/`, `.githooks/` → `.agent-kit/githooks/`.
- Every path reference in the entry point, `SETUP.md`, `README.md`, seeds, rules, templates,
  logs, tasks and the example, so no pointer names a path that moved.
- A manifest-integrity row in `doctor`: an install path outside `.agent-kit/` fails, unless it
  is `AGENTS.md`, `CLAUDE.md` or `.github/workflows/agent-kit.yml`.
- `doctor`'s write-set collision row counts only cards that can be worked: a `BLOCKED` card
  holds no write set. A selftest scenario proves two workable cards still fail.

**Out of scope**
- What the loop does; the skill pointers' content; a release for this change.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- The three exceptions stay put because each harness resolves them at a fixed path: Claude Code
  reads `CLAUDE.md` at root, GitHub runs only `.github/workflows/`, and `AGENTS.md` is the entry
  point the agent opens first.
- `agent-kit.mjs` sits one level under the root, so `SCRIPT_ROOT` (`path.resolve(scriptDir, "..")`,
  `agent-kit.mjs:41`) still resolves to the repo root and no path constant changed.
- Harness skill files stay pointers, never copies: a copy drifts on the first edit, and doctor's
  `skill pointers` row fails one (`agent-kit.mjs:1164`).
- The manifest-integrity row is skipped for the template itself (`template.json` `role: template`),
  because the template legitimately owns the paths it ships.
- A blocked card is parked, not in flight: the owner must answer before it can be edited, and
  `task resume` refuses while another task is in progress (`agent-kit.mjs:2333`), so its write
  set can never overlap a working one.

## Plan

1. `git mv` each folder, then update every reference found by grep.
2. Add the manifest-integrity check and a selftest scenario that proves it fails.
3. Run the gates, install into a throwaway repo, and confirm the target root holds only the four
   allowed entries.
4. Skip `BLOCKED` cards in the collision row and prove both directions in `selftest`.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including `doctor fails an install path
  outside .agent-kit` (the failing run is the scenario itself).
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0.
- `git grep "\.agents"` → no match.
- `selftest` → `doctor fails two workable tasks that claim one file` and `doctor drops a blocked
  task's write set` both print `ok`.

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
<!-- LOOP {"n":0,"fail":"","diff":"740c4996c75b6626","plan":"8ad8c633ee8ca4cd"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The kit's install surface is now one folder. Everything it installs lives under
`.agent-kit/`; the only paths outside are the three a harness resolves at a fixed location
(`AGENTS.md`, `CLAUDE.md`, `.github/workflows/agent-kit.yml`). `doctor` now refuses a manifest
entry outside `.agent-kit/`, so the folder cannot drift back out. The write-set collision row now
skips a blocked card, because a parked task cannot be edited; `selftest` proves two workable
cards still fail.

**Docs updated** — `AGENTS.md`, `SETUP.md`, `README.md`, `CLAUDE.md`, `.agent-kit/INDEX.md`, the
seeds and the example, all by path.

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/INDEX.md`
- `.agent-kit/SKILL.md`
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/docs/API_SKELETON.md`
- `.agent-kit/docs/ARCH_MAP.md`
- `.agent-kit/docs/ENTRY_POINTS.md`
- `.agent-kit/docs/INDEX.md`
- `.agent-kit/githooks/INDEX.md`
- `.agent-kit/githooks/commit-msg`
- `.agent-kit/githooks/pre-commit`
- `.agent-kit/project.md`
- `.agent-kit/rules/INDEX.md`
- `.agent-kit/rules/_behavior.md`
- `.agent-kit/rules/anti-patterns.md`
- `.agent-kit/rules/commits.md`
- `.agent-kit/rules/learnings.md`
- `.agent-kit/sync-manifest.json`
- `.agent-kit/template.json`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/CLAUDE.seed.md`
- `.agent-kit/templates/INDEX.md`
- `.agent-kit/templates/backlog.seed.md`
- `.agent-kit/templates/docs-populate.md`
- `.agent-kit/templates/learnings.seed.md`
- `.agent-kit/templates/logs-INDEX.seed.md`
- `.agent-kit/templates/rule-examples/INDEX.md`
- `.agent-kit/templates/rule-examples/api.md`
- `.agent-kit/templates/rule-examples/biome.md`
- `.agent-kit/templates/rule-examples/bun.md`
- `.agent-kit/templates/rule-examples/config.md`
- `.agent-kit/templates/rule-examples/database.md`
- `.agent-kit/templates/rule-examples/docs-lookup.md`
- `.agent-kit/templates/rule-examples/typescript.md`
- `.agent-kit/templates/task.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `.agents/sync-manifest.json`
- `.agents/tasks/.counter`
- `.agents/templates/CLAUDE.seed.md`
- `.github/workflows/agent-kit.yml`
- `.gitignore`
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `SETUP.md`
- `examples/INDEX.md`
- `examples/minimal/.agent-kit/project.md`
- `examples/minimal/AGENTS.md`
- `examples/minimal/README.md`
- `scripts/INDEX.md`
<!-- FILES:END -->
