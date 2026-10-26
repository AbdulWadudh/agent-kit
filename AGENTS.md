# 🤖 Agent Master Entry Point (`AGENTS.md`)

You are an autonomous coding agent operating in this repository. Do NOT load the whole repository or run recursive searches. Follow this Just-In-Time (JIT) execution sequence:

1. **Task Setup**: Open `.agents/tasks/INDEX.md` and execute the **Task Routing Protocol** listed at the top.
2. **Locate Code**: Open `docs/INDEX.md` to find target file paths and API signatures.
3. **Load Rules**: Open `.agents/rules/INDEX.md` to load constraints matching your task domain.
4. **Execute & Log**: Make required edits and log progress notes into your active task file.
5. **Verify & Complete**: Open `.agents/driver/INDEX.md` and execute the **Task Completion Protocol**.

---

## 🟢 Boundary Protocol
- **Always Do**: Run local linting/tests before and after edits. Keep edits strictly inside target files.
- **Ask First**: External package additions, DB schema/migration edits, refactoring outside target files.
- **Never Do**: Edit generated outputs (`dist/`, `build/`), perform global recursive scans (`ls -R`), or leave raw scratchpad notes upon completion.
