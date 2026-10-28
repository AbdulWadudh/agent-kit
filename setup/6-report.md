# 6. Report

Tell the owner, in plain words:

- what stack was detected and which commands were found (or which are missing);
- the id mode (`local` or `issue`), and in issue mode the repo and which credential source
  answered — `gh` or a token, never the token itself;
- which harnesses were found, and which of them now point at `.agent-kit/SKILL.md`;
- which files were filled and which placeholders you had to leave and why;
- the `doctor --strict` result;
- the next action: open a task with `agent-kit task new <slug> --lane planned`.

## Re-running

`setup` again: fills in anything missing, keeps everything present, refreshes the hash
baseline. Safe.

Later, to take template improvements: `check` (never writes) names the release tag this repo
tracks, whether a newer tag exists, and any file drift. `pull --dry-run` prints the diff per row,
then `pull --ref <tag>` moves the install. `pull` will not overwrite a file you modified unless
you pass `--force`, and reports `SEED-UPDATED` when an upstream seed changed after you authored
from it. The full procedure is `.agent-kit/prompts/upgrade.md`.

## What is deliberately checked in

`.agent-kit/tasks/active/` is committed. A task in flight is part of the repo's state, and a
future session resumes from it. The archive is committed too — it is the only record of why
a change happened.
