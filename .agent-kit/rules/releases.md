# Releases

Read when cutting a release — the owner names a version, or accepts one you proposed.

## Cut it

`agent-kit release <version>` writes the note to `.agent-kit/releases/`, one file per version,
from every change file under `.agent-kit/logs/` that no earlier release claims. It prints the
`gh release create --notes-file` line. It refuses a version that already exists, and a version with
nothing new.

The file it writes: `# Release vX.Y.Z`, the date, then `### Added`, `### Changed`, `### Fixed` and
`### Removed`, one line per task, and a `RELEASED` block naming the tasks it claims. That block is
what the next release reads; deleting an id from it ships that task a second time.

## Pick the number

The number is the owner's. Propose one with its reason and let them overrule it.

| Bump | When |
|---|---|
| major | an installed repo must edit a path or a command it already wired |
| minor | a new command, check or rule |
| patch | fixes and docs only |

`v1.0.0` is the first release of the install surface.

## Publish

Stage the release file and the change files it claims, by path — never the tree. The commit and
its message follow `commits.md`. The tag is what makes the release installable: `setup --ref` and
`pull --ref` clone it, and `check` compares against it. So cut the note, commit it, then tag that
commit:

```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z" && git push origin vX.Y.Z
```

`gh release create vX.Y.Z --notes-file <file>` is the only step that touches GitHub, and it runs
when the owner asks for it, not as part of the release command. `release` never runs git; it
prints both lines.

A tag is a promise: never move one. A fix is a new patch tag, because an install pinned to the old
tag must keep building what it installed.
