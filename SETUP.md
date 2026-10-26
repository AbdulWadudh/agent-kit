# Setup Contract

The one-time install that turns a repository into an agent-ready workspace. Idempotent:
running it twice changes nothing that already exists. Every step names its expected output,
because "the agent said it was done" is not a result.

## 0. Fetch the template

```bash
git clone --depth 1 <template-url> "$TMPDIR/agent-kit"
```

No git? Download the archive and unpack it. The only requirement is that
`scripts/agent-kit.mjs` and `.agents/sync-manifest.json` are reachable.

## 1. Scaffold

From the **target repo root**:

```bash
bun "$TMPDIR/agent-kit/scripts/agent-kit.mjs" setup . --source <template-url>
```

Fallback if Bun is absent: `node` instead of `bun`. Same file, same behaviour.

What it does, in order:

1. Reads the target's manifests and writes `.agents/project.md` — languages, package manager,
   `install`/`build`/`typecheck`/`lint`/`test`, entry points, generated directories.
2. Copies the machinery (the script, the workflow, the manifest, the seeds, the rule router).
3. Copies each seed to its authored path **only if the path is absent**.
4. Writes `.agents/template.json`: source, version, date, and a hash baseline per file.
5. Prints the fill list.

Expected output: `N copied, M kept, template v1`, a per-file table, then the four fill steps.

Guard rails: it never overwrites an existing file, and it refuses a directory whose
`template.json` says `"role": "template"` unless that directory is also the source (the
manual-copy fallback in `INIT_PROMPT.md`).

## 2. Fill

This is the only work that needs judgement. Four items, in this order:

| Item | What "filled" means |
|---|---|
| `AGENTS.md` | every `<!-- FILL:... -->` replaced; every `<UPPERCASE PLACEHOLDER>` replaced; rules 1-4 are constraints that are true **only** in this repo |
| `.agents/project.md` | the detected commands are correct; domain notes say what the code cannot |
| `docs/ARCH_MAP.md`, `docs/ENTRY_POINTS.md`, `docs/API_SKELETON.md` | one real row or signature per entry; no invented layer |
| `.agents/rules/typescript.md`, `database.md`, `anti-patterns.md` | delete what does not apply; keep the rest short |

Convention: **uppercase** placeholders are obligations. Lowercase `<like-this>` inside prose
is an illustration and is ignored by the checker.

## 3. Verify

```bash
bun scripts/agent-kit.mjs doctor --strict
```

Expected, before the fill: `FAIL — N failure(s)`, naming `unfilled markers` and any doc path
that does not exist.

Expected, after the fill: `PASS — 0 failure(s)`. Warnings are allowed and are listed; they
are not a reason to keep editing.

| Check | Fails when |
|---|---|
| required files | a kit file is missing |
| manifest integrity | an `owned` path is inside a `machinery` directory or is also a seed |
| encoding | a file is not UTF-8, has a BOM, or shows mojibake |
| unfilled markers | a `FILL` marker or uppercase placeholder survived (`--strict` only) |
| doc paths resolve | a path written in `docs/` or `.agents/` does not exist |
| markdown links resolve | an index link points at a missing file |
| declared commands | `project.md` names a package script that `package.json` does not have |
| active tasks indexed | a task file in `active/` is not in the task index |
| write-set collisions | two active tasks declare overlapping `touches` |

## 4. First verification baseline

```bash
bun scripts/agent-kit.mjs verify
```

Expected: one line per declared command, then `PASS — n/n command(s) exited 0`. A failure
here is the repo's problem, not the kit's: report it, do not work over it.

Commit the fill work before opening the first task. `task new` records the current `HEAD` as
the baseline, and `task close` derives the changed-file inventory from it — a repo with no
commit at all has no baseline to diff against.

## 5. Report

Tell the owner, in plain words:

- what stack was detected and which commands were found (or which are missing);
- which files were filled and which placeholders you had to leave and why;
- the `doctor --strict` result;
- the next action: open a task with `agent-kit task new <slug> --lane planned`.

## Re-running

`setup` again: fills in anything missing, keeps everything present, refreshes the hash
baseline. Safe.

Later, to take template improvements: `check` (never writes) then `pull`. `pull` will not
overwrite a file you modified unless you pass `--force`, and reports `SEED-UPDATED` when an
upstream seed changed after you authored from it.

## What is deliberately checked in

`.agents/tasks/active/` is committed. A task in flight is part of the repo's state, and a
future session resumes from it. The archive is committed too — it is the only record of why
a change happened.
