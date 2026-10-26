# Rules Index

Load only what matches the work. Read `_behavior.md` every session.

| Domain | File | Read when |
|---|---|---|
| Behaviour | `_behavior.md` | every session |
| Repo memory | `learnings.md` | before planning anything |
| Language and style | `typescript.md` | editing TypeScript or JavaScript |
| Data | `database.md` | schemas, migrations, queries |
| Hallucination guards | `anti-patterns.md` | adding an import, endpoint or dependency |

A domain with no file is a domain with no rule. If you need one, add a file and one row
here — never a row without a file.

**One home per fact.** If a rule appears twice, one copy is already wrong: keep the home,
replace the other with a pointer. `agent-kit doctor` fails on index rows that point at a
missing file, so this table cannot rot silently.
