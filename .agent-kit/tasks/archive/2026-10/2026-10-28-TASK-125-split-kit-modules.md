---
id: TASK-125
parent: ""
lane: PLANNED
status: DONE
closed: 2026-10-28
created: 2026-10-28
baseline: 898efa3f596d9737877d7ece1ea9346201128019
touches: [".agent-kit/agent-kit.mjs", ".agent-kit/lib/**", ".agent-kit/sync-manifest.json", ".agent-kit/INDEX.md", ".agent-kit/project.md", ".agent-kit/prompts/kit-review.md", ".agent-kit/rules/_behavior.md", "AGENTS.md", "README.md", "SETUP.md"]
depends_on: []
type: changed  # added | changed | fixed | removed
summary: "the entry point is one dispatch file over lib/ modules and folders, and a 300-line ceiling keeps it that way"
---
# TASK-125 — split kit modules

## Scope (frozen once approved)

**Intent** — the owner asked whether the 5,068-line `.agent-kit/agent-kit.mjs` should become a
folder; approved as one entry point plus `.agent-kit/lib/` modules, so a session opens one area
instead of grepping a 168 KB file.

**In scope**
- `.agent-kit/agent-kit.mjs` is trimmed to: usage header (lines 1–27 untouched), imports, `main`
  dispatch, `process.exitCode`. No command logic stays in it.
- New `.agent-kit/lib/` modules, one per area: `consts`, `io`, `manifest`, `project`, `env`
  (rtk + harnesses), `taskfile`, `setup`, `sync`, `doctor`, `verify`, `changelog`, `release`,
  `tasks` (task new/show/block/resume/close + `start`), `guard`, `learnings`, `selftest`.
- `.agent-kit/lib/INDEX.md`, a `lib/` row in `.agent-kit/INDEX.md`.
- `.agent-kit/sync-manifest.json` machinery gains `.agent-kit/lib`.
- The single-script claims: `AGENTS.md` rule 1 and layout line, `README.md:36`.
- Two new checks: a doctor row that every `.mjs` under `.agent-kit/` is covered by machinery, and
  a selftest pair that the installed kit boots (`help` exits 0) and that the boot fails when a
  module is missing.

**Out of scope**
- Behaviour of any command, a second entry point, package dependencies, renaming subcommands.
- Splitting `selftest` by scenario (its scenarios share one fixture; separate change).
- `.agent-kit/templates/`, `examples/`, `SETUP.md` wording.

**Decisions** — only choices a later session would otherwise re-open, each with the pointer it
rests on (`path:line`, a command's result, or the owner's words). No explanation.
- One entry point, imports only, zero packages — owner approved 2026-10-28; `AGENTS.md:96` keeps
  the rule, the words "one script" become "one entry point".
- `SCRIPT_ROOT` moves to `lib/consts.mjs` as `resolve(dirname(import.meta.url), "../..")`; the
  entry imports it. Resource paths assume the module sits one level under `.agent-kit/`.
- `taskfile.mjs` holds `activeTasks`/`currentTask`/`matchTasks`/`refreshActive` and the id
  helpers, because `cmdVerify` reads active tasks (`agent-kit.mjs:2067`) and `cmdTaskClose` calls
  `cmdVerify` (`agent-kit.mjs:2717`) — the lookup must sit below both or the imports cycle.
- The usage header stays at entry lines 1–27: `help` prints that range (`agent-kit.mjs:5053`).

## Plan

1. `consts` + `io` out first, then the leaves (`manifest`, `project`, `env`); entry imports them;
   `verify` green after each move.
2. `taskfile`, then `verify`, `setup`, `sync`, `doctor`, `changelog`, `release`, `guard`,
   `learnings`; `verify` green after each move.
3. `tasks` + `start`, then `selftest`; entry is left as dispatch only; `verify` green.
4. Add the doctor coverage row and the selftest boot scenario, including its negative case
   (fixture copy with `.agent-kit/lib` deleted must exit non-zero).
5. Manifest, `lib/INDEX.md`, `.agent-kit/INDEX.md`, `AGENTS.md`, `README.md`.
6. `verify --full`, then close.

**Test plan** — command → expected; a new check also shows its failing run.
- `node .agent-kit/agent-kit.mjs verify` after each move → exit 0.
- `node .agent-kit/agent-kit.mjs help` before vs after → byte-identical; `bun … help` → exit 0.
- Installed boot: fixture from `cmdSetup` with lib dropped → `node <fixture>/.agent-kit/agent-kit.mjs help` exits ≠ 0; with lib present → 0. Asserted in `selftest`.
- Doctor coverage: fixture manifest without `.agent-kit/lib` → `FAIL kit modules covered`.
- Final: `node .agent-kit/agent-kit.mjs selftest` and `doctor --strict` → exit 0; entry ≤ 200 lines.

## Amendment — 300-line ceiling (2026-10-28)

The owner set the ceiling: any `.mjs` in the kit past 300 lines splits. Four modules breach it —
`selftest` 1,761, `doctor` 738, `tasks` 656, `verify` 308 — so the cap lands with the splits, never
before: `doctor` cannot fail a tree that has not been fixed yet.

**In scope, added**
- `lib/selftest.mjs` -> a harness plus `lib/selftest/` scenario families, in their current order.
- `lib/doctor.mjs` -> `lib/doctor/` check groups behind one context.
- `lib/tasks.mjs` -> `tasks.mjs` (new/show/block/resume) + `close.mjs` + `start.mjs`.
- `lib/verify.mjs` -> `evidence.mjs` (parsing, state, hash) + `verify.mjs` (the command).
- A `doctor` row `source ceiling`: any `.mjs` under `.agent-kit/` over 300 lines fails, proven by
  a selftest case that pads a file to 301 lines.
- The number itself in `_behavior.md` §2 (one clause), its `SETUP.md` check-table row, and rows for
  the new files and folders in `lib/INDEX.md`.

**Out of scope, added** — no scenario is reordered, dropped or renamed; no check's wording or exit
code changes; fixtures stay shared within a family rather than becoming per-scenario.

**Decisions, added**
- Lines are counted as `text.split("\n")` with the trailing newline not counted; the cap is 300,
  so 301 fails.
- `lib/doctor/` and `lib/selftest/` are directories, so each carries its own `INDEX.md`; doctor's
  existing rule already forces that.
- The selftest oracle is the scenario list: same titles, same order, same assertions afterwards.
- A split area becomes a directory with `index.mjs` as the file `main.mjs` imports
  (`lib/selftest/`, `lib/doctor/`, `lib/tasks/`, `lib/verify/`); an area that fits in one file
  stays a file. Each directory carries its own `INDEX.md`.
- The cap is the only trigger, and the seams are categories, not functions: a file may hold ten
  small functions that change together, and a split groups functions by responsibility. Two
  unrelated functions never share a file when a category for one already exists.
- `closingNote` moved to `taskfile.mjs` beside `closeOutField`, not `tasks/close.mjs`: the close
  file landed at 301 lines, and the note reads task-file prose, which is what `taskfile` owns.
- The harness is `lib/selftest/index.mjs`; the old `selftest.mjs` became the folder. Its scenarios
  are exported from eight category files and called by `index.mjs` in numeric order, so grouping
  never changes execution order.

## Plan, added

7. `doctor`: extract sections 0–0b (structure), 1–4 (docs and encoding), 5 (tasks), 6 (rules and
   learnings), 7 (completeness and lists) as functions taking `{ base, add, state, isTemplate }`;
   `doctor.mjs` keeps the fix pass, the row setup and the print.
8. `tasks`: `close.mjs` (`closingNote`, `cmdTaskClose`), `start.mjs`; `verify`: `evidence.mjs`.
9. `selftest`: harness stays in `selftest.mjs` (fixture, assert/quiet/captured, order, summary);
   scenarios move by contiguous ranges into families; cross-family state moves into one context
   object. Nothing is reordered.
10. `source ceiling` doctor row + its selftest failing case; the `_behavior.md` clause; `SETUP.md`
    row; `lib/INDEX.md` rows.
11. `verify --full` after each file; finish with every `.mjs` at or under 300 lines.

**Test plan, added**
- `wc -l` over all kit modules -> 301 is a failure, 300 passes.
- `source ceiling` row fails on a padded file and passes once the padding is removed.
- Selection of scenario titles before and after -> identical order.
- `selftest`, `doctor --strict` -> exit 0; `help` output unchanged.

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
<!-- LOOP {"n":0,"fail":"","diff":"80dd470d891fb0bf","plan":"69623e3df43c9080"} -->
<!-- VERIFY:END -->

## Close-out

**Summary** — the kit's 5,068-line entry point became one dispatch file plus `lib/` — a module or folder per command area, with the four oversized modules (selftest, doctor, tasks, verify) split into category folders behind an `index.mjs`. A `source ceiling` row now fails any kit `.mjs` past 300 lines, so the tree cannot grow back, and a selftest case proves the row fails before it passes.

**Docs updated** — `AGENTS.md` (rule 1 and the layout row), `README.md` (entry point), `SETUP.md` (check table), `.agent-kit/INDEX.md` and every new `lib/*/INDEX.md`, `_behavior.md` §2 (ceiling clause).

**Follow-ups** — none

<!-- FILES:START -->
- `.agent-kit/INDEX.md`
- `.agent-kit/agent-kit.mjs`
- `.agent-kit/project.md`
- `.agent-kit/prompts/kit-review.md`
- `.agent-kit/rules/_behavior.md`
- `.agent-kit/sync-manifest.json`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `.agent-kit/lib/changelog.mjs`
- `.agent-kit/lib/consts.mjs`
- `.agent-kit/lib/doctor/docs.mjs`
- `.agent-kit/lib/doctor/git.mjs`
- `.agent-kit/lib/doctor/history.mjs`
- `.agent-kit/lib/doctor/INDEX.md`
- `.agent-kit/lib/doctor/index.mjs`
- `.agent-kit/lib/doctor/install.mjs`
- `.agent-kit/lib/doctor/rules.mjs`
- `.agent-kit/lib/doctor/structure.mjs`
- `.agent-kit/lib/doctor/tasks.mjs`
- `.agent-kit/lib/env.mjs`
- `.agent-kit/lib/guard.mjs`
- `.agent-kit/lib/INDEX.md`
- `.agent-kit/lib/io.mjs`
- `.agent-kit/lib/learnings.mjs`
- `.agent-kit/lib/main.mjs`
- `.agent-kit/lib/manifest.mjs`
- `.agent-kit/lib/project.mjs`
- `.agent-kit/lib/release.mjs`
- `.agent-kit/lib/selftest/family.mjs`
- `.agent-kit/lib/selftest/INDEX.md`
- `.agent-kit/lib/selftest/index.mjs`
- `.agent-kit/lib/selftest/install.mjs`
- `.agent-kit/lib/selftest/loop.mjs`
- `.agent-kit/lib/selftest/release.mjs`
- `.agent-kit/lib/selftest/rules.mjs`
- `.agent-kit/lib/selftest/state.mjs`
- `.agent-kit/lib/selftest/surface.mjs`
- `.agent-kit/lib/selftest/tasks.mjs`
- `.agent-kit/lib/setup.mjs`
- `.agent-kit/lib/sync.mjs`
- `.agent-kit/lib/taskfile.mjs`
- `.agent-kit/lib/tasks/close.mjs`
- `.agent-kit/lib/tasks/INDEX.md`
- `.agent-kit/lib/tasks/index.mjs`
- `.agent-kit/lib/tasks/open.mjs`
- `.agent-kit/lib/tasks/start.mjs`
- `.agent-kit/lib/verify/evidence.mjs`
- `.agent-kit/lib/verify/INDEX.md`
- `.agent-kit/lib/verify/index.mjs`
<!-- FILES:END -->
