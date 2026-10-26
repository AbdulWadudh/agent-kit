# Data and Migrations

Delete this file if the repo has no database.

1. **Migrations are append-only.** Never edit a migration that has run anywhere. Write a new one.
2. **Queries go through the data layer.** Controllers and handlers do not contain SQL or ORM
   calls; they call the query module named in `docs/ARCH_MAP.md`.
3. **Destructive commands need an explicit yes.** A drop, truncate, mass update or restore is
   confirmed by the user in the conversation first, every time, even in a script.
4. **Schema changes update the knowledge docs in the same task.** `docs/` describes the shape
   that exists, not the shape you are hoping for.
