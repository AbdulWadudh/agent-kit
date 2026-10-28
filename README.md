# agent-kit

A template that turns any repository into a place where a coding agent can work predictably.

It is one idea: **the work has one home, the gates have evidence, and the setup can be
verified.** Everything here serves that, and anything that stops serving it gets deleted.

## What you get

- `AGENTS.md` — the entry point. Read once, then follow its start-here steps.
- `.agent-kit/project.md` — generated from your manifests: stack, real build/test/lint commands
  with a tier (`always` on every verify, `milestone` at the baseline and close), entry points,
  generated directories. One home, cited by everything else.
- `.agent-kit/tasks/` — one task file per unit of work, with a lane (QUICK or PLANNED), two
  gates, an evidence table that records each run's scope, and a close-out that derives the
  changed files from git. A task can park on an owner question (`task block`) without holding
  the single in-progress slot. A parked candidate lives in `BACKLOG.md` with a status; it is
  not a task until `task new` opens it.
- Task ids — one allocator per repo, chosen at setup. `ids: local` takes the next number on
  disk, entirely offline; `ids: issue` mints a GitHub issue and uses its number, so
  collaborators share one board and there is never a `TASK-131` beside an `#131`. `task new
  --summary "…" --intent "…"` writes the issue's title and body (the title is the card's summary
  too), `task publish` sends the approved plan, `task close --sync` closes the issue with the
  final record, and `task new --from 42` imports an issue someone else opened. A repo that ran
  on local ids first keeps them: `task migrate` opens a closed issue for each archived task,
  titled `TASK-N — summary`, so the history is visible too.
- `.agent-kit/rules/` — a router plus short rule files. One home per rule; indexes cite. Ready-made
  examples for TypeScript, Bun, Biome, API versioning, config and library docs sit in
  `.agent-kit/templates/rule-examples/`; you install only the ones that are true.
- `.agent-kit/docs/` — the knowledge seed: architecture map, API skeleton, entry points, and
  `.agent-kit/prompts/docs-populate.md`, the pass that fills them from `path:line` evidence,
  interviews the gaps, moves exception comments into learnings and TODOs into the backlog.
- `.agent-kit/prompts/` — the long jobs a session runs instead of improvising them: filling the
  docs from evidence, trimming `AGENTS.md` back to its constraints. One file per job, run as a task.
- Indexed directories — every directory the kit owns has an `INDEX.md` saying what lives there,
  why, and when to open it. A session reads one index and one file, never a folder listing, so
  the always-on context stays small. `doctor` fails an unindexed directory.
- `.agent-kit/SKILL.md` — the work loop: classify, open, gate, verify, close, report.
- `rtk` — the token saver: setup installs it when missing, and the skill runs shell output
  through it (`rtk git status`, `rtk npm test`) so the agent reads less of it.
- `agent-kit harnesses` — lists the coding agents installed on the machine (HOME config, PATH,
  repo markers), so a repo with no harness files still gets the skill wired for each one.
- `examples/minimal/` — what a filled repo looks like, for a fictional project.
- `.agent-kit/agent-kit.mjs` — the only entry point; it imports a module or folder per command
  area from `.agent-kit/lib/`. Zero dependencies. Bun or Node.

## Start here

Copy the block below into a fresh agent session **in the repository you want to set up**, then
answer its six questions. The template URL is already in it.

```text
Set up agent-kit in this workspace: https://github.com/AbdulWadudh/agent-kit

Read the repo before you ask anything: manifests, entry points, and which rule examples in
the template fit this codebase; a rule about a language this repo does not use does not get
installed. Repo harness config is a hint, not the list: after setup, run
`.agent-kit/agent-kit.mjs harnesses` and say which harnesses you found — the machine may have
several while the repo shows none. Setup writes the pointer where the repo already keeps that
harness's folder; wire the rest, and say which are left.

Then ask me these six questions, and wait for the answers before changing anything:

1. Harnesses: after setup I will detect them from HOME, PATH and the repo. Is there one
   installed somewhere unusual that the detection may miss?
2. Task ids: will other people open tasks in this repo too? If the repo is on GitHub I can
   take each task id from its issue number — one number everywhere, and the board shows what
   everyone is doing. That needs `gh auth login` (recommended) or a `GH_TOKEN` with Issues
   read/write, and setup validates it once. If it is just me, or I want everything offline,
   ids are allocated locally and nothing touches the network. Which one — and if issue, is
   the repo yours to open issues in? If I say issue, run setup with `--ids issue`; otherwise
   `--ids local`.
3. Should the commit guard be wired on this clone? It refuses a commit that leaves the
   active task's write set, and warns — never blocks — on a message that does not name the
   task and carry a summary. It is git config, so it is off by default.
4. What is off-limits: directories, generated or vendored paths, secrets, anything you must
   ask before changing?
5. What is the first task you want to hand over?
6. Skills: shall I install the recommended ones — ponytail, prompt-master, caveman and the
   anthropic skills? Ask me, install only what I say yes to, and say what each is for.
   Separately, on its own: agent-browser drives a real browser, including live sites and
   accounts, so it is opt-in — ask me that one apart from the rest.

Then run every step yourself; I am in chat, not a terminal. Follow SETUP.md from the
template exactly — it wins if it disagrees with this message:

1. git clone --depth 1 https://github.com/AbdulWadudh/agent-kit "$TMPDIR/agent-kit"
   bun "$TMPDIR/agent-kit/.agent-kit/agent-kit.mjs" setup . --source https://github.com/AbdulWadudh/agent-kit --ids <the answer to question 2>
   (node instead of bun if Bun is absent; download the archive and pass the unpacked
   path as --source if git is unavailable. Setup installs rtk, the token saver, when it is
   missing — rtk, git and Node 18+ (or Bun) are prerequisites, and setup exits non-zero
   without them, so fix one rather than passing --no-rtk. Do not add --no-rtk to get past it.)
2. Fill AGENTS.md, .agent-kit/project.md, .agent-kit/docs/ARCH_MAP.md, .agent-kit/docs/ENTRY_POINTS.md and
   .agent-kit/docs/API_SKELETON.md from the real tree. Ask, do not invent: propose candidates for
   rules 1-4 from my answers and the code, get a yes, then write them. Install the rule
   examples that are true here — code, config, api — and say which ones you skipped and why.
3. Install the skills I approved for each harness (SETUP.md §3), and list the files you wrote.
   If I said yes to agent-browser, install it and its skill; if I said no, do not.
4. Run `.agent-kit/agent-kit.mjs harnesses`, say the list, then wire the skill for every harness
   setup left in a `Wire the skill for each:` line. Take the frontmatter (name and description)
   from .agent-kit/SKILL.md, put it in that harness's skill folder, and make the body one line:
   "Read .agent-kit/SKILL.md at the repository root." A pointer, never a copy. Do not rewrite a
   pointer setup already wrote. If a harness has no skill mechanism, put the trigger in the file
   it does read. List the files you wrote.
5. Record the off-limits answers in AGENTS.md (Ask first and rules 1-4). Wire the guard if
   I said yes. Then run bun .agent-kit/agent-kit.mjs doctor --strict until it exits 0.
6. Run bun .agent-kit/agent-kit.mjs verify --full and report the baseline honestly.

Report: the harnesses found and wired, the files you wrote, the detected stack, the commands
you found and any you could not, the `rtk` row, the task-id mode (and in issue mode the repo
and whether gh or a token answered — never the token itself), what you filled, the doctor
table, and the next action. Do not claim a step passed without showing its output. Do not
start the first task until I say go.
```

`SETUP.md` is the contract; if this prompt and that file ever disagree, `SETUP.md` wins.

## Read next

The rest of the guide is split by what you are doing:

- [docs/INDEX.md](docs/INDEX.md) — the map
- [docs/using.md](docs/using.md) — setup output, daily use, the changelog, token economy, lanes and gates
- [docs/inside.md](docs/inside.md) — the skill, adding a rule, staying current, what is not here
