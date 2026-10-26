# 📌 Task Index & Routing Hub

## 🛠️ TASK ROUTING PROTOCOL (Read & Execute First)
1. **Check Active Task**: Look at `Current Active Task` below. If a task is active, open it and resume work from the last logged step in its scratchpad.
2. **If New Task Needed**:
   - Read `.agents/tasks/.counter` (e.g. `100`), increment by 1 (`101`), and save `101` back to `.counter`.
   - Copy `.agents/tasks/templates/task-template.md` to `.agents/tasks/active/YYYY-MM-DD-TASK-101-<slug>.md`.
   - Update `Current Active Task` below with the new file path and set status to `IN_PROGRESS`.

---

## 🟢 Current Active Task
- **Active Task File**: None
- **Status**: `IDLE`

---

## 🕒 Recent Tasks (Last 5 Only)
| Date | Task ID | Description | Status | Path |
| :--- | :--- | :--- | :--- | :--- |
| `YYYY-MM-DD` | `TASK-100` | Initial template setup | ✅ Done | `.agents/tasks/archive/` |

---

## 🗄️ Historical Archive Rule
Tasks older than the recent 5 entries are archived in `.agents/tasks/archive/YYYY-MM/`. Do NOT read archived task files unless specifically instructed.
