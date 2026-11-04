# Spec: Merge k79-agent-skills into agent-kit

## 1. Goal & Expected Output

**Objective:** One product, one loop, one guard, one ledger. agent-kit keeps its install surface, task loop, `doctor`/`selftest` gates and release-tag model; the nine `k79-*` skills are re-homed as on-demand rules, rule examples, prompts and executable checks. The duplicate k79 machinery is retired.

**Two preferences are first-class, not optional:** **code structure and splitting** (250 target / 300 hard, split by responsibility, 8 files per folder, no feature barrels, one-way imports) and **verification** (mirrored tests, 1:2 happy-to-breaking, adversarial boundaries, no mocks in `helpers/`). They are rule files with `doctor` rows and `selftest` cases, not advice buried in an example.

**Preservation is the bar, not compression:** every k79 rule has an ID, a destination and a status in `specs/k79-rule-map.md`. A rule is retired only with a written reason. No k79 file is deleted until the map passes the G2 review line by line.

**Inputs (locked):** `AbdulWadudh/agent-kit` at `v1.7.0` (installer/product) and `AbdulWadudh/k79-agent-skills` at `2.4.7` (knowledge pack, 9 skills, 48,096 characters).

**Expected output:** an installed repo gets agent-kit's loop plus the k79 engineering rules that are true for its stack; `doctor --strict` exits 0, `selftest` exits 0, and no k79 skill, script or changelog ledger is installed. This suite repo keeps its own history; the merge lands in agent-kit as **v2.0.0** because the install surface changes.

**Non-negotiable from agent-kit:** one entry point (`.agent-kit/agent-kit.mjs`), zero dependencies, Node 18+/Bun parity, one home per fact, every new gate has a `selftest` case that can fail.

## 2. Locked Decisions

| # | Decision | Choice |
| :--- | :--- | :--- |
| 1 | Direction | agent-kit absorbs k79. k79 becomes content, not a parallel install. |
| 2 | Commit message gate | Advisory by default (warn, exit 0); blocks with `K79_GUARD=strict` or when the caller asks. File cap and task scope always block. |
| 3 | Durable specs | No `specs/` in the product. A contract change is a PLANNED task whose plan carries the acceptance criteria. |
| 4 | Changelog/release | agent-kit wins: `.agent-kit/logs/` cards, `releases/`, tags, `release` command. k79's `changelog/` and `release-notes.mjs` are deleted. |
| 5 | Distribution | agent-kit's copy + pointer model wins. The `skills` CLI remains only for optional third-party skills (prompt-master, caveman, ponytail, anthropic, agent-browser). |
| 6 | Rule budget | k79 text is compressed or moved behind an index. The four always-on caps get one bounded raise (+7.8% total, Phase 0) to make room for the new rule rows; nothing is pasted whole. |
| 7 | Repo identity | Product stays `agent-kit`. A rename to `k79-agent-kit` is a separate decision, not part of this merge. |
| 8 | Quality bar | Code structure/splitting and verification are mandatory rule files with executable checks. They are loaded before creating/splitting files and before writing tests, not only when a task asks. |
| 9 | Invocation | Every file in `.agent-kit/skills/` is a skill. Every id carries the `k79-` prefix so it cannot collide. `agent-kit prompt <job>` works in any harness; `agent-kit skills install` publishes all of them into the project's `.agents/skills`, never globally (the skills are repo-bound by their first line); `agent-kit wire` writes optional native `/<job>` and `@<job>` pointers. No universal registry is assumed. |
| 10 | State model | The archived task is the only per-task record: no `logs/`, no change cards. `release` derives the note from archived tasks and claims task ids. The baseline is the commit SHA in front matter; there is no baseline table or baseline run. |

## 3. Content Disposition

Every k79 rule gets an ID and a destination in [`k79-rule-map.md`](k79-rule-map.md). The table below is the skill-level summary; the map is the authority. Nothing is dropped because it did not fit a paragraph.

| k79 skill | Disposition | Destination |
| :--- | :--- | :--- |
| `k79-conductor` | Merge; two rules retire | C-1..C-8 map to `SKILL.md`, `_behavior.md`, `rules/INDEX.md` and `skills/k79-task-brief.md`; C-2 and C-9 retire to `check`/`pull`/tags. |
| `k79-spec-driven` | Merge; two rules retire | S-1..S-8 map to G1, `templates/task.md`, the evidence table, `learnings.md` and `anti-patterns.md`; S-3 and S-4 retire because agent-kit's task file replaces the artifact. |
| `k79-code-structure` | **First-class rule + checks** | `rules/code-structure.md`, loaded before creating, moving or splitting any file: target 250 / hard 300 lines, split by responsibility (helpers/queries/actions), folder density 8, no feature barrels, verb-first naming, one-way imports. `doctor`: source ceiling, density, barrels. |
| `k79-evidence-and-simplicity` | Merge, keep the 2-strike | ES-1..ES-7 fold into `_behavior.md` §1/§8/§11/§12 and `anti-patterns.md`; ES-8..ES-10 are kept as the 2-strike and report rules. |
| `k79-config-and-security` | Rule examples | Expand `templates/rule-examples/config.md`; add `security.md` (secrets, 3-tier config, auth/cache scoping, idempotency). |
| `k79-performance-and-db` | Rule examples | Expand `templates/rule-examples/database.md`; add `performance.md` (N+1, pagination, transactions, timeouts). |
| `k79-verification-testing` | **First-class rule + checks** | `rules/verification.md`, loaded before writing or changing tests: mirrored `tests/`, 1:2 happy-to-breaking, adversarial boundaries, no mocks in `helpers/`, criterion-to-test traceability. Add `templates/rule-examples/testing.md`; `doctor` checks test mirroring where a test root is declared. |
| `k79-logging-errors-git` | Split three ways | Errors/logging → `rules/errors.md`; commits → `rules/commits.md` + the guard; changelog/release → deleted, agent-kit's wins. |
| `k79-prompt-craft` | Keep | PC-1..PC-3 become `skills/k79-task-brief.md`; prompt-master stays an optional installed skill, not a replacement for the kit's own procedure. |

k79 machinery: `release-notes.mjs`, `sync-agents.mjs`, `list-skills.mjs`, `validate-skills.mjs`, `release.mjs`, `VERSION`, `changelog/`, `release-notes/` → **superseded**; their rules survive as LEG-9..12. `commit-guard/plan/install-hooks` → **merge** into `lib/guard.mjs` and `githooks/`. `k79-reminder.mjs` / `opencode-reminder.js` → **retire** (agent-kit forbids per-turn plugins).

### 3.1 Preservation Contract

- **Force is preserved.** "Never" stays "never"; every numeric threshold is copied, not rounded or paraphrased.
- **Conflicts are explicit.** A k79 rule that meets a different agent-kit number is resolved in §4 and recorded in the map, never silently dropped.
- **No rule disappears.** A rule leaves the product only as `RETIRE` with a written reason in `k79-rule-map.md`.
- **The k79 repository is the archive.** No k79 file is deleted during the merge; it is archived only after the map passes review.
- **Phase 1 is complete only when** every map row has an existing destination or a recorded retirement reason.
- **The G2 review walks the map**, comparing the destination text with the k79 rule, not with this summary.

## 4. Conflict Resolutions

| Conflict | Resolution |
| :--- | :--- |
| Two work loops | `.agent-kit/SKILL.md` is the only loop. Lanes: MICRO/QUICK/PLANNED already replace k79's spec gate; PLANNED G1 is the spec approval. |
| Two commit guards | One `cmdTaskGuard` with ordered checks: **cap → concerns → task scope → message**. Cap and scope exit 1; message warns unless strict. |
| Two subject formats | Keep `type (TASK-N\|PATCH-N): imperative summary` (ties commit to record). Body requires `Why:`, `What:`, `Verification:`; `Context & Verification:` stays accepted. |
| Two file caps | agent-kit's 300-line source ceiling is the hard limit; k79's 250 is the review target plus a `WARN` row. Splitting is by responsibility/area (helpers/queries/actions), never one file per function. Folder density 8 becomes a `doctor` row scoped to declared source roots. |
| Folder density vs the kit's own tree | The 8-files/folder check applies to declared source roots only. `.agent-kit/**`, `tests/**` and `examples/**` are exempt: the kit's own `lib/selftest` holds 14 files, so a universal cap would fail the template it ships. |
| Test mirroring vs arbitrary stacks | The mirror check runs only when `project.md` declares a test root (for example `tests/`). A repo that colocates tests is not failed by a rule for a layout it does not use. |
| CRLF inflates char caps | Count characters on LF-normalised text in `doctor`'s budget/ceiling checks, and add `.gitattributes` (`* text=auto eol=lf`) so a Windows checkout cannot fail a gate. |
| Two changelog ledgers | k79's is deleted; a task close still writes one card, and k79 reason/verification content becomes the card's `## What changed` paragraph plus the task evidence. |
| `--no-verify` policy | k79 allowed `K79_SKIP_GUARD=1`; agent-kit forbids bypass. Keep one escape, `K79_SKIP_GUARD=1`, loud and logged, documented as an emergency only. |
| Hook installer | Replace `install-hooks.mjs` with `agent-kit guard install [--check]`, writing `.agent-kit/githooks` and setting `core.hooksPath`. |

## 5. Phases & File Scope Lock

*The agent may only create or edit the files below for this merge. Anything else is a separate task.*

**Phase 0 — prerequisites (proof before content)**
- `.gitattributes` — `* text=auto eol=lf`.
- `.agent-kit/lib/doctor/structure.mjs` — normalise CRLF before counting budget/ceiling characters.
- `LICENSE` — MIT, matching k79; agent-kit currently has none.
- `.agent-kit/lib/doctor/structure.mjs` — bounded cap raise: `SKILL.md` 10,000 → 11,000, `_behavior.md` 7,500 → 8,500, `rules/INDEX.md` 1,800 → 2,000; `AGENTS.md` stays 9,000. Total budget 28,300 → 30,500 characters (+7.8%). The gate must still bind: `selftest` scenario 32 stays green.
- `setup/4-verify.md` — record the new caps in the check table.

**Phase 1 — rules and examples**
- Walk `specs/k79-rule-map.md` before writing: each `KEEP`/`MERGE` row becomes a bullet in its destination; each `RETIRE` row already cites its reason.
- Create `.agent-kit/rules/code-structure.md`, `.agent-kit/rules/verification.md`, `.agent-kit/rules/errors.md`.
- Edit `.agent-kit/rules/commits.md`, `.agent-kit/rules/_behavior.md`, `.agent-kit/rules/INDEX.md` (rows for Code structure, Verification, Errors).
- Create `.agent-kit/templates/rule-examples/security.md`, `performance.md`, `testing.md`, `logging.md`.
- Edit `.agent-kit/templates/rule-examples/config.md`, `database.md`, `INDEX.md`.
- Edit `.agent-kit/lib/doctor/structure.mjs` — source-ceiling warning at 250, folder density, feature-barrel ban; all scoped to declared source roots, machinery and tests exempt.
- Edit `.agent-kit/lib/selftest/rules.mjs` — one failing case per new `doctor` row: density, barrel, 250 warning, test mirror.
- Edit `.agent-kit/templates/INDEX.md`, `.agent-kit/sync-manifest.json` if a new file travels.

**Phase 1.5 — invokable procedures**
- Create `.agent-kit/skills/k79-commit.md`, `k79-release.md`, `k79-debug.md`, `k79-spec.md`.
- Edit `.agent-kit/skills/INDEX.md` — rows and invocation model.
- Rename every source skill to `k79-*` and put all eight under `.agent-kit/skills/`.
- Create `.agent-kit/lib/invoke/{config,prompt,pointers,install}.mjs` and `INDEX.md` — job ids, `prompt`, `wire`, pointer builders, prune, setup wiring. Four files, no barrel.
- Create `.agent-kit/invoke.json` — per-repo selection (`harnesses`, `jobs`), `owned` in the manifest.
- Edit `.agent-kit/lib/main.mjs`, `.agent-kit/agent-kit.mjs`, `.agent-kit/lib/env.mjs` — dispatch, usage, harness ids and `commands` paths.
- Edit `.agent-kit/lib/setup.mjs` — `--wire` creates the folder, saves `invoke.json`, wires.
- Edit `.agent-kit/lib/sync.mjs` — `pull` refreshes pointers from `invoke.json`.
- Edit `.agent-kit/lib/doctor/structure.mjs` — `command pointers` and `invoke config` rows.
- Edit `.agent-kit/lib/selftest/invoke.mjs`, `selftest/index.mjs`, `selftest/INDEX.md` — scenario 43.
- Edit `.agent-kit/SKILL.md`, `AGENTS.md`, `docs/using.md`, `setup/3-skills.md`, `SETUP.md`, `README.md` — invocation instructions and the install question.

**Phase 1.75 — task-only state**
- Remove the `## Baseline` block and the baseline run from `templates/task.md` and `tasks/open.mjs`; keep the `baseline` SHA for inventory and stale-evidence hashing.
- `verify` writes one `VERIFY` table; remove the `BASELINE` mode and `--baseline`.
- `task close` archives the task and writes no card; delete `lib/changelog.mjs`.
- `release` reads archived tasks (plus legacy cards, without duplicates) and claims task ids.
- `start` shows the newest archived tasks; `doctor` checks archived outcomes instead of cards.
- Remove `logs/` from `sync-manifest.json`, setup, seeds and required files; keep legacy read support for upgrades.
- Update `_behavior.md`, `commits.md`, `releases.md`, `SKILL.md`, `AGENTS.seed.md`, `tasks-INDEX.seed.md`, `docs/using.md`, `SETUP.md`, `setup/5-first-task.md`, `setup/4-verify.md`.
- Selftest scenarios 7, 11, 13, 22–23, 26–28, 41, and the issue/migrate sync change from cards to tasks.

**Phase 2 — merged guard**
- `.agent-kit/lib/guard.mjs` — cap 20 (`K79_MAX_COMMIT_FILES`), `K79_ALLOW_BULK`, concern warning at 4 groups, existing scope check, message shape with `K79_GUARD=strict`.
- `.agent-kit/lib/main.mjs` — `guard install [--check]` and `guard plan [--json]` subcommands; keep `task guard`.
- `.agent-kit/githooks/pre-commit`, `.agent-kit/githooks/commit-msg`, `.agent-kit/githooks/INDEX.md` — call the one entry point; no duplicated guard script.
- `.agent-kit/lib/selftest/tasks.mjs` (or `surface.mjs`) — cases: 25 files fail, 5 pass, bulk warns and passes, concern warns and passes, message warns by default and fails in strict, scope still blocks, two installs leave one block, a pre-existing hook line survives.
- `.agent-kit/lib/doctor/git.mjs` — report hook mode and guard policy.
- `AGENTS.md`, `.agent-kit/SKILL.md`, `rules/commits.md`, `docs/using.md`, `SETUP.md`, `setup/5-baseline.md`, `README.md` — describe the merged gate and install command.

**Phase 3 — prompts and docs**
- `.agent-kit/skills/INDEX.md` and `k79-task-brief.md` (only if prompt-craft survives).
- `docs/using.md`, `docs/inside.md`, `setup/3-skills.md` — remove k79 as a separate install; state what is bundled vs optional.

**Phase 4 — release**
- `.agent-kit/releases/v2.0.0.md` via `agent-kit release v2.0.0` after `verify --full` is green.
- `README.md`, `SETUP.md`, `AGENTS.md` — v2 install instructions.
- Migration note: add `## Source roots`, `## Test roots` and `## Structure exceptions` to an existing `project.md`; the new checks stay dormant without them.

**Out of repo (separate, after approval):** archive `k79-agent-skills` or reduce it to a pointer; no history rewrite.

## 6. Acceptance Criteria (Testable)

**Status:** [OPEN] not started · [WIP] in progress · [DONE] verified with proof · [ASSERTED] wording only, no executable check · [FAILED] · [BLOCKED]

- [DONE] WHEN a Windows checkout with `autocrlf=true` runs `doctor`, THE BUDGET ROW SHALL pass. (verified: `SKILL.md` converted to CRLF, doctor `context budget` PASS, then restored to LF)
- [DONE] WHEN a session file exceeds its raised cap, `doctor` SHALL still fail, so the relaxation cannot become unlimited. (verified: selftest scenario 32, "an entry file past its cap fails")
- [DONE] WHEN the repo is checked out on any platform, `.gitattributes` SHALL force LF. (verified: `* text=auto eol=lf` present; CRLF probe passes)
- [DONE] WHEN the repo is redistributed, a LICENSE SHALL exist. (verified: MIT `LICENSE` present)
- [OPEN] WHEN 25 files are staged, THE GUARD SHALL exit 1 and print the cap. (verified: selftest case)
- [OPEN] WHEN 5 files are staged, THE GUARD SHALL exit 0. (verified: selftest case)
- [OPEN] WHEN `K79_ALLOW_BULK=1` and 25 files are staged, THE GUARD SHALL warn and exit 0. (verified: selftest case)
- [OPEN] WHEN staged files span four concerns, THE GUARD SHALL warn and exit 0. (verified: selftest case)
- [OPEN] WHEN the staged set leaves the active task's `touches`, THE GUARD SHALL still exit 1. (verified: existing scope selftest)
- [OPEN] WHEN a message lacks `Why:`/`What:`/`Verification:`, THE GUARD SHALL warn and exit 0 by default, and exit 1 under `K79_GUARD=strict`. (verified: selftest cases)
- [OPEN] WHEN `guard install` runs twice, EACH hook SHALL contain the marked block exactly once. (verified: selftest case)
- [OPEN] WHEN a pre-existing hook line exists, IT SHALL still run. (verified: selftest case)
- [OPEN] WHEN `doctor --strict` runs on a fresh install, IT SHALL exit 0. (verified: selftest install scenario)
- [DONE] WHEN a source file is 251–300 lines, `doctor` SHALL warn; above 300 it SHALL fail. (verified: selftest scenario 42, source cap FAIL/WARN/PASS)
- [DONE] WHEN a declared source folder holds 9 files, `doctor` SHALL fail, while `.agent-kit/**` and `tests/**` stay exempt. (verified: selftest scenario 42, folder density FAIL/PASS)
- [DONE] WHEN a feature folder contains a re-export barrel, `doctor` SHALL fail; `src/config/index` SHALL be allowed. (verified: selftest scenario 42, feature barrels FAIL/PASS, config exemption)
- [DONE] WHEN a test root is declared and a source folder has no mirror under it, `doctor` SHALL fail. (verified: selftest scenario 42, test mirror FAIL/PASS)
- [DONE] WHEN `project.md` declares a missing source or test root, `doctor` SHALL fail. (verified: `declared roots` row; PASS in doctor and fixture)
- [DONE] WHEN `agent-kit prompt k79-commit` runs, IT SHALL print the commit procedure; `--list` SHALL name every job; an unknown job SHALL exit 1. (verified: selftest scenario 43)
- [DONE] WHEN `agent-kit wire` runs twice, EACH configured harness SHALL hold one command and one skill pointer per job. (verified: selftest scenario 43, `wire twice writes nothing new`)
- [DONE] WHEN `wire --check` runs before wiring, IT SHALL exit 1; after wiring, 0. (verified: selftest scenario 43)
- [DONE] WHEN `invoke.json` selects one job, `wire` SHALL write only that job and `doctor` SHALL accept the config. (verified: selftest scenario 43, `invoke.json selects one job`)
- [DONE] WHEN an old unprefixed pointer exists, `wire` SHALL prune it without touching an authored file. (verified: selftest scenario 43, `wire prunes an old unprefixed pointer`)
- [DONE] WHEN a harness command file copies a procedure instead of pointing at it, `doctor` SHALL fail `command pointers`. (verified: selftest scenario 43, 800-char copy)
- [ASSERTED] WHEN a harness has no adapter, THE AGENT SHALL run `agent-kit prompt <job>` itself; the owner never types it. (instruction in `AGENTS.md` and `SKILL.md`)
- [DONE] WHEN `task new` runs, THE TASK SHALL carry the baseline SHA and no baseline table or baseline run. (verified: temp install, `## Baseline` absent; selftest scenario 11)
- [DONE] WHEN `task close` runs, IT SHALL write zero change cards and archive the task. (verified: temp install, `logs/` absent, one archive; selftest scenarios 7 and 26–27)
- [DONE] WHEN `release` runs, THE NOTE SHALL be built from unclaimed archived tasks and claim their ids. (verified: selftest scenario 28; temp release note named TASK-101)
- [DONE] WHEN a fresh setup runs, NO `.agent-kit/logs/` SHALL be created. (verified: temp install, 94 files, no logs dir)
- [DONE] WHEN a legacy card exists, `release` SHALL still read it without duplicating an archived task. (verified: `unreleasedChanges` legacy branch; selftest release scenario)
- [OPEN] WHEN `selftest` runs, IT SHALL exit 0 with the new gate cases proven. (verified: `node .agent-kit/agent-kit.mjs selftest`)
- [OPEN] WHEN `check`/`pull` round-trip on an installed repo, NO k79 file SHALL be installed. (verified: temp-repo check)
- [OPEN] WHEN the merged repo is inspected, ZERO dependencies SHALL be added. (verified: no `package.json` dependency block)
- [ASSERTED] WHEN an agent commits, IT SHALL run `guard plan` and split more than one concern. (instruction only; no gate can see intent)
- [ASSERTED] WHEN tests are written, THE 1:2 happy-to-breaking ratio, adversarial boundaries, zero mocks in `helpers/` and criterion-to-test traceability SHALL hold. (review rules in `rules/verification.md`; a phrase list cannot prove test quality)
- [OPEN] WHEN Phase 1 ends, EVERY rule ID in `specs/k79-rule-map.md` SHALL have an existing destination or a recorded retirement reason. (verified: line-by-line G2 review)
- [ASSERTED] WHEN a rule moves, ITS force SHALL be preserved: never stays never, thresholds and units are copied unchanged. (review rule; prose cannot be proven by a command)
- [OPEN] WHEN the merge is approved, NO k79 source file SHALL have been deleted. (verified: `git -C ../k79-agent-skills status --short` shows no deletions)

## 7. Out of Scope

- Renaming the product/repo to `k79-agent-kit`.
- Rewriting k79's git history or migrating its published releases.
- Deleting or trimming k79 source files during the merge; that happens only after the rule map passes review.
- Changing the optional third-party skills (prompt-master, caveman, ponytail, anthropic, agent-browser).
- Auto-wiring hooks into the template repo or any clone.
- Adding a plugin, daemon or per-turn hook.
- Releasing before Phases 0–3 are green.

## 8. Risks

- **Budget pressure:** 48k characters of k79 prose against ~4k free after the bounded raise. The port must compress and cite; a paste will still fail `context budget` immediately.
- **Two gates, one hook:** cap/scope must stay fail-closed while the message stays advisory by default. The strict path needs its own selftest so it cannot rot.
- **EOL sensitivity:** already real at v1.7.0; fix before adding text, or Windows contributors will see false failures.
- **Self-failing structure checks:** a universal 8-file/barrel rule fails the kit's own `lib/selftest` (14 files) and its dispatch indexes. The source-root scope and exemptions are part of the contract, not an afterthought; `selftest` must prove the exemption and the failure separately.
- **Preservation drift:** a summary can keep a rule's intent while losing its threshold. The map's line-by-line audit is the defense; copy numbers, units and "never" clauses literally.
- **Existing installs stay dormant:** `project.md` is `owned`, so `pull` never rewrites it. An upgraded repo without `Source roots` / `Test roots` skips the new checks with a PASS. The v2.0.0 release note must tell owners to add the two sections, or the gates never bind.
- **History split:** two repos, two release trains. After v2.0.0 the k79 repo must point at agent-kit or be archived, or users will install two competing systems.
- **Spec file:** this document is a planning artifact, not an installed surface. Delete it before the v2.0.0 release, or move the durable parts into `docs/inside.md`.

## 9. Verification

```bash
node .agent-kit/agent-kit.mjs doctor --strict
node .agent-kit/agent-kit.mjs selftest
node .agent-kit/agent-kit.mjs check
git status --short
```

`release v2.0.0` is cut only after Phases 0–3 are green; it runs `verify --full` itself and refuses a red suite.
