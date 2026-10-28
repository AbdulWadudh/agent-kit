# Take a template upgrade

Runs when the owner says "upgrade agent-kit" or "what changed in the template?". The kit upgrades
itself from the source recorded at install; no product code is touched.

## 1. Ask the source, do not guess

`agent-kit check` never writes. It clones the recorded source and prints one row per file:
`UPGRADE` (upstream moved, yours untouched), `DRIFT` (you edited it), `MISSING`, `PRUNE`,
`SEED-UPDATED`, `AHEAD`. `IN SYNC` means stop and say so.

There is no release number to compare: `template version` is the manifest schema version, and
`.agent-kit/releases/` is not installed. Report the files that changed, not a version.

A recorded source that no longer exists (a deleted local clone): `check --source <path|url>`.

## 2. Show it before writing

`agent-kit pull --dry-run` prints the planned rows and a unified diff each. Report one line per
row and what capability it brings. The owner decides before step 4.

## 3. Open the task

`agent-kit task new upgrade-agent-kit --lane quick`, `touches: [".agent-kit/", "AGENTS.md"]`.
`pull` writes files no task declared, and `task close` scope-checks the diff.

## 4. Pull

`agent-kit pull` writes `UPGRADE` and `MISSING` only. It skips `DRIFT` (your edit) and
`SEED-UPDATED` (your authored file) unless `--force` / `--seeds`, which overwrite work — so the
owner's yes comes first, and `--force` only after the step 2 diff. It ends by running `doctor`.

## 5. Prove and log

`doctor --strict` exits 0 and `selftest` still passes, then `task close` and commit the pull as
one change. A row left `DRIFT` means this repo and upstream now disagree on purpose: give the
reason in the change file, or restore the local copy and pull again.
