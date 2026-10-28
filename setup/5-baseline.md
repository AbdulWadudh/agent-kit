# 5. First verification baseline


`task new` records the baseline itself. The "was it already broken?" run happens at the moment
the task opens, so it cannot be forgotten:

```bash
bun .agent-kit/agent-kit.mjs task new bootstrap --lane quick
```

Expected: the task id, then one line per declared command and `PASS (full) — n/n command(s) exited 0`.
A failure here is the repo's problem, not the kit's: report it, do not work over it.
`--no-baseline` skips the run; it also throws away the only way to tell an old red from a new one.

In `ids: issue` this command also mints the GitHub issue and takes its number as the id; a
refused mint (bad credential, no access, Issues disabled) exits 1 and writes no task file.
`--summary "<one clause>"` is required there — it is the issue title and the card's — and
`--intent "<paragraph>"` is the issue body. `task publish` after the plan gate sends the approved
plan to that issue, and `task close --sync` closes it with the final record. `--from <n>` imports
an issue someone else opened.

The baseline is a **full** run. The `When` cell in `project.md` splits the rows:

- `always` — `verify` and every close run it. Setup marks test, typecheck and lint here.
- `milestone` — only the baseline, `verify --full` and a top-level task's close run it. Setup
  marks build here: a full build is what makes an iteration slow, and it is worth paying for
  once, at the end. A subtask's close is quick, so it does not run the milestone rows.

So the inner loop is `verify` (quick), and the expensive row cannot be skipped at close:
`task close` on a top-level task runs the full suite itself. Move a command between tiers in
`project.md`, not in the kit, and mark the slowest commands `milestone` while filling the file.

A request that arrives while a task is open goes in its `## Queue` and becomes its subtask:
`task new <slug> --parent TASK-N` opens `TASK-N.M` and queues the main task; only a separate
delivery earns a new task, and the owner decides that. A subtask closes on the quick suite, so
test, typecheck and lint run per subtask. The main task's close is where build runs: it refuses
while a subtask is open, runs the full suite, and an error found there is fixed in that moment
and the close re-run. The family then archives under the main id with one change file.

`task show` and `start` say when the quick run is the whole story and when the milestone rows
still wait. `start` is the read-only brief to begin a session with: branch, commands and tiers,
the five newest closes, active tasks, gate, last evidence, and one next action.

`verify` also counts attempts: a red run with the same failing set over the same declared files
is the same attempt repeated. At three, it refuses — and `task close` with it — until the Plan
section changes. `task show` prints `Loop: n/3`.

Commit the fill work **before** opening the first task. `task new` records the current `HEAD`
as the baseline, and `task close` derives the changed-file inventory from it — a repo with no
commit at all has no baseline to diff against.

Commit it as the repo's own identity: never `-c user.name`/`-c user.email`, never the harness
or session name, and never a `Co-Authored-By` or "Generated with" trailer. `doctor`'s
`commit identity` row fails a trailer and warns when the author is not the configured identity.
If git has no identity here, stop and ask — do not invent one.

The fill commit is the one commit that needs no task ID, because no task exists yet. From the
first task on, every commit names its task: the subject is `type (TASK-ID|PATCH-ID): summary`,
and the body is what that commit changed and why. A task carries as many commits as it has
features and fixes, grouped by the feature or issue each serves; close writes one change file per
task. The rule, the split and its type list are `.agent-kit/rules/commits.md`.

`setup` does not touch git config. If an agent will commit unattended in this clone and you want
the earlier warning, opt in once:

```bash
git config core.hooksPath .agent-kit/githooks
```

Git silently skips a hook it cannot execute, so both files are tracked as `100755`. Where a clone
lost that bit, `git ls-files -s .agent-kit/githooks` shows `100644` and `doctor`'s `hook mode` row
reports it; `git update-index --chmod=+x` on the two files repairs it.

It is per clone and bypassable (`git commit --no-verify`), so it is a speed bump, not the check.
`pre-commit` refuses a commit outside the write set, which `task close` also checks;
`commit-msg` prints the expected shape for a message that is not `type (TASK-ID|PATCH-ID): summary`
or carries no body summary, and exits 0 — it warns, never blocks. The message rule is the
session's instruction, not a hook's gate. Skip the hooks if the team would rather not have
them; `doctor` reports them as a WARN with that command, not a failure.
