# 3. Skills and MCP


`setup` installs none of these. **Ask the owner; install only what comes back yes.** One
message, in these words or close to them:

> Shall I install the recommended skills — ponytail, prompt-master, caveman and the anthropic
> skills? I have said what each one fixes below. And separately: agent-browser drives a real
> browser, including live sites and accounts, so it is opt-in — install that too, or leave it?

Then read the answer as a list: each yes is installed and reported, each no is dropped for this
repo and not asked again unprompted. Sources are in the table.

| Skill | Gap the kit's own loop does not close | Source |
|---|---|---|
| ponytail | over-building: the smallest change that works, and the check that proves it | https://github.com/DietrichGebert/ponytail |
| prompt-master | a prompt written for one tool instead of prose the owner can read | https://github.com/nidhinjs/prompt-master |
| caveman | token cost of long sessions | https://github.com/juliusbrussee/caveman |
| anthropic skills | documents, spreadsheets, slides, PDFs, frontend polish | https://github.com/anthropics/skills |

`agent-browser` is **opt-in and asked separately**. It drives a real browser: live sites,
accounts, local pages. Never install it because it looked useful; ask whether this repo needs
an agent that can load and click pages, and take a no. Source:
https://github.com/vercel-labs/agent-browser (skill at https://agent-browser.dev/skills).

Install with the harness's own mechanism (its skill folder, or its plugin command). Leave it
as a pointer, never a copy: `doctor`'s `skill pointers` row fails a copy of an installed
skill, because the first edit to either side would make the two disagree.

### Harnesses — ask the machine

A repo can show no harness files and still be driven by four agents; looking only at the tree
misses them. `setup` ends with `Harnesses found: ...`, and `agent-kit harnesses` prints the
same list with the evidence: known HOME config folders, binaries on `PATH`, and harness
markers in the repo.

Say the list in the report. Wire `.agent-kit/SKILL.md` for each harness with a repo skill folder — the
command prints those paths (Claude Code and OpenCode today). For the rest, the kit's entry
point is `AGENTS.md`; where a harness reads a different file, put the trigger there. A
pointer, never a copy: `doctor`'s `skill pointers` row fails a copy.

The list is a report, not a check. `doctor` cannot see the machine's harnesses, and a repo
with none of them is not broken.

Then say what MCP servers the harness already has, and use those before writing the
equivalent by hand. `doctor` cannot see MCP; that is a report line, not a check.

### Invokable procedures

Ask the owner which jobs they want and which harnesses to wire. The default set is `k79-commit`,
`k79-release`, `k79-debug` and `k79-spec`; a repo can drop one by editing `.agent-kit/invoke.json`.

```bash
agent-kit setup . --wire opencode          # create .opencode/commands and skills
agent-kit setup . --wire claude,agents     # or Claude Code, or the portable .agents copy
```

`--wire` is the opt-in that creates a harness folder when the repo has none. Without it, setup
wires only folders that already exist and records them in `.agent-kit/invoke.json`:

```json
{ "harnesses": ["opencode"], "jobs": ["k79-commit", "k79-release", "k79-debug", "k79-spec"] }
```

The file is `owned`: `pull` refreshes the pointers from it but never rewrites it. `agent-kit wire`
re-runs the selection at any time; `agent-kit wire --jobs k79-commit,k79-release` narrows it for
one run; `agent-kit wire --check` exits 1 when a configured pointer is missing or stale.

The pointers are small and name `.agent-kit/skills/<job>.md`; `doctor` fails a copy.
`agent-kit prompt <job>` prints the same procedure in any harness, including a client with no
adapter (T3 Code, a new CLI, CI). That is the portable fallback: nothing to register, just run it.

Ask the owner one more question: **"Should I install the repo's own `k79-*` skills into the
project's `.agents/skills`?"** That is `agent-kit skills install`, the cross-harness path.

Every file in `.agent-kit/skills/` is a skill, not only the four commands. Publish all of them
in the repo:

```bash
agent-kit skills install            # project .agents/skills
agent-kit skills install --check    # fail when an installed copy is stale
```

This is the cross-harness route: one project `.agents/skills` copy is recognized by every harness
that reads that folder, with no `.claude` or `.opencode` wiring. The `skills` CLI works too:
`bunx skills@latest add AbdulWadudh/agent-kit -y` as a project install, because `skills/` at the
repo root is generated from `.agent-kit/skills/` by `agent-kit skills build`.

Do not install these globally (`-g`). Each generated skill starts with "Run this only in a
repository with `.agent-kit/`"; a home copy would immediately stop in every other repo.
