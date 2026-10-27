# D08 Discovery Log — Task CRUD (DRAFT)

> **Draft status.** Claude drafted this log from the D08 session. Sections marked **[YOUR INPUT]** are left empty on purpose: they are for your own observations and conclusions, which should come from your review of the working app and the test evidence. Nothing in those sections has been filled in for you. Edit any drafted text that does not match what you remember.

Project: Club Task and Event Hub (`myra2507/capstone-paksa-task-board`), branch `claude/practical-euler-lwkor2`.

---

## 1. Specification

The CRUD specification as given at the start of D08:

* **Create** — An officer creates a task with a required task name and assignee, plus an optional description and due date.
* **Read** — The user can see the task list, including task name, assignee, completion status, and optional description and due date.
* **Update** — An officer can edit a task's details and assignee. A member can mark their own task complete or incomplete.
* **Delete** — An officer can delete a task, and it disappears from the list.

Constraints:

* No authentication or login.
* Plain HTML, CSS, and JavaScript.
* localStorage with seeded demo members and tasks for this D08 prototype; no Supabase setup and no added dependencies.
* Clearly document that localStorage is temporary prototype storage and that real Supabase integration is deferred.
* Follow the existing PRD wherever it applies; no unrelated features.
* Do not change the existing PRD or architecture document to make the implementation look consistent.

How the specification was applied to the PRD:

* **Read** has two views. Members see only their own tasks on the main hub (PRD Stories 1 and 4, §13), and officers see all tasks with assignee names on a separate officer page (PRD §10 Officer Management Areas).
* "Viewing as" is a demo user picker (PRD §11). It is not authentication.
* Mark complete appears only in a user's own My Tasks (architecture assumption 8).

---

## 2. Test table

Full steps, demo data, and notes are in [`d08-crud-checks.md`](d08-crud-checks.md). "Playwright" means an automated run in headless Chromium on 2026-10-27, in both UTC and America/New_York browser time zones. "Manual" means a person running the steps in a real browser.

| ID | Verb | Type | Action (short) | Expected visible result (short) | Playwright | Manual |
|---|---|---|---|---|---|---|
| C1 | Create | Happy | Officer creates a task with all fields | "Task created."; new row with all values | PASS | NOT RUN |
| C2 | Create | Happy | Assignee opens the hub | Task appears in My Tasks, Not complete | PASS | NOT RUN |
| C3 | Create | Happy | Create with name and assignee only | "No due date"; no description | PASS | NOT RUN |
| C4 | Create | Happy | Create with a past due date | Saved and labeled Overdue | PASS | NOT RUN |
| C5 | Create | Unexpected | Submit an empty form | Both required-field errors; nothing saved | PASS | NOT RUN |
| C6 | Create | Unexpected | Name of only spaces | Name error; nothing saved | PASS | NOT RUN |
| C7 | Create | Unexpected | Name but no assignee | Assignee error only; name kept; nothing saved | PASS | NOT RUN |
| C8 | Create | Unexpected | Refresh after saving | Task still listed | PASS | NOT RUN |
| C9 | Create | Unexpected | Double-click Save | Exactly one task created | PASS* | NOT RUN |
| C10 | Create | Unexpected | Name `<b>hi</b>` | Shown literally, not bold | PASS | NOT RUN |
| R1 | Read | Happy | Officer opens the officer page | All tasks with every field | PASS | NOT RUN |
| R2 | Read | Happy | Jordan opens the hub | Only Jordan's tasks | PASS | NOT RUN |
| R3 | Read | Happy | View a member with several tasks | Dated first (earliest first), undated last; completing keeps order | PASS | NOT RUN |
| R4 | Read | Happy | Due date 2026-11-03 | Shows Nov 3, 2026 (no shift) | PASS* | NOT RUN |
| R5 | Read | Unexpected | Member with no tasks | "You have no assigned tasks." | PASS | NOT RUN |
| R6 | Read | Unexpected | Nobody chosen yet | Prompt to choose; no tasks | PASS | NOT RUN |
| R7 | Read | Unexpected | Refresh after choosing | Same member and tasks | PASS | NOT RUN |
| R8 | Read | Unexpected | Clear localStorage, refresh | Demo data restored; no error | PASS | NOT RUN |
| R9 | Read | Unexpected | Corrupt saved tasks, refresh | Notice shown; demo data restored | PASS | NOT RUN |
| U1 | Update | Happy | Officer edits name, description, due date | "Task updated."; persists after refresh | PASS | NOT RUN |
| U2 | Update | Happy | Reassign Jordan → Sam | Shows for Sam, gone for Jordan | PASS | NOT RUN |
| U3 | Update | Happy | Member marks own task complete | Complete; persists after refresh | PASS | NOT RUN |
| U4 | Update | Happy | Mark a complete task incomplete | Not complete; persists | PASS | NOT RUN |
| U5 | Update | Happy | Complete an overdue task | Overdue label removed | PASS | NOT RUN |
| U6 | Update | Unexpected | Edit with the name cleared | Error; original unchanged | PASS | NOT RUN |
| U7 | Update | Unexpected | Change fields, then Cancel | Nothing changes | PASS | NOT RUN |
| U8 | Update | Unexpected | Clear the due date of an overdue task | "No due date"; no Overdue | PASS | NOT RUN |
| U9 | Update | Unexpected | Member opens the officer page by URL | "Officers only"; no controls | PASS | NOT RUN |
| U10 | Update | Unexpected | Save an edit after the task was deleted in another tab | "This task no longer exists…"; not recreated | PASS | NOT RUN |
| D1 | Delete | Happy | Delete, then OK | Confirmation names the task; row gone | PASS | NOT RUN |
| D2 | Delete | Happy | Assignee checks the hub | Task gone from My Tasks | PASS | NOT RUN |
| D3 | Delete | Unexpected | Delete, then Cancel | Task stays, unchanged | PASS | NOT RUN |
| D4 | Delete | Unexpected | Refresh after deleting | Stays gone | PASS | NOT RUN |
| D5 | Delete | Unexpected | Delete the task being edited | Form resets; task not saved back | PASS | NOT RUN |
| D6 | Delete | Unexpected | Delete every task | "No tasks yet."; hubs show the empty message | PASS | NOT RUN |
| D7 | Delete | Unexpected | Member looks for Delete | No Delete controls anywhere | PASS | NOT RUN |

\* See the notes in `d08-crud-checks.md`. C9: before building, Claude predicted that the second click would show empty-form errors; the automated run did not observe that. R4: the local-date "today" behavior used for Overdue is not specifically verified by automation.

---

## 3. Implementation decision and reason

**Decision (drafted from the session record):** Build task CRUD as a static site in plain HTML, CSS, and JavaScript. Store tasks and a fixed demo roster in the browser's localStorage, seeded on first load, with a "Viewing as" demo picker instead of login. `js/storage.js` stands in for the planned `js/supabase.js`. Supabase integration is deferred, and the PRD and architecture documents were left unchanged.

**Reason given in the D08 constraints:** this is a D08 prototype, and the constraints call for localStorage with seeded demo data, no Supabase setup, no added dependencies, and no authentication.

**My reason in my own words:** [YOUR INPUT]

---

## 4. What I corrected

Adjustments you made to Claude's proposed plan during the session, drafted from the conversation. Check that these match what you meant:

* Answered the two open questions: keep the browser's built-in `confirm()` for deletion, and add **no** reset button.
* Required separate reporting of automated Playwright results and manual browser results, with `NOT RUN` for anything not actually run, and no claimed pass without an observed result.
* Prohibited changing the acceptance criteria or weakening a check to make it pass.
* Asked for at least two unexpected-action tests per verb to be prioritized, with the remaining checks documented for manual runs.
* Asked that nothing be committed or pushed until you have reviewed the working app and evidence.

Corrections Claude made to its own work during the build (for the record):

* The first automated run's evidence note for U6 recorded the page message *after* the refresh but labeled it as "before cancel". The script was fixed to capture the message at the right moment and to assert its exact text, and the suite was re-run.

Corrections from my own review of the app and evidence: [YOUR INPUT]

---

## 5. Moments when I wanted authentication

[YOUR INPUT]

For reference only (a factual list of where this prototype relies on the demo picker instead of real identity, not a record of what you wanted):

* "Viewing as" lets anyone choose any member, including an officer.
* "Officers only" on `officer-tasks.html` is enforced by the page, not by any server (U9, D7).
* "A member can only complete their own task" is enforced by the page.
* Anyone with DevTools can edit localStorage directly (R9 uses this).

---

## 6. Hardest verb

**Placeholder — to be completed after you review the actual test evidence.**

Hardest verb: [YOUR INPUT]

Why, based on the evidence: [YOUR INPUT]
