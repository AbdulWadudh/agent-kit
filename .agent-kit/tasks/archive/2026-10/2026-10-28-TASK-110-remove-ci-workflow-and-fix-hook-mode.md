---
id: TASK-110
parent: ""
lane: QUICK
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 566d16ad97325d905a7f266cf4630711e883ac14
touches: [".agent-kit/", ".github/", "AGENTS.md", "SETUP.md"]
depends_on: []
type: removed  # added | changed | fixed | removed
summary: the CI workflow is gone, and the commit guard is executable on every clone
---
# TASK-110 — remove ci workflow and fix hook mode

## Scope (frozen once approved)

**Intent** — The owner: "Is it required? No., then remove it" for the GitHub workflow, and
"fix the chmod" for the hooks, which were committed `100644` and so never ran on Linux or macOS.

**In scope**
- Delete `.github/workflows/agent-kit.yml`, its `machinery` entry, and the doctor allow-list
  exception that existed only for it.
- The layout and CI lines in `AGENTS.md` and `SETUP.md` that would otherwise point at a gone file.
- Commit both hooks as `100755`, add a `hook mode` doctor row, and prove the row can fail and pass.

**Out of scope**
- What the hooks do, the commit message rule, and the loop itself.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- No CI: `task close` already runs the same suite, so the workflow's only unique value was a
  bare push that bypassed the loop — not worth a runner per push (`AGENTS.md`, owner's answer).
- The hook mode is read from git's index (`git ls-files -s`), not the filesystem, because Windows
  ignores the execute bit and would make the row fail everywhere.
- The row is `FAIL` when the guard is wired and `WARN` when it is not: an unwired guard loses
  nothing, and `doctor --strict` should not fail a repo that opted out.
- Both hooks are `100755` in the index, so a clone on Linux or macOS runs them without a chmod.

## Plan

1. Remove the workflow, its manifest entry and the allow-list exception.
2. `git update-index --chmod=+x` both hooks; add the `hook mode` row.
3. Prove the row in `selftest`, then update the two docs that name the command.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including `31. a hook git cannot execute is
  reported`, which asserts `WARN` before the chmod and `PASS` after it.
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0.
- `git ls-files -s .agent-kit/githooks` → `100755` for both hooks.

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
<!-- LOOP {"n":0,"fail":"","diff":"8e5ef7efc060f30c","plan":"3caf52fcc4c7ffc7"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — The GitHub workflow is gone: `task close` already runs the same gates, so it cost a
runner per push and bought nothing. The commit guard was committed `100644`, which git silently
skips on Linux and macOS, so both hooks are now `100755` and `doctor`'s `hook mode` row reports a
clone that lost the bit.

**Docs updated** — `AGENTS.md` (core rule 4 and the layout), `SETUP.md` (what setup copies, the
guard section), `.agent-kit/githooks/INDEX.md`.

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
- `.github/workflows/agent-kit.yml`
- `AGENTS.md`
- `SETUP.md`
<!-- FILES:END -->
