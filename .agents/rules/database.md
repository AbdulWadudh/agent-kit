# 🗄️ Database & ORM Safety Rules

1. **Migrations**: Never edit existing migration files once executed. Create a new migration file.
2. **Query Layer**: Do NOT write raw DB queries inside controllers. Route all queries through `src/db/queries/`.
3. **Approval**: Always ask user confirmation before running destructive database commands.
