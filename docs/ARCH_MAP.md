# 🗺️ Module Responsibility Matrix

| Path / Subdirectory | Purpose & Responsibility | Pure / Side-Effect | Import Constraints |
| :--- | :--- | :--- | :--- |
| `src/core/` | Domain logic & business rules | **Pure** | Cannot import DB/API directly |
| `src/db/` | Database ORM schemas & queries | **Side-Effect (I/O)** | Access only via query functions |
| `src/api/` | HTTP controllers & routes | **Side-Effect (I/O)** | Calls core and db modules |
| `src/utils/` | Shared string, date, math helpers | **Pure** | Zero external dependencies |
