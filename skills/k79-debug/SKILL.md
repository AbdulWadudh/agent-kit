---
name: k79-debug
description: reproduces, isolates, fixes one variable, stops after two failed attempts
license: MIT
metadata:
  source: "AbdulWadudh/agent-kit"
---

<!-- Generated from .agent-kit/skills/k79-debug.md. Do not edit; edit the source skill and run `agent-kit skills build`. -->

Run this only in a repository with `.agent-kit/`. If it is absent, say the repository is not set up with agent-kit and stop.

# Debug

Use `.agent-kit/rules/_behavior.md` §1 and §8. If it is not already in this session, read only those sections; never re-read a loaded file. A fix without a reproduced cause is a guess.

1. Reproduce. Capture the exact command, the error text, and the `file:line` where it fails. Record the command in the task evidence.
2. Trace the data flow to the first point where actual state diverges from expected state. State that point before editing.
3. Change one variable at a time. Verify with the narrowest command that can show the difference: the failing test, then the type checker, then the full suite.
4. **Two-strike stop.** When two consecutive attempts fail on the same error: stop editing, revert the failed edits, and report:
   - the exact error and what the two attempts proved;
   - the root-cause hypothesis and why the standard fixes missed it;
   - two concrete options, with their cost.
5. Do not widen the task to unrelated failures. Park them in `.agent-kit/tasks/BACKLOG.md`.
6. A green run that was already green before the change proves nothing. Compare against the recorded baseline.

The three-identical-red-runs loop guard is separate: `verify` refuses a fourth identical attempt until the plan says what changes.
