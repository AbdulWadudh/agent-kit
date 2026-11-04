# Rule file example — data, queries and migrations

Not installed. Copy this to `.agent-kit/rules/database.md` when the repo owns a database. Delete a
line that is not true here; a rule that is merely aspirational teaches the agent something false.

1. **Migrations are append-only.** Never edit a migration that has run anywhere. Write a new one.
2. **Queries go through the data layer.** Controllers and handlers do not contain SQL or ORM calls;
   they call the query module named in `.agent-kit/docs/ARCH_MAP.md`.
3. **Destructive commands need an explicit yes.** A drop, truncate, mass update or restore is
   confirmed by the user first, every time, even in a script.
4. **Schema changes update the knowledge docs in the same task.** `.agent-kit/docs/` describes the
   shape that exists, not the shape you are hoping for.
5. **Select only the columns you use.** No unbounded `SELECT *` or full ORM document when a list
   endpoint needs three fields.
6. **No N+1.** Nothing queries inside a loop; use a join, eager loading or one batched lookup.
7. **Every list is bounded.** A default limit and a hard server ceiling, cursor pagination on an
   indexed column instead of deep `OFFSET`.
8. **Transactions wrap multi-writes.** Two or more tables change in one transaction; never make an
   external HTTP call inside an open transaction.
9. **One shared pool per process.** A new client per request is a leak, not isolation.
10. **Index what you filter, join and sort.** Use a concurrent index build on a large table, and
    never run a destructive push without approval.
