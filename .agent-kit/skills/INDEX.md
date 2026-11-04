# skills — the source skills an agent runs

**Why** — every file here is a skill: one job, one file, run the same way each time. Commit,
release, debug, spec, filling the docs, trimming the entry file, reviewing the kit, upgrading an
install. `agent-kit skills build` turns all of them into installable `skills/<id>/SKILL.md` files.

**Load it when** — the owner asks for one of these jobs by name, or a row below matches. Read the
one skill and follow it; do not read the folder.

| Path | Runs | Open when |
|---|---|---|
| `k79-commit.md` | splits staged work, runs the guard plan, writes the `Why` / `What` / `Verification` body | asked to commit |
| `k79-release.md` | verifies the suite, cuts the note, tags the version, publishes | asked to cut a release |
| `k79-debug.md` | reproduces, isolates, fixes one variable, stops after two failed attempts | asked to fix a failure |
| `k79-spec.md` | turns a contract change into a PLANNED task with an approved plan | asked to change a contract |
| `k79-docs-populate.md` | fills `.agent-kit/docs/`, learnings and backlog from `path:line` evidence | asked to populate or refresh the docs |
| `k79-kit-review.md` | finds the rule or gate that keeps costing a session, then fixes or proposes it | the process is the friction, with evidence |
| `k79-trim-agents-md.md` | rewrites `AGENTS.md` against the seed, moving each fact to its home | the entry file costs more than it earns |
| `k79-upgrade.md` | checks the recorded template source, shows the diff, then pulls it as one task | the owner says upgrade agent-kit, or asks what changed in the template |
| `k79-task-brief.md` | interviews until the goal is agreed, then emits one precise prompt | the owner asks for a prompt, brief or handoff |

A skill is not a rule. It says how to run one job; the constraints it obeys are in
`.agent-kit/rules/`, and a skill that contradicts them is the bug.

## Invoke

`agent-kit prompt <job>` prints any of these; it works in every harness that can run a shell.
`agent-kit skills install` publishes **every** file here to the project's `.agents/skills`.
These skills are repo-bound, so there is no global install: one project copy is recognized
wherever skills are read. `agent-kit wire` is the optional native path: it writes
`/<job>` commands for the four jobs that have one, into a harness folder that already exists.
Every pointer and generated skill names the same `.agent-kit/skills/<job>.md`; none copies it at
runtime.
