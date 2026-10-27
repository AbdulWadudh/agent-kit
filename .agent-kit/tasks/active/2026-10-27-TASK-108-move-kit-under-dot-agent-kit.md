---
id: TASK-108
parent: ""
lane: PLANNED
status: IN_PROGRESS
created: 2026-10-27
baseline: 47e1a6a3669c7184f1eac8f6d919e0298916bd0f
touches: [".agent-kit/", ".github/workflows/agent-kit.yml", ".gitignore", "AGENTS.md", "CLAUDE.md", "README.md", "SETUP.md", "examples/", "scripts/INDEX.md"]
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

## Plan

1. `git mv` each folder, then update every reference found by grep.
2. Add the manifest-integrity check and a selftest scenario that proves it fails.
3. Run the gates, install into a throwaway repo, and confirm the target root holds only the four
   allowed entries.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including `doctor fails an install path
  outside .agent-kit` (the failing run is the scenario itself).
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0.
- `git grep "\.agents"` → no match.

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
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 1 | 1 |
<!-- LOOP {"n":1,"fail":"lint","diff":"f72e295a7d4b8cc6","plan":"a91b84c044edfa5a"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The kit's install surface is now one folder. Everything it installs lives under
`.agent-kit/`; the only paths outside are the three a harness resolves at a fixed location
(`AGENTS.md`, `CLAUDE.md`, `.github/workflows/agent-kit.yml`). `doctor` now refuses a manifest
entry outside `.agent-kit/`, so the folder cannot drift back out.

**Docs updated** — `AGENTS.md`, `SETUP.md`, `README.md`, `CLAUDE.md`, `.agent-kit/INDEX.md`, the
seeds and the example, all by path.

**Follow-ups** — none

<!-- FILES:START -->
<!-- FILES:END -->
