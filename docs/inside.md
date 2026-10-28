# Inside the kit

## The skill

`.agent-kit/SKILL.md` is the work loop, and it is the only place that order lives: classify the request,
open a task, stop for the plan gate, edit inside the declared write set, prove it with real
exit codes, stop for the result gate, close, report. Pressure is where agents skip steps, so
the failure branches live there too — red suite, scope that grows, a suite you cannot run.

It is procedure, not knowledge. The repo's facts stay in `.agent-kit/project.md`, its rules in
`.agent-kit/rules/`, its install in `SETUP.md`. The skill cites them; it never restates them.

So install is not the skill's job — it happens once, before any of this exists, from the
README prompt. That is also why one file is enough for every harness: `AGENTS.md` lists it as
step 1 of "start here", so an agent reads the loop even where no skill mechanism exists. A
harness with its own skill folder gets a four-line pointer, not a copy; `setup` writes it when
the repo already keeps that folder, and `agent-kit harnesses` finds them even when the repo
shows no harness config.

Companion skills are recommended, not bundled: ponytail, prompt-master, caveman and the
anthropic skills — and `agent-browser` only if you say yes, because it drives a real browser
and can reach live sites and accounts. The sources and the exact question to ask are in
`SETUP.md` §3.

No plugin: a plugin is code that runs on every turn, and this needs instructions at the
moment the work starts. `examples/minimal/` shows a filled repo, for when you want to see the
target instead of reading about it.

## Adding a rule, or extending the kit

State the rule in chat; the agent writes it in the file that owns the domain, adds its trigger
to `.agent-kit/rules/INDEX.md`, and checks it. The steps — including how a rule is moved or
deleted — are in `.agent-kit/templates/INDEX.md`. A rule that stays in the conversation is gone
at the next session.

Extending the kit itself — a new command, seed, check or rule example — follows the
"What goes where" table in `AGENTS.md`. The gates are the contract: `selftest` has to show a
new check failing before it can be trusted.

## Staying current

An install follows a **release tag**, not the branch. `setup --ref v1.0.0` clones that tag;
omitting `--ref` takes the newest one, so an install never receives unreleased commits.
`.agent-kit/template.json` records `ref`, `release` and `commit`.

`check` never writes and prints one row per file: `CURRENT`, `UPGRADE`, `DRIFT`, `MISSING`,
`PRUNE`, `SEED-UPDATED`, plus a `release` row — `CURRENT`, `BEHIND` with the tag to move to, or
`UNPINNED` for an install that still tracks a branch. `pull` applies the safe rows, refuses to
overwrite a file you modified unless you pass `--force`, and never deletes without a `prune`
entry. `pull --ref v1.0.1` moves the install; `--ref` accepts any tag, so a jump backwards is a
choice, not an accident. Provenance and per-file hashes live in `.agent-kit/template.json`.

## What is deliberately not here

No sprint system, no persona fleet, no 10-phase pipeline, no per-rule report script, no
PowerShell engine, no plugin. Each of those is real machinery with a real maintenance cost,
and none of them earns that cost at this size. If a repo outgrows this, add one thing at a
time and give it a check.
