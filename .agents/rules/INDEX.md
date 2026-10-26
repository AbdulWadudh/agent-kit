# Rules Index

**Why** — a rule is written once and loaded only where it applies, so an unrelated task does
not pay for it.

**Load it when** — every session. Open `_behavior.md`; add only the domain files whose "read
when" column matches the files you will touch. Load only what matches.

| Domain | File | Read when |
|---|---|---|
| Behaviour | `_behavior.md` | every session |
| Repo memory | `learnings.md` | before planning anything |
| Hallucination guards | `anti-patterns.md` | adding an import, endpoint or dependency |

The domain files here are the two every repo needs. Add one more per domain you actually
have — `typescript`, `database`, `payments`, `auth`, `mobile` — by copying the matching
example from `.agents/templates/rule-examples/` and editing it. A domain with no file is a
domain with no rule.

Two invariants `doctor` enforces:

- **A row without a file fails.** Every row above must resolve, so this table cannot rot silently.
- **A rule reading a diff cannot check fails.** "Handle X sensibly" is advice; "no `any` in a
  diff" is a rule. The check is a phrase list, so it is a floor, not a proof.

**One home per fact.** If a rule appears twice, one copy is already wrong: keep the home,
replace the other with a pointer.
