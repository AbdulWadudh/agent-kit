# Releases

Read when cutting a release — the owner names a version, or accepts one you proposed.

## Cut it

`agent-kit release <version>` writes the note to `.agent-kit/releases/`, one file per version,
from every archived task that no earlier release claims. It prints the
`gh release create --notes-file` line. It refuses a version that already exists, and a version with
nothing new. Before it writes, it runs `verify --full` and refuses a red suite; `--no-verify` is
only for a deliberate cut. Build proof happens once per version, so a micro fix never pays for
it.

The file it writes: `# Release vX.Y.Z`, the date, then `### Added`, `### Changed`, `### Fixed` and
`### Removed`. Each entry is one task and one commit:

```md
### Added

**Rate-limit the invite endpoint** ([TASK-127](…/tasks/archive/…md) · [544f2dc](…/commit/544f2dc))
The invite endpoint now allows five requests a minute per address, and the limit is a constant.
```

The bold title is the task summary. The commit comes from `git log` on the archived task, so the
task must be committed before the note is cut; the command names any that are not.

An entry is the title, the commit link and 2–5 short bullets. One idea per bullet, no paragraph
over three lines. One commit is one entry: if a single commit carries additions, changes and
removals, keep one entry and label the bullets `- Added:`, `- Changed:`, `- Removed:`; never create
a second entry for the same commit just to reach another heading. Never repeat a commit link.

The note is authored, not generated. `agent-kit release --entries` lists the unclaimed tasks with
their commits and prints a template; the agent fills the bullets and writes
`.agent-kit/releases/<version>.md`. Code does not format prose, split paragraphs, or choose
headings. `release <version>` remains a draft generator for a script; do not ship its output as the
final note.

A `RELEASED` block names the tasks it claims — it is what the next release reads, so deleting an id
from it ships that task a second time. `PATCH-N` tasks batch with `TASK-N` tasks under the same
version and are claimed exactly once, so a second release never repeats one.

A correction is a new patch release; never rewrite a released note and never move a tag.

## Pick the number

The number is the owner's. Propose one with its reason and let them overrule it.

| Bump | When |
|---|---|
| major | an installed repo must edit a path or a command it already wired |
| minor | a new command, check or rule |
| patch | fixes and docs only |

`v1.0.0` is the first release of the install surface.

## Publish

Cut the note, commit it, then tag it. The tag is what makes a release installable — `setup --ref`
and `pull --ref` clone it, and `check` compares against it — and the tag's message **is** the note,
so `git show vX.Y.Z` and the GitHub release page carry the change list with no second copy to keep
in sync.

```bash
agent-kit release vX.Y.Z                # writes the note and prints the next lines
git add .agent-kit/releases/<version>.md && git commit -m "docs: release vX.Y.Z"
agent-kit release --tag vX.Y.Z          # annotated tag, message = the note
git push origin vX.Y.Z
gh release create vX.Y.Z --notes-file .agent-kit/releases/<version>.md
```

`release --tag` refuses a note that is not committed (the tag would carry a file its own tree lacks),
a version that already has a tag, and a missing note. `doctor`'s `release tags` row warns while a
note has no tag, so "cut but not tagged" cannot be forgotten. `gh release create` is the only step
that touches GitHub, and it runs when the owner asks for it.

A tag is a promise: never move one. A fix is a new patch tag, because an install pinned to the old
tag must keep building what it installed.
