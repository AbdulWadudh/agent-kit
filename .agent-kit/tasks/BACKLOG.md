# Backlog — parked work

Candidates the owner has decided not to do now. A row is **not** a task: it has no lane, no
write set and no gates, and no session resumes from it. Work starts when the owner picks a
row: `agent-kit task new`, then delete the row here. `task close` writes the record; this file
is not a changelog.

`agent-kit doctor` fails a row with an unknown status, a reused ID, fewer than five cells, or
an empty item, source or next step.

| ID | Status | Item | Source | Next step |
|---|---|---|---|---|
| `B-04` | `later` | adopt an existing repo's agent files at setup (inventory, clean or migrate) | 2026-10-26 design session (cinevo probe) | re-open as a PLANNED task from the plan in project memory; start with `setup --inventory` |
| `B-06` | `later` | rewrite the `rule-examples/config.md` example | 2026-10-27 TASK-107 answer | owner states the rewrite; open a task with `.agent-kit/templates/rule-examples/config.md` in its write set, then delete this row |
| `B-07` | `not-important` | runtime telemetry for rule cost (tokens read, time per rule) | 2026-10-28 owner ask, kit-review limits | nothing: the kit already stores characters, exit codes and `LOOP n`; a token count estimates a harness read the kit cannot see. Revisit only if a harness exposes real counts |
| `B-08` | `later` | `doctor` names the recent task that looped, instead of waiting for a session to notice | 2026-10-28 owner ask; every archived card carries `<!-- LOOP {"n":…} -->` | open a task: a WARN row over the last ten archived cards where `n >= 2`, naming the task and its failing set; `selftest` plants a card with `n:2` and asserts WARN |
| `B-09` | `not-important` | let an installed repo patch its own `.agent-kit/` machinery | 2026-10-28 owner ask | nothing: `pull --force` reverts machinery and `check` reports the drift, so upstream is the only path that survives. Revisit only if the manifest gains a per-file override |
| `B-10` | `not-now` | publish the kit to npm so `npx agent-kit@1.0.2 setup .` works | 2026-10-28 owner ask | a shim that maps the npm version to the git tag and runs the same `setup --ref`, so there is still one provenance; decide after the tag model has one install outside this repo. Publishing the tree as a package would add a second provenance `check` cannot verify |
| `B-11` | `later` | a generated `tasks/BOARD.md`, so progress is visible in git without a service | 2026-10-28 owner ask: "git already provides everything... others can track and see progress" | open a PLANNED task: `task new/block/resume/close` regenerate the board (in flight, blocked + question, queued, next action, recent closes, current tag) through the existing `block()` writer; add `owner:` to the task template filled from `git config user.name` or `--owner`; a `doctor` row fails a board that drifted from state; no network, no token |
| `B-12` | `later` | push the task to the issue at plan approval and at close, or on demand; every gate stays offline | 2026-10-28 owner decision: publish the approved plan, then re-sync the final record at close, or when the user asks | open a PLANNED task: `.github/ISSUE_TEMPLATE/` + PR template (files, no auth); the issue already exists from `task new` (TASK-126), so publish is update-only by id — title `TASK-N — <summary>`, body = scope + plan + evidence, labels from lane/type, assignee, state; the agent runs `task publish` when the owner approves the plan (SKILL line), `close` runs it after the card and archive are written (best-effort, WARN, `--no-sync`), `block` comments the question; payload is a pure function behind a transport seam so `selftest` asserts body/labels and the skip path offline; `release --publish` for notes and optional Projects fields behind `gh auth refresh -s project`. No cron, hook, daemon, reverse sync, or branch push (owner pushes when they ask) |

| `B-13` | `later` | `setup .` in place flips `.agent-kit/template.json` from `role: template` to `role: target` | 2026-10-28 TASK-129: `setup . --ids issue` rewrote the role and filled a hash baseline, so `doctor` warned `provenance` in the repo that *is* the template | open a task: in `.agent-kit/lib/setup.mjs` the `role: "target"` line of the `next` state keeps `state.role` when `selfAdopt` is true; `selftest` self-adopts a fixture and asserts the role and the empty baseline survive |

## Statuses

- `later` — real and wanted, not next.
- `not-now` — the timing is wrong or something external blocks it; the next step says what
  unblocks it.
- `not-important` — recorded so it stops being raised; revisit only if its cost changes.
