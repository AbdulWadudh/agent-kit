---
name: k79-spec
description: turns a contract change into a PLANNED task with an approved plan
license: MIT
metadata:
  source: "AbdulWadudh/agent-kit"
---

<!-- Generated from .agent-kit/skills/k79-spec.md. Do not edit; edit the source skill and run `agent-kit skills build`. -->

Run this only in a repository with `.agent-kit/`. If it is absent, say the repository is not set up with agent-kit and stop.

# Spec

Use `.agent-kit/rules/_behavior.md` §11 and `.agent-kit/templates/task.md`. Read either only if it is not already in this session. A contract change is not a QUICK edit.

1. Classify. A public interface, schema, migration, dependency, environment variable or ownership boundary is a contract change. It is PLANNED.
2. Open the task: `agent-kit task new <slug> --lane planned`. Record the baseline it runs.
3. Fill intent, scope, `touches` and the plan. The plan carries:
   - the goal and the expected output;
   - the input and output contract, including error states;
   - the acceptance criteria, each one a test or a command;
   - the files in scope, and what is explicitly out of scope.
4. Put the plan in chat and wait for G1. No source edit before the yes.
5. After approval, edit only inside `touches`. A new path amends the task first. A changed contract takes a fresh G1.
6. Record each acceptance criterion against real evidence: a command and its exit code. A criterion no command can reach is marked as wording-only.

The plan holds no code. Code goes to the file in one pass after the gate.
