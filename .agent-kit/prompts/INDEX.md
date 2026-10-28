# prompts — procedures an agent runs

**Why** — some jobs are long, run a few times a year, and have to be done the same way each
time: filling the docs, trimming the entry file, migrating an old install. Each is a file a
session opens and follows, not text it improvises from memory.

**Load it when** — the owner asks for one of these jobs by name, or a row below matches. Read the
one prompt and run it as a task; do not read the folder.

| Path | Runs | Open when |
|---|---|---|
| `docs-populate.md` | fills `.agent-kit/docs/`, learnings and backlog from `path:line` evidence | asked to populate or refresh the docs |
| `trim-agents-md.md` | rewrites `AGENTS.md` against the seed, moving each fact to its home | the entry file costs more than it earns |

A prompt is not a rule. It says how to run one job; the constraints it obeys are in
`.agent-kit/rules/`, and a prompt that contradicts them is the bug.
