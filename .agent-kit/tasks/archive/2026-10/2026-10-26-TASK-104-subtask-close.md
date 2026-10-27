---
id: TASK-104
lane: PLANNED
status: DONE
closed: 2026-10-27
created: 2026-10-26
baseline: a2b133ee9746e91ae171af9a518645f73d71d224
touches: [".agent-kit/agent-kit.mjs", ".agent-kit/templates/task.md", ".agent-kit/templates/AGENTS.seed.md", ".agent-kit/templates/tasks-INDEX.seed.md", ".agent-kit/tasks/INDEX.md", "SETUP.md", ".agent-kit/SKILL.md", "README.md", ".agent-kit/project.md"]
depends_on: []
type: changed  # added | changed | fixed | removed — what kind of change this is
summary: subtasks close quick with lint; the main task runs build at close
---
# TASK-104 — subtask close

## Scope (frozen once approved)

**Intent**
The owner wants the heavy checks deferred to the main task: "the lint and build let it run after
all the subtasks completes before closing the main tasks. if any issues comes at that time then
fix all those error at that time." A subtask closes on the quick suite; the main task pays for
build once, at its close, and a red there is fixed before the close completes. The owner then
refined it on 2026-10-27: "build takes too much time to run / we can do the linting but build
at last task?" — so lint rides the quick suite and only build waits for the main close.

**In scope**
- Subtasks: `task new <slug> --parent TASK-104` opens `TASK-104.1`, `.2`, …; the top-level
  `.counter` does not move; `parent:` goes in the front matter.
- Slot: opening the first child turns the parent QUEUED and the child IN_PROGRESS. One task is
  in progress at a time; the last child's close hands the slot back to the parent.
- Subtask close: quick suite only, status DONE, file stays in `active/` with its evidence, no
  archive and no change file, and it prints its own commit message with the child id.
- Main close: refuses while any child is open, blocked or not DONE; runs the full suite; a red
  build records its rows and stops the close — fix those errors then, and run close again. On
  green: parent and DONE children archive, the write set is parent ∪ children `touches`, one
  change file, one commit message under the parent id.
- Defaults: setup marks build `milestone`; test, typecheck and lint stay `always`, so a subtask
  close lints but does not build. This repo's lint stays `always`.
- `show`/`start`: list the children with their states and name the next action — the open child,
  or the main close when all children are DONE.
- Doctor: an archived child needs no change file of its own; a child must name an active
  parent; two children of the same parent do not collide on `touches`.
- Selftest 26–27.

**Out of scope**
- The router/waves/model-effort work — still design only.
- Parallel children: subtasks stay sequential, one in progress at a time.
- Re-opening a closed parent or adding a child to an archived task.

**Assumptions taken without asking**
- The owner's 2026-10-27 "after this commit" approves the plan presented in chat, in that order.
- A child's baseline is quick; the parent's full baseline is the "was it broken" reference for
  build, and the parent close re-runs it before anything lands.
- The parent's summary and type drive the single change file; each child still carries a summary
  for the index and its commit message.

An assumption carries the evidence it stands on (`path:line`, a command's result, or the
owner's words); with no evidence, write the still-open question here instead.

## Plan

1. Engine (`.agent-kit/agent-kit.mjs`): child ids (`TASK-N.M`) allocated under `--parent` without
   touching `.counter`; parent flips to QUEUED while a child works; `cmdTaskClose` splits into
   child (quick, DONE, no archive/change file, own commit message) and main (children must be
   DONE, full suite, union write set, archive children with the parent, one change file);
   `projectMd` keeps build `milestone` and lint `always`; doctor rows for subtasks and the archived-child
   changelog skip; `show`/`start` list children and the next action; usage and dispatch.
2. Templates: `task.md` gains `parent: ""`; `AGENTS.seed.md` kit table names `--parent` and the
   two close behaviours; `tasks-INDEX.seed.md` routes subtasks and the main close. The repo's
   installed `.agent-kit/tasks/INDEX.md` gets the same prose, because that is the copy sessions
   read here.
3. This repo's `.agent-kit/project.md`: lint stays `always`; only build would be `milestone`.
4. Docs: `SETUP.md` §5 (build at the main close), `.agent-kit/SKILL.md` §3/§6/§8, `README.md`.
5. Selftest: scenario 26 (child close is quick, the last child promotes the parent, the main
   close fails on a red build and closes after the fix) and 27 (ids without the counter, no
   child change file, doctor's subtask rows, `start` names the children).

**Files** — must match `touches` above.

**Evidence**
- `.agent-kit/agent-kit.mjs:1975` `task new` refuses while any task is in progress and `:1983`
  takes every id from `.counter` — no parent concept.
- `:2248` `task close` runs the full suite for every task; `:2289` passes `full: true`;
  `:1777` a baseline forces a full run too.
- `:541` only `build` is `milestone` in a new install.
- `:1579`–`:1583` every archived task must be named in a change file — children would fail it.
- `.agent-kit/templates/task.md:7` the front matter has no `parent`.
- Owner's words, 2026-10-27, quoted in Intent.

**Test plan**
- `node .agent-kit/agent-kit.mjs selftest`: 27 scenarios, all pass. Scenario 26 fails on the
  unfixed tree (the child close would run the red build and refuse).
- `node .agent-kit/agent-kit.mjs doctor --strict` exits 0.
- `node .agent-kit/agent-kit.mjs verify --full` exits 0 on this task.

## Baseline (before the change)

`agent-kit verify --baseline` writes this table. It is the "was it already broken?" answer: a
failure present here is reported, not worked over.

<!-- BASELINE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- BASELINE:END -->

## Verification

`agent-kit verify` writes this table. Do not hand-write exit codes. A quick run records the
`always` rows; `verify --full` and close add the `milestone` rows, so each row carries its
scope. `task close` refuses a table that records a non-zero exit.

<!-- EVIDENCE:START -->
| Action | Command | Scope | Expected | Observed | Exit |
|---|---|---|---|---|---|
| test | `node .agent-kit/agent-kit.mjs selftest` | full | exit 0 | exit 0 | 0 |
| lint | `node .agent-kit/agent-kit.mjs doctor` | full | exit 0 | exit 0 | 0 |
<!-- LOOP {"n":0,"fail":"","diff":"0c75c235d71e6ba4","plan":"cd122f5978b421af"} -->
<!-- EVIDENCE:END -->

## Close-out

**Summary** — A subtask now closes on the quick suite, lint included, and the main task's close is where build runs. The tier lives in `.agent-kit/project.md`, so `verify` stays quick mid-flight while the baseline, `verify --full` and the main close run the slow one.

**Docs updated**
- `.agent-kit/SKILL.md`, `SETUP.md`, `README.md`, `.agent-kit/project.md`, `.agent-kit/tasks/INDEX.md`, and the two seeds (`.agent-kit/templates/AGENTS.seed.md`, `.agent-kit/templates/tasks-INDEX.seed.md`) plus `.agent-kit/templates/task.md`.

**Learnings promoted**
- none

**Follow-ups**
- none

<!-- FILES:START -->
- `.agent-kit/project.md`
- `.agent-kit/templates/AGENTS.seed.md`
- `.agent-kit/templates/task.md`
- `.agent-kit/templates/tasks-INDEX.seed.md`
- `README.md`
- `SETUP.md`
- `.agent-kit/SKILL.md`
- `.agent-kit/agent-kit.mjs`
<!-- FILES:END -->
