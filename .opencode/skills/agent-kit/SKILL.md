---
name: agent-kit
description: Install agent-kit into a repository, or drive the agent-kit workflow inside one — setup, the two task lanes (QUICK and PLANNED), the verification/evidence gates, and template drift. Use when the user says "set this repo up for agents", "install the template", "set it up with agent-kit", asks what the gates check, or when the repo already contains .agents/sync-manifest.json.
---

# agent-kit

The contract is `SETUP.md` (install) and `AGENTS.md` (working here). This skill is the
trigger and the boundary. If they disagree with it, they win and this file is the bug.

## Setting up a repository

Run from the target repo root. Bun or Node, same file.

```bash
git clone --depth 1 <template-url> "$TMPDIR/agent-kit"
bun "$TMPDIR/agent-kit/scripts/agent-kit.mjs" setup . --source <template-url>
bun scripts/agent-kit.mjs doctor --strict
```

Then do the only part that needs judgement, in this order: `AGENTS.md` markers and rules
1-4, `.agents/project.md` domain notes, then `docs/ARCH_MAP.md`, `docs/ENTRY_POINTS.md`,
`docs/API_SKELETON.md` from the real tree. `doctor --strict` exiting 0 is the definition of
set up. Report the detected stack, the commands found, and anything you could not find.

## Working in a repo that already has it

| Need | Command |
|---|---|
| what is in flight | `task show` |
| open work | `task new <slug> --lane quick\|planned` |
| prove it before and after | `verify --baseline`, then `verify` |
| close | `task close` |
| drift vs template | `check`, `pull --dry-run`, `pull` |
| truth check on the docs | `doctor --strict` |
| mechanical repair | `doctor --fix` |

## Do

- Read `AGENTS.md`, then `.agents/project.md`, before touching anything.
- Declare `touches` in the task **before** the first edit, and keep every edit inside it.
- Take the baseline run before the change and the evidence run after it. Two runs, two
  exit codes.
- Halt at G1 (plan approval) and G2 (result approval) in the PLANNED lane.
- Ask before a dependency, a schema change, a public interface change, or a deletion.
- Cite a rule's home (`docs/`, `.agents/rules/`, `project.md`) instead of restating it.

## Do not

- Do not run `setup` in the template repo itself, and do not hand-copy its files into a
  target. The hash baseline is what makes `check`/`pull` work.
- Do not edit machinery (`scripts/`, `.agents/sync-manifest.json`, `.agents/templates/`,
  `.agents/rules/INDEX.md`, `.agents/rules/_behavior.md`) to make a gate pass. That is
  `DRIFT`, and `pull --force` will take it back.
- Do not widen `touches` silently. `task close --amend "<reason>"` is the recorded way, and
  the reason lands in the archived plan.
- Do not claim a gate passed without its exit code. `task close` refuses an evidence table
  with a non-zero exit.
- Do not write a rule that reading a diff cannot check; `doctor` fails on vague advice.
- Do not hand-write a changelog line, an evidence table or a file inventory. The kit derives
  all three.
- Do not paste the plan into a subagent prompt. Give it the files, the deliverable and the
  stopping condition.

## Done means

`verify` exits 0, the task's evidence table holds real exit codes, `doctor` reports no
failures, and `task close` accepted the write set. Then report the outcome in the user's
words — what changed, what it cost, and what is still open.
