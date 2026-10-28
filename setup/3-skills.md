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
