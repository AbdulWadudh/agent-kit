# Init Prompt

Paste this into a fresh agent session inside the repository you want to set up. Replace the
URL with this template's repository.

```text
Set up agent-kit in this repository: <template-url>

Follow SETUP.md from that repository exactly. In short:
1. git clone --depth 1 <template-url> "$TMPDIR/agent-kit"
2. bun "$TMPDIR/agent-kit/scripts/agent-kit.mjs" setup . --source <template-url>
   (use node if bun is not installed)
3. Fill AGENTS.md, .agents/project.md, docs/ARCH_MAP.md, docs/ENTRY_POINTS.md,
   docs/API_SKELETON.md and the three rule seeds from the REAL tree. Do not invent a
   path, a command or a layer.
4. bun scripts/agent-kit.mjs doctor --strict   -- must exit 0
5. bun scripts/agent-kit.mjs verify           -- report the baseline honestly

Then report: detected stack, the commands you found (and any you could not find),
what you filled, the doctor table, and the next action. Do not claim a step passed
without showing its output.
```

## Why this prompt is short

It names a contract (`SETUP.md`) instead of restating it. That is the same rule the template
enforces on the codebase: one home per fact. If this prompt and `SETUP.md` ever disagree,
`SETUP.md` wins and this file is the bug.

## If the agent cannot clone

Two fallbacks, in order:

1. **Archive.** Download the repository's zip, unpack to a temp directory, run the same
   `setup` command with that path as `--source`.
2. **Manual copy.** Copy `scripts/`, `.agents/` and `docs/` into the target, then run
   `bun scripts/agent-kit.mjs setup . --source .` from the target root. The script adopts
   the repo in place: it records the hash baseline of what is already there and clears
   `source`, so `check` and `pull` report "not set up" until you install from a real source.

The manual path loses history, not correctness: without a recorded `--source`, drift
against the template cannot be measured. Prefer the clone when git is available.
