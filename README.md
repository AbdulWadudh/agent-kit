# agent-kit

A template that turns any repository into a place where a coding agent can work predictably.

It is one idea: **the work has one home, the gates have evidence, and the setup can be
verified.** Everything here serves that, and anything that stops serving it gets deleted.

## What you get

- `AGENTS.md` — the entry point. Read once, then follow five steps.
- `.agents/project.md` — generated from your manifests: stack, real build/test/lint commands,
  entry points, generated directories. One home, cited by everything else.
- `.agents/tasks/` — one task file per unit of work, with a lane (QUICK or PLANNED), two
  gates, an evidence table, and a close-out that derives the changed files from git.
- `.agents/rules/` — a router plus short rule files. One home per rule; indexes cite. Ready-made
  examples for TypeScript, Bun, Biome, API versioning, config and library docs sit in
  `.agents/templates/rule-examples/`; you install only the ones that are true.
- `docs/` — the knowledge seed: architecture map, API skeleton, entry points.
- `SKILL.md` — the work loop: classify, open, gate, verify, close, report.
- `examples/minimal/` — what a filled repo looks like, for a fictional project.
- `scripts/agent-kit.mjs` — the only executable surface. Zero dependencies. Bun or Node.

## Start here

Copy the block below into a fresh agent session **in the repository you want to set up**, then
answer its five questions. The template URL is already in it.

```text
Set up agent-kit in this workspace: https://github.com/AbdulWadudh/agent-kit

Read the repo before you ask anything: manifests, entry points, and any harness config you
can see (.claude/, .cursor/, .github/copilot-instructions.md, GEMINI.md, .windsurf/,
opencode config). Say which harnesses you found — I will wire the skill for each — and which
rule examples in the template fit this codebase; a rule about a language this repo does not
use does not get installed.

Then ask me these five questions, and wait for the answers before changing anything:

1. Harnesses: is that list right, and is one missing that the repo cannot show?
2. Should the commit guard be wired on this clone? It refuses a commit that leaves the
   active task's write set. It is git config, so it is off by default.
3. What is off-limits: directories, generated or vendored paths, secrets, anything you must
   ask before changing?
4. What is the first task you want to hand over?
5. Skills: install ponytail, prompt-master, caveman and the anthropic skills, with the
   reason each earns its place? And separately — agent-browser lets you drive a real browser,
   including live sites and accounts, so it is opt-in: say yes only if you want that here.

Then run every step yourself; I am in chat, not a terminal. Follow SETUP.md from the
template exactly — it wins if it disagrees with this message:

1. git clone --depth 1 https://github.com/AbdulWadudh/agent-kit "$TMPDIR/agent-kit"
   bun "$TMPDIR/agent-kit/scripts/agent-kit.mjs" setup . --source https://github.com/AbdulWadudh/agent-kit
   (node instead of bun if Bun is absent; download the archive and pass the unpacked
   path as --source if git is unavailable)
2. Fill AGENTS.md, .agents/project.md, docs/ARCH_MAP.md, docs/ENTRY_POINTS.md and
   docs/API_SKELETON.md from the real tree. Ask, do not invent: propose candidates for
   rules 1-4 from my answers and the code, get a yes, then write them. Install the rule
   examples that are true here — code, config, api — and say which ones you skipped and why.
3. Install the skills I approved for each harness (SETUP.md §3), and list the files you wrote.
   If I said yes to agent-browser, install it and its skill; if I said no, do not.
4. Install the skill for every harness you found. Take the frontmatter (name and description)
   from SKILL.md, put it in that harness's skill folder, and make the body one line:
   "Read SKILL.md at the repository root." A pointer, never a copy. If a harness has no
   skill mechanism, put the trigger in the file it does read. List the files you wrote.
5. Record the off-limits answers in AGENTS.md (Ask first and rules 1-4). Wire the guard if
   I said yes. Then run bun scripts/agent-kit.mjs doctor --strict until it exits 0.
6. Run bun scripts/agent-kit.mjs verify and report the baseline honestly.

Report: the harnesses you wired and the files you wrote, the detected stack, the commands you
found and any you could not, what you filled, the doctor table, and the next action. Do not
claim a step passed without showing its output. Do not start the first task until I say go.
```

`SETUP.md` is the contract; if this prompt and that file ever disagree, `SETUP.md` wins.

## What setup does

`setup` detects your stack, writes `.agents/project.md`, and copies the kit. It never
overwrites a file that already exists. `doctor --strict` exits non-zero until the fill work
is done — that is the definition of "set up", and the point of the whole thing.

See `SETUP.md` for the contract and the expected output of each step.

## Daily use

You do not type commands. You describe the task:

> "Login fails when the email has a plus sign. Fix it."

The agent opens the task (`task new`, which records the baseline run for you), edits inside
the declared write set, and closes it (`task close`, which runs the suite itself and refuses a
red result). The kit exists so that path is checkable — not so that you drive it.

What to ask instead of typing:

| You say | The agent runs |
|---|---|
| "what's in flight?" | `task show` |
| "is this repo actually healthy?" | `doctor --strict` and reports the failing row |
| "what changed since the template?" | `check`, then `pull --dry-run` |
| "ship it" | `release <version> --summary "..."` — it drafts both, you approve |

The only commands in this document that are yours to run are the ones inside a chat message.
If the agent asks you to open a terminal, that is a defect in its instructions, not a step in
the workflow. If its environment cannot execute commands at all, it must say so and stop: an
agent that cannot run the gates cannot claim the work is verified, and telling you to paste a
script moves the problem instead of solving it.

And when an agent commits outside its declared write set, the optional pre-commit guard
reports it:

```bash
git config core.hooksPath .githooks   # per clone, off by default
```

It is off by default on purpose. It is git config, not a repo file: every clone would
otherwise get a hook nobody asked for, and the same check already runs at `task close`. Turn
it on where an agent commits unattended; skip it if your team would rather not have a hook.

## What the changelog is

`.agents/logs/changelog.md` is the release notes, and both halves of it are generated:

```
## 🚧 Unreleased

### 🟢 Added
- `TASK-118`: rate-limited the invite endpoint

### 🔵 Changed
- `TASK-116`: session tokens now rotate on refresh
```

`task close` files one entry under the task's `type` (`added`, `changed`, `fixed`, `removed`).
When the batch is done:

```bash
bun scripts/agent-kit.mjs release 0.4.0 --summary "Invites are rate-limited and sessions rotate."
```

That turns the Unreleased block into a release — summary, the categories that have entries, and
Touched Modules derived from the archived plans' file inventories:

```
## 🚀 Release [v0.4.0] — 2026-10-27

### 🚀 Summary
Invites are rate-limited and sessions rotate.

---

### 🟢 Added
- `TASK-118`: rate-limited the invite endpoint

### 🔵 Changed
- `TASK-116`: session tokens now rotate on refresh

---

### 📦 Touched Modules
- `src/api/invites/`
- `src/session.ts`
```

and leaves a fresh, empty Unreleased block behind. `release` refuses an empty batch and a
version that is not `1.2.3`-shaped; the version is the one thing it will not invent.

Each task ID is the pointer back to the evidence: the archived plan holds the scope, the
baseline run, the post-change run with real exit codes and the inventory. `doctor` fails if an
archived task has no entry, so the notes cannot quietly lose a change — and the task index
deliberately does not repeat them.

If the repo already publishes a user-facing `CHANGELOG.md`, this is a different audience and a
different cadence. Keep both, and do not generate one from the other.

`--amend "<why>"` on `task close` is the recorded way to accept a file that turned out to be
in scope later; the reason is written into the archived plan.

## The two lanes

| | QUICK | PLANNED |
|---|---|---|
| When | three files or fewer, reversible, no contract change | everything else |
| Halts | none; verify and record | one before the first edit, one before close |
| Always halts | destructive actions, new dependencies, schema changes, scope breaches | same |

The lane exists because the alternative is either ceremony for a typo or no review for a
schema change. Choosing per task is what keeps the gates honest.

## What the gates actually check

| Command | Question |
|---|---|
| `verify` | do the declared build, typecheck, lint and test commands exit 0 — with the codes recorded? |
| `task close` | did the diff stay inside the declared write set, is the evidence green, and is the outcome written down? |
| `doctor` | do the docs name real paths, do the commands exist, is the index current, is the encoding clean, is every rule checkable? |
| `check` | has the template moved since install, and did you edit machinery you should not have? |

Every one of them can fail. `selftest` asserts that by building a throwaway repo and
deliberately tripping each gate — sixteen scenarios, from a red baseline to a scope breach.

## The skill

`SKILL.md` is the work loop, and it is the only place that order lives: classify the request,
open a task, stop for the plan gate, edit inside the declared write set, prove it with real
exit codes, stop for the result gate, close, report. Pressure is where agents skip steps, so
the failure branches live there too — red suite, scope that grows, a suite you cannot run.

It is procedure, not knowledge. The repo's facts stay in `.agents/project.md`, its rules in
`.agents/rules/`, its install in `SETUP.md`. The skill cites them; it never restates them.

So install is not the skill's job — it happens once, before any of this exists, from the
README prompt. That is also why one file is enough for every harness: `AGENTS.md` lists it as
step 1 of "start here", so an agent reads the loop even where no skill mechanism exists. A
harness with its own skill folder gets a four-line pointer, not a copy.

Companion skills are recommended, not bundled: ponytail, prompt-master, caveman and the
anthropic skills — and `agent-browser` only if you say yes, because it drives a real browser
and can reach live sites and accounts. The sources and the exact question to ask are in
`SETUP.md` §3 and `.agents/rules/_behavior.md` §12.

No plugin: a plugin is code that runs on every turn, and this needs instructions at the
moment the work starts. `examples/minimal/` shows a filled repo, for when you want to see the
target instead of reading about it.

## Staying current

`check` never writes and prints one row per file: `CURRENT`, `UPGRADE`, `DRIFT`, `MISSING`,
`PRUNE`, `SEED-UPDATED`. `pull` applies the safe rows, refuses to overwrite a file you
modified unless you pass `--force`, and never deletes without a `prune` entry. Provenance and
per-file hashes live in `.agents/template.json`.

## What is deliberately not here

No sprint system, no persona fleet, no 10-phase pipeline, no per-rule report script, no
PowerShell engine, no plugin. Each of those is real machinery with a real maintenance cost,
and none of them earns that cost at this size. If a repo outgrows this, add one thing at a
time and give it a check.
