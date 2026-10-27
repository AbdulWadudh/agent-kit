---
id: TASK-103
lane: PLANNED
status: DONE
closed: 2026-10-26
created: 2026-10-26
baseline: 37c04e64d546995869dc0eca919c545e7f45157c
touches: [".agent-kit/agent-kit.mjs", ".agent-kit/project.md", ".agent-kit/templates/task.md", ".agent-kit/templates/AGENTS.seed.md", ".agent-kit/templates/tasks-INDEX.seed.md", "SETUP.md", ".agent-kit/SKILL.md", "README.md", "AGENTS.md", ".agent-kit/INDEX.md"]
depends_on: []
type: changed  # added | changed | fixed | removed — what kind of change this is
summary: one command for session state, tiered verify, blocked tasks, close artifacts
---
# TASK-103 — session ergonomics

## Scope (frozen once approved)

**Intent**
The owner wants the kit to shorten the loop and make state cheap to read: "full build/lint on
every inner-loop iteration — this will slow down our development time very much; we should have
some better mechanism which it only runs build at some major milestone or end of the task
completion. Yeah you can implement those enhancements."

**In scope**
- `agent-kit start`: a read-only, bounded brief — repo/branch, declared commands and tiers,
  active tasks with status, the in-progress task's gate, last evidence, loop state, stale flag,
  and one derived next action.
- Command tiers: the `Commands` table gains a `When` cell (`always | milestone`, missing =
  `always`). `verify` runs `always` only; `verify --full`, the baseline and `task close` run
  every row. New installs mark `build` as `milestone`.
- Evidence rows gain a `Scope` cell (`quick | full`); rows merge per action so a quick run
  never erases the last full run of a milestone command. Five-cell rows from older tasks still
  parse.
- `task block "<question>"` / `task resume`: a question waits on disk for the owner; a blocked
  task no longer holds the single-task slot; the INDEX is rebuilt from the active files.
  `verify` and `close` target the one `IN_PROGRESS` task.
- Stale-evidence flag in `task show` and `start`: the current write-set hash is compared with
  the hash recorded by the last verify.
- `task close` prints a ready commit subject/body in the hook's `type (TASK-ID): summary`
  shape; `--pr` also prints a PR body from the change file and evidence.
- Doctor gates: an unknown `When` value fails; a `BLOCKED` task must carry a question, and a
  task carrying one must be `BLOCKED`.
- Selftest scenarios 23–25 prove the tiers, stale flag and close artifacts, and block/resume.

**Out of scope**
- The router/queue/waves/effort work — separate PLANNED task, not this one.
- The loop guard's evidence panel and owner escalation — separate task.
- Timestamps and `stats`; migration (B-04); hook behaviour changes.

**Assumptions taken without asking**
- The owner's 2026-10-27 quote above approves this five-item slice; the table was presented in
  chat with sizes and the recommendation to ship it first.
- `build` is the default milestone command in a new install; a repo with a slow lint moves that
  row itself. Existing installs with a two-column table keep today's behaviour (all commands
  run), so `pull` cannot break them.
- A blocked task may sit beside one in-progress task; two in-progress tasks remain refused.

## Plan

1. Engine (`.agent-kit/agent-kit.mjs`): three-cell `sectionRows`; `cmdVerify({full})` with quick
   default, full at baseline/close, merged per-action evidence with `Scope`; `evidenceDetail`;
   `activeTasks` + in-progress targeting; `refreshActive`; `cmdTaskBlock` / `cmdTaskResume`;
   `cmdStart`; `staleState`/`evidenceState`; close prints commit message and `--pr` body;
   doctor tier and blocked checks; usage text and dispatch.
2. Templates: `task.md` evidence header gains `Scope`; `AGENTS.seed.md` kit table gains
   `start`, `task block`, `task resume` and the tiered `verify`; `tasks-INDEX.seed.md` routes
   session start through `start` and explains `BLOCKED`.
3. This repo's `.agent-kit/project.md` gains the `When` column (test and lint `always`).
4. Docs: `SETUP.md` §5, `.agent-kit/SKILL.md` §1/§6/§8, `README.md` gate and phrase tables, root
   `AGENTS.md` layout line, `.agent-kit/INDEX.md` command list.
5. Selftest: make `fillTask` pick the in-progress file; add scenario 23 (quick skips the
   milestone build, full and close run it), 24 (stale flag, commit message, `--pr` body), 25
   (block/resume, a blocked task does not hold the slot, `start` shows the question, doctor
   fails a mismatched marker).

**Files** — must match `touches` above.

**Evidence**
- `.agent-kit/agent-kit.mjs:1677` `cmdVerify` runs every declared command, no tier; `:1693` its
  target is any single active file, blocked included; `:1957` close verifies without a full run.
- `:1829` `task new` refuses while any file sits in `active/`; `:1874` `currentTask` dies on two.
- `:1883`–`:1918` `task show` prints evidence and loop but no stale state; `:2062` close prints
  no commit text; `:1354` doctor ignores tiers; `:1412` allows `BLOCKED` with no command to set
  it; `:521` `projectMd` writes a two-column table; `:1600` `evidenceRows` drops command/scope.
- `.agent-kit/templates/task.md:56` evidence header has five columns.
- Owner's words, 2026-10-27, quoted in Intent.

**Test plan**
- `node .agent-kit/agent-kit.mjs selftest`: 25 scenarios, all pass; 23–25 fail on the unfixed tree
  (quick would run the red build; `task block`/`start` do not exist; no stale line).
- `node .agent-kit/agent-kit.mjs doctor --strict` exits 0.
- `node .agent-kit/agent-kit.mjs verify --full` exits 0 on this task.
- Manual: `start` prints TASK-103, the commands with tiers, and a next action.

## Baseline (before the change)

`agent-kit verify --baseline` writes this table. It is the "was it already broken?" answer: a
failure present here is reported, not worked over.

<!-- BASELINE:START -->
| Action | Command | Expected | Observed | Exit |
|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | exit 0 | exit 0 | 0 |
<!-- BASELINE:END -->

## Verification

`agent-kit verify` writes this table. Do not hand-write exit codes. `task close` refuses a
table that records a non-zero exit.

<!-- EVIDENCE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- LOOP {"n":0,"fail":"","diff":"45dbdfe0d67290d7","plan":"923eb781728324a0"} -->
<!-- EVIDENCE:END -->

## Close-out

**Outcome** — One session brief, quick verify with the full suite at close, tasks that block on an owner question, and a commit message written by close.

**Docs updated**
- `.agent-kit/templates/task.md` — scope column in the evidence table, quick vs full explained.
- `.agent-kit/templates/AGENTS.seed.md` — `start`, `block`, `resume`, tiered `verify`, close artifacts.
- `.agent-kit/templates/tasks-INDEX.seed.md` — routing starts at `start`; `BLOCKED` does not hold the slot.
- `.agent-kit/project.md` — `When` column (`always` for test and lint).
- `SETUP.md` — §5 tiers and the full baseline, doctor's `When` and blocked rows.
- `.agent-kit/SKILL.md` — §1 `start`, §3 full baseline, §6 quick/full and staleness, §8 close message and `--pr`, the blocked bend.
- `README.md` — tiers, `start`, `task block`, and the widened gate table.
- `AGENTS.md`, `.agent-kit/INDEX.md` — the command lists name `start` and `learnings`.

**Learnings promoted**
- none

**Follow-ups**
- none

<!-- FILES:START -->
- `.agent-kit/project.md`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/task.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `AGENTS.md`
- `README.md`
- `SETUP.md`
- `.agent-kit/SKILL.md`
- `.agent-kit/INDEX.md`
- `.agent-kit/agent-kit.mjs`
<!-- FILES:END -->
