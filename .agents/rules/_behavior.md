# Behaviour — how work is done here

Cross-cutting rules. They apply to every task, every file, every agent.

## 1. Evidence, not memory

- Before a task: `agent-kit verify` establishes the baseline. A red baseline is reported,
  never worked over.
- After a task: `agent-kit verify` again, and `agent-kit task close` derives the changed
  files from git. What the session remembers is not an inventory.
- A gate is cleared by a command and its exit code, never by a sentence saying it passed.

## 2. One home per fact

A rule is written once. Every other surface carries a pointer, at most one operative
sentence plus a link. If you are about to write the same rule twice, you are about to
create a contradiction with a delay on it.

## 3. Plans contain no code

A plan states intent, steps, files and acceptance criteria. Code goes to the file, in one
pass. The only literals a plan may contain are exact strings: a regex, a migration, a CLI
command, a config key, an error message. A plan full of code has already done the work
without review.

## 4. Chunked writes

Never materialise a large file in one write. Create the skeleton (headings plus one
placeholder per section), then fill each section with its own small edit. A write
overwrites; it does not append.

## 5. Ask first

Stop and ask before: adding a dependency, changing a schema or migration, changing a
public interface, deleting files, rewriting generated output, or doing anything that
cannot be undone with `git revert`.

## 6. Subagent contract

Every subagent prompt carries: the files to read, the deliverable, and the stopping
condition. It never carries the plan's prose, and it never asks the subagent to rediscover
context this agent already holds.

## 7. Learnings get promoted, not accumulated

A learning enters `learnings.md` as one line. When the same lesson is needed a second
time, it is promoted into the rule file it belongs to and deleted from the list. The cap
is 30 entries — `agent-kit doctor` warns past it.

## 8. The simplicity ladder

Before adding a rule, script, check or file, stop at the first rung that holds:

1. Does it need to exist at all?
2. Does something here already do it?
3. Does the platform or standard library do it?
4. Does an installed dependency do it?
5. Can it be one line a reader gets at a glance?
6. Otherwise: the minimum that works.

## 9. Talk to the owner in their language

The user is the product owner; the agent is the dev. Report outcomes first, in plain
words. Name the risk and the cost. Leave the jargon in the code.
