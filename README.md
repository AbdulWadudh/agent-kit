# agent-kit

A template that turns any repository into a place where a coding agent can work predictably.

It is one idea: **the work has one home, the gates have evidence, and the setup can be
verified.** Everything here serves that, and anything that stops serving it gets deleted.

## What you get

- `AGENTS.md` — the entry point. Read once, then follow its start-here steps.
- `.agents/project.md` — generated from your manifests: stack, real build/test/lint commands,
  entry points, generated directories. One home, cited by everything else.
- `.agents/tasks/` — one task file per unit of work, with a lane (QUICK or PLANNED), two
  gates, an evidence table, and a close-out that derives the changed files from git.
- `.agents/rules/` — a router plus short rule files. One home per rule; indexes cite. Ready-made
  examples for TypeScript, Bun, Biome, API versioning, config and library docs sit in
  `.agents/templates/rule-examples/`; you install only the ones that are true.
- `docs/` — the knowledge seed: architecture map, API skeleton, entry points.
- Indexed directories — every directory the kit owns has an `INDEX.md` saying what lives there,
  why, and when to open it. A session reads one index and one file, never a folder listing, so
  the always-on context stays small. `doctor` fails an unindexed directory.
- `SKILL.md` — the work loop: classify, open, gate, verify, close, report.
- `rtk` — the token saver: setup installs it when missing, and the skill runs shell output
  through it (`rtk git status`, `rtk npm test`) so the agent reads less of it.
- `agent-kit harnesses` — lists the coding agents installed on the machine (HOME config, PATH,
  repo markers), so a repo with no harness files still gets the skill wired for each one.
- `examples/minimal/` — what a filled repo looks like, for a fictional project.
- `scripts/agent-kit.mjs` — the only executable surface. Zero dependencies. Bun or Node.

## Start here

Copy the block below into a fresh agent session **in the repository you want to set up**, then
answer its five questions. The template URL is already in it.

```text
Set up agent-kit in this workspace: https://github.com/AbdulWadudh/agent-kit

Read the repo before you ask anything: manifests, entry points, and which rule examples in
the template fit this codebase; a rule about a language this repo does not use does not get
installed. Repo harness config is a hint, not the list: after setup, run
`scripts/agent-kit.mjs harnesses` and say which harnesses you found — the machine may have
several while the repo shows none. I will wire the skill for each.

Then ask me these five questions, and wait for the answers before changing anything:

1. Harnesses: after setup I will detect them from HOME, PATH and the repo. Is there one
   installed somewhere unusual that the detection may miss?
2. Should the commit guard be wired on this clone? It refuses a commit that leaves the
   active task's write set, and warns — never blocks — on a message that does not name the
   task and carry a summary. It is git config, so it is off by default.
3. What is off-limits: directories, generated or vendored paths, secrets, anything you must
   ask before changing?
4. What is the first task you want to hand over?
5. Skills: shall I install the recommended ones — ponytail, prompt-master, caveman and the
   anthropic skills? Ask me, install only what I say yes to, and say what each is for.
   Separately, on its own: agent-browser drives a real browser, including live sites and
   accounts, so it is opt-in — ask me that one apart from the rest.

Then run every step yourself; I am in chat, not a terminal. Follow SETUP.md from the
template exactly — it wins if it disagrees with this message:

1. git clone --depth 1 https://github.com/AbdulWadudh/agent-kit "$TMPDIR/agent-kit"
   bun "$TMPDIR/agent-kit/scripts/agent-kit.mjs" setup . --source https://github.com/AbdulWadudh/agent-kit
   (node instead of bun if Bun is absent; download the archive and pass the unpacked
   path as --source if git is unavailable. Setup also installs rtk, the token saver,
   unless it is already present or I pass --no-rtk.)
2. Fill AGENTS.md, .agents/project.md, docs/ARCH_MAP.md, docs/ENTRY_POINTS.md and
   docs/API_SKELETON.md from the real tree. Ask, do not invent: propose candidates for
   rules 1-4 from my answers and the code, get a yes, then write them. Install the rule
   examples that are true here — code, config, api — and say which ones you skipped and why.
3. Install the skills I approved for each harness (SETUP.md §3), and list the files you wrote.
   If I said yes to agent-browser, install it and its skill; if I said no, do not.
4. Run `scripts/agent-kit.mjs harnesses`, say the list, then install the skill for every
   harness it found. Take the frontmatter (name and description) from SKILL.md, put it in
   that harness's skill folder, and make the body one line: "Read SKILL.md at the repository
   root." A pointer, never a copy. If a harness has no skill mechanism, put the trigger in
   the file it does read. List the files you wrote.
5. Record the off-limits answers in AGENTS.md (Ask first and rules 1-4). Wire the guard if
   I said yes. Then run bun scripts/agent-kit.mjs doctor --strict until it exits 0.
6. Run bun scripts/agent-kit.mjs verify and report the baseline honestly.

Report: the harnesses found and wired, the files you wrote, the detected stack, the commands
you found and any you could not, the `rtk` row, what you filled, the doctor table, and the
next action. Do not claim a step passed without showing its output. Do not start the first
task until I say go.
```

`SETUP.md` is the contract; if this prompt and that file ever disagree, `SETUP.md` wins.

## What setup does

`setup` detects your stack, writes `.agents/project.md`, copies the kit, installs
`rtk` (the token saver) when it is missing, and lists the coding agents found in HOME and on
PATH. It never overwrites a file that already exists.
`doctor --strict` exits non-zero until the fill work is done — that is the definition of
"set up", and the point of the whole thing.

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
| "which agents can drive this repo?" | `harnesses`, then wire each skill folder it names |
| "is this repo actually healthy?" | `doctor --strict` and reports the failing row |
| "what changed since the template?" | `check`, then `pull --dry-run` |
| "how much did rtk save?" | `rtk gain`, reported under the active task ID |

The only commands in this document that are yours to run are the ones inside a chat message.
If the agent asks you to open a terminal, that is a defect in its instructions, not a step in
the workflow. If its environment cannot execute commands at all, it must say so and stop: an
agent that cannot run the gates cannot claim the work is verified, and telling you to paste a
script moves the problem instead of solving it.

And when an agent commits outside its declared write set, the optional scope hook refuses it;
the message hook only warns:

```bash
git config core.hooksPath .githooks   # per clone, off by default
```

It is off by default on purpose. It is git config, not a repo file: every clone would
otherwise get a hook nobody asked for. The scope check also runs at `task close`. The message
check prints the expected shape and exits 0 — it never blocks a human's commit — and it stays
quiet until the repo's first task exists. Turn it on where an agent commits unattended; skip
it if your team would rather not have a hook.

A commit is one task and one kind of change. Its subject is
`fix (TASK-118): rate-limit the invite endpoint`; the body is the change file's summary.

## What the changelog is

It is a folder, not a ledger: `.agents/logs/MM-YYYY/YYYY-MM-DD-TASK-N-slug.md`, one file per
commit, written by `task close`. Each file says what happened (the title) and what changed
(the git inventory):

```
---
id: TASK-118
type: fixed
date: 2026-10-26
summary: "Rate-limited the invite endpoint"
---

# TASK-118 — Rate-limited the invite endpoint

## 🛠️ Fixed
- `src/routes/invites.ts`
- `src/limits.ts`
```

The task ID is the pointer to the evidence, and `doctor` fails an archived task with no file.
Nothing is folded into a second document, so there is nothing to keep in sync. If the repo also
publishes a user-facing `CHANGELOG.md`, that is a different audience and a separate file.

Both indexes list the five newest entries, so nobody scans a month folder to find out what
just happened: the task index links the archived plans, the logs index links the change files.

## Token economy

Shell output is the part of the context an agent pays for most often. `setup` installs
[rtk](https://github.com/rtk-ai/rtk), and `SKILL.md` runs the commands whose output the agent
inspects through it:

```bash
rtk git status      # compact, grouped
rtk npm test        # failures only
rtk gain            # what the filter saved
```

The command and its exit code are unchanged; only what reaches the context shrinks.
`rtk bypass <cmd>` runs one command unfiltered when the full text is the evidence, and
`verify` / `task close` never go through the filter, so gates keep their exact exit codes.

rtk's history is machine-wide, not per task. The skill reports savings under the active task
ID, and the change file carries the same ID, so a number in the report points at a record in
`.agents/logs/`.

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
| `doctor` | do the docs name real paths, is every kit directory indexed, do the commands exist, are the task and logs lists current, is rtk installed, is the encoding clean, is every rule checkable? |
| `check` | has the template moved since install, and did you edit machinery you should not have? |

Every one of them can fail. `selftest` asserts that by building a throwaway repo and
deliberately tripping each gate — from a red baseline to a scope breach.

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
harness with its own skill folder gets a four-line pointer, not a copy; `agent-kit harnesses`
finds them even when the repo shows no harness config.

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
