---
id: TASK-120
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 07cb0af1bd0a42a68d969a12711bdf56768b59e2
touches: [".agent-kit/agent-kit.mjs", ".agent-kit/templates/AGENTS.seed.md", ".agent-kit/prompts/upgrade.md", ".agent-kit/rules/releases.md", ".agent-kit/tasks/BACKLOG.md", "SETUP.md", "README.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: an install follows a release tag, so it never receives unreleased commits and can pick its version
---
# TASK-120 — tag based install

## Scope (frozen once approved)

**Intent** — The owner: "we need to track and make the agent-kit tempaltes and the release a tag
based so any one can chose from which tag and version they want to install and use". Approved in
chat, with the four answers: default = newest tag, `check` compares at the tracked ref, no
unreleased commit is received, and the one existing install may migrate.

**In scope**
- `--ref <tag>` on `setup`, `check` and `pull`, cloned with `--depth 1 --branch <ref>`.
- `template.json` gains `ref`, `release`, `commit`; a `release` row in `check` (`CURRENT`,
  `BEHIND`, `UNPINNED`, `AHEAD`).
- The one existing unpinned install migrates on its next `pull`, which pins the newest tag.
- `release` prints the tag command; the docs that name the install or upgrade path.

**Out of scope**
- An npm package. `B-10` records the shim shape and why it waits (`BACKLOG.md`).
- A `doctor` row for an unpinned install: the owner's answer was that no unreleased commit should
  be received, so the resolution (`sourceFor`) refuses a branch by default instead of warning.
- A version history listing. `check` names the newest tag; another version is chosen with
  `--ref` or read from `git ls-remote --tags`.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- Default ref is the newest tag, not the branch tip, because an install must not receive
  unreleased commits (owner's answers 1 and 3).
- Pinning applies only to a remote spec. A local path source is a working tree whose HEAD is the
  truth, so `resolveSpec` returns `ref: null` there (`agent-kit.mjs`, `resolveSpec`) and the
  existing fixture scenarios are unchanged.
- The `release` row is added in `cmdCheck`, not in `computeSync`: `cmdPull` iterates the sync rows
  as files and would try to copy a row named `release` (`agent-kit.mjs`, `cmdPull`).
- `check` reports `UNPINNED` rather than failing silently, and `pull` writes the pin, which is the
  migration path (owner's answer 4).
- `pull --dry-run` needs the same `--ref` as the pull, or the diff is against the tag already
  installed and is empty (`.agent-kit/prompts/upgrade.md`, step 2).
- The scenario pulls through `main`, not the function: the first run of this change forgot to
  forward `--ref` in the CLI `pull` case and the smoke test found it, so the gate now covers it.
- `release` still runs no git; it prints `git tag -a … && git push origin …` before the
  `gh release create` line (`.agent-kit/rules/releases.md`, "Publish").

## Plan

1. Resolve a spec at a ref; record the pin in `template.json` on setup and pull.
2. Add the `release` row to `check`, and the tag line to `release`.
3. Prove it in `selftest` 33, then update the install and upgrade docs.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs selftest` → exit 0, including `33. an install pins a release tag
  and ignores unreleased commits` (five assertions; the first run failed on the CRLF fixture, the
  second on the missing `--ref` in the CLI `pull` case, both fixed).
- `node .agent-kit/agent-kit.mjs doctor --strict` → exit 0.
- End-to-end in a scratch repo with a bare source: `setup --ref v1.0.0` → `check` IN SYNC with an
  unreleased commit upstream; tag `v1.0.1` → `BEHIND … pull --ref v1.0.1`; `pull --ref v1.0.1`
  → `Pinned v1.0.1 (was v1.0.0)`, check IN SYNC.

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
<!-- LOOP {"n":0,"fail":"","diff":"1f07e3cb8a4e2b04","plan":"d518edc0c5671c38"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — An install now follows a release tag instead of a branch: `setup --ref v1.0.0`
clones that tag (omitting it takes the newest), `template.json` records `ref`, `release` and
`commit`, `check` gains a `release` row (`BEHIND v1.0.1 - pull --ref v1.0.1`, `UNPINNED` for an
install still on a branch), and `pull --ref` moves it. Unreleased commits are invisible to
`check`, which is the point: a version is a tag. The one existing install migrates on its next
pull. `release` now prints the tag command, because the tag is what makes a release installable.

**Docs updated** — `SETUP.md` (install, upgrade), `README.md` (Staying current, check row),
`.agent-kit/templates/AGENTS.seed.md` (command row), `.agent-kit/prompts/upgrade.md`,
`.agent-kit/rules/releases.md`, `.agent-kit/tasks/BACKLOG.md` (`B-10`, npm).

**Follow-ups** — cutting `v1.0.1` and tagging it is the owner's call; until a tag exists, `--ref`
has nothing to resolve and `setup` falls back to the branch exactly as before.

<!-- FILES:START -->
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/prompts/upgrade.md`
- `.agent-kit/rules/releases.md`
- `.agent-kit/templates/AGENTS.seed.md`
- `README.md`
- `SETUP.md`
<!-- FILES:END -->
