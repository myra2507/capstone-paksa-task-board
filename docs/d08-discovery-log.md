# D08 Discovery Log — Task CRUD

Project: Club Task and Event Hub (`myra2507/capstone-paksa-task-board`), branch `claude/practical-euler-lwkor2`.
Built with Claude Code. Full check list and results: [`d08-crud-checks.md`](d08-crud-checks.md).

**How evidence is labeled in this log**

* **Automated (Playwright):** run by Claude in a headless Chromium browser in the Claude Code cloud container on 2026-10-27. I did not run these.
* **Manual (me):** observations I recorded while using the app myself in my own browser on my own computer.
* **Reflection:** my reasoning after the build. It is not test evidence.

---

## 1. Specification

### CRUD definitions

For this prototype, the four verbs mean:

* **Create** — An officer creates a task with a **required** task name and a **required** assignee (exactly one roster member), plus an **optional** description and an **optional** due date (calendar date only; past dates allowed). If the name or assignee is missing, the task is not saved and the missing field is identified. A new task starts as not complete.
* **Read** — A user sees a task list showing each task's name, assignee, completion status, and its description and due date when they exist. A member's main hub shows **only their own** tasks (PRD Stories 1 and 4). An officer can see **all** tasks with assignee names on the separate officer page (PRD §10). Tasks with due dates come first (earliest first), tasks without due dates come last, no due date is invented, and incomplete past-due tasks are labeled Overdue.
* **Update** — An officer edits a task's name, description, due date, and assignee (reassignment). A reassigned task appears only for the new assignee. A member marks **their own** task complete or incomplete. Saving an edit with a missing required field is blocked.
* **Delete** — An officer deletes a task after confirming in the browser's `confirm()` dialog. Cancelling keeps the task. After deletion the task disappears from every list.

### Constraints

* No authentication or login. A "Viewing as" demo picker identifies the current member and role (PRD §11).
* Plain HTML, CSS, and JavaScript, with no added dependencies.
* localStorage with seeded demo members and tasks; no Supabase setup.
* Follow the PRD wherever it applies, with no unrelated features. Events and roster management are not part of D08.
* The PRD and architecture documents were not changed to match the implementation.

---

## 2. Implementation decision: localStorage as temporary prototype storage

**Decision:** Tasks and a fixed demo roster are stored in the browser's localStorage. The demo data (4 fake members, 5 tasks) is loaded the first time the app opens. `js/storage.js` takes the place of the planned `js/supabase.js` for this prototype only.

**Why localStorage for D08:**

* D08 is about discovering how task CRUD should behave. localStorage let the full Create, Read, Update, and Delete flow be built and tested without first creating a database, tables, and access policies.
* It needs no account, no server, no API keys, and no dependencies, which fits the plain HTML/CSS/JS constraint.
* Saved data survives a page refresh, so the PRD requirement that "changes are reflected after the app is refreshed" (Story 10) could still be checked (C8, U1, U3, D4).

**Limits, and why it is temporary:**

* Data exists only in one browser on one computer. Officers and members on different devices would not see the same tasks, so it cannot support a real club.
* Clearing site data erases all changes (check R8). Anyone with DevTools can edit the data directly (check R9).
* Rules such as "officers only" are enforced only by the page code (check U9).

**Supabase is deferred.** The planned backend in `docs/03-architecture.md` and `docs/decisions/0001-backend-stack.md` is still Supabase (PostgreSQL). Those documents were left unchanged, and replacing `js/storage.js` with Supabase calls is future work.

---

## 3. Test table

36 checks: 15 happy-path and 21 unexpected-action checks (unexpected: Create 6, Read 5, Update 5, Delete 5).

* **Automated:** 36/36 passed in a UTC run, and 36/36 passed in an America/New_York time-zone run.
* **Manual:** 2 checks passed (R6, R2) and 34 are NOT RUN. My other observations matched only part of a check, so those checks stay NOT RUN (see §4).

| ID | Verb | Type | Action (short) | Expected visible result (short) | Automated (Playwright) | Manual (me) |
|---|---|---|---|---|---|---|
| C1 | Create | Happy | Officer creates a task with all fields | "Task created."; new row with all values | PASS | NOT RUN (partial: M4) |
| C2 | Create | Happy | Assignee opens the hub | Task appears in My Tasks, Not complete | PASS | NOT RUN |
| C3 | Create | Happy | Create with name and assignee only | "No due date"; no description | PASS | NOT RUN (partial: M4) |
| C4 | Create | Happy | Create with a past due date | Saved and labeled Overdue | PASS | NOT RUN |
| C5 | Create | Unexpected | Submit an empty form | Both required-field errors; nothing saved | PASS | NOT RUN (partial: M5) |
| C6 | Create | Unexpected | Name of only spaces | Name error; nothing saved | PASS | NOT RUN (partial: M5) |
| C7 | Create | Unexpected | Name but no assignee | Assignee error only; name kept; nothing saved | PASS | NOT RUN |
| C8 | Create | Unexpected | Refresh after saving | Task still listed | PASS | NOT RUN |
| C9 | Create | Unexpected | Double-click Save | Exactly one task created | PASS* | NOT RUN |
| C10 | Create | Unexpected | Name `<b>hi</b>` | Shown literally, not bold | PASS | NOT RUN |
| R1 | Read | Happy | Officer opens the officer page | All tasks with every field | PASS | NOT RUN |
| R2 | Read | Happy | Jordan opens the hub | Only Jordan's tasks | PASS | **PASS (M2)** |
| R3 | Read | Happy | View a member with several tasks | Dated first (earliest first), undated last; completing keeps order | PASS | NOT RUN |
| R4 | Read | Happy | Due date 2026-11-03 | Shows Nov 3, 2026 (no shift) | PASS* | NOT RUN |
| R5 | Read | Unexpected | Member with no tasks | "You have no assigned tasks." | PASS | NOT RUN |
| R6 | Read | Unexpected | Nobody chosen yet | Prompt to choose; no tasks | PASS | **PASS (M1)** |
| R7 | Read | Unexpected | Refresh after choosing | Same member and tasks | PASS | NOT RUN |
| R8 | Read | Unexpected | Clear localStorage, refresh | Demo data restored; no error | PASS | NOT RUN |
| R9 | Read | Unexpected | Corrupt saved tasks, refresh | Notice shown; demo data restored | PASS | NOT RUN |
| U1 | Update | Happy | Officer edits name, description, due date | "Task updated."; persists after refresh | PASS | NOT RUN |
| U2 | Update | Happy | Reassign Jordan → Sam | Shows for Sam, gone for Jordan | PASS | NOT RUN |
| U3 | Update | Happy | Member marks own task complete | Complete; persists after refresh | PASS | NOT RUN (partial: M3) |
| U4 | Update | Happy | Mark a complete task incomplete | Not complete; persists | PASS | NOT RUN |
| U5 | Update | Happy | Complete an overdue task | Overdue label removed | PASS | NOT RUN |
| U6 | Update | Unexpected | Edit with the name cleared | Error; original unchanged | PASS | NOT RUN |
| U7 | Update | Unexpected | Change fields, then Cancel | Nothing changes | PASS | NOT RUN |
| U8 | Update | Unexpected | Clear the due date of an overdue task | "No due date"; no Overdue | PASS | NOT RUN |
| U9 | Update | Unexpected | Member opens the officer page by URL | "Officers only"; no controls | PASS | NOT RUN |
| U10 | Update | Unexpected | Save an edit after the task was deleted in another tab | "This task no longer exists…"; not recreated | PASS | NOT RUN |
| D1 | Delete | Happy | Delete, then OK | Confirmation names the task; row gone | PASS | NOT RUN (partial: M6b) |
| D2 | Delete | Happy | Assignee checks the hub | Task gone from My Tasks | PASS | NOT RUN |
| D3 | Delete | Unexpected | Delete, then Cancel | Task stays, unchanged | PASS | NOT RUN (partial: M6a) |
| D4 | Delete | Unexpected | Refresh after deleting | Stays gone | PASS | NOT RUN |
| D5 | Delete | Unexpected | Delete the task being edited | Form resets; task not saved back | PASS | NOT RUN |
| D6 | Delete | Unexpected | Delete every task | "No tasks yet."; hubs show the empty message | PASS | NOT RUN |
| D7 | Delete | Unexpected | Member looks for Delete | No Delete controls anywhere | PASS | NOT RUN |

\* C9: Claude predicted that the second click would show empty-form errors; the automated run did not show them (see §6). R4: the automated runs do not specifically prove that "today" for the Overdue label is the local date rather than the UTC date.

### Key unexpected-action evidence

| Check | Unexpected action | What happened | Evidence |
|---|---|---|---|
| C5 | Save an empty form | Both field errors shown and "The task was not saved. Fix the marked fields."; row count unchanged | Automated |
| C6, C7 | Name of only spaces; name with no assignee | The right field error each time; nothing saved; typed name kept | Automated |
| C9 | Double-click Save | Exactly one task created | Automated |
| C10 | HTML in the task name | Shown as plain text, not run as HTML | Automated |
| R8, R9 | Clear or corrupt localStorage | Demo data restored; R9 shows a visible notice instead of a blank page | Automated |
| U6, U7 | Save an edit with the name cleared; Cancel an edit | Original task unchanged, also after refresh | Automated |
| U9, D7 | A member opens the officer page by URL | "Officers only" and no create/edit/delete controls | Automated |
| U10 | Save an edit to a task deleted in another tab | "This task no longer exists…"; the task is not recreated | Automated |
| D3 | Cancel the delete confirmation | Task stays, also after refresh | Automated; partly confirmed by me (M6a) |
| D5 | Delete the task that is open in the edit form | Form resets; the task cannot be saved back | Automated |
| — | Blank task name with an assignee selected | Validation shown; task not created | Manual only (M5); no automated check uses this exact input |

---

## 4. My manual review

I cloned the repository on my own computer, checked out `claude/practical-euler-lwkor2`, ran `python3 -m http.server 8000`, and used the app at `http://localhost:8000`. The date, browser, and starting data of my review were not recorded.

| # | What I did and observed | Matching check | Recorded as |
|---|---|---|---|
| M1 | First visit to the Hub: the heading, "Choose a member" dropdown, localStorage prototype banner, initial My Tasks message, and no officer-management link were all present | R6 | PASS (manual) |
| M2 | Selected Jordan; Jordan's task list displayed correctly | R2 | PASS (manual) |
| M3 | Completed one of Jordan's tasks, refreshed, and it remained completed | U3 (partial) | NOT RUN: which task, and the "Mark incomplete" button label, were not recorded |
| M4 | Created `D08 Manual Test`, assigned to Sam; it appeared in the officer task list | C1 / C3 (partial) | NOT RUN: the success message, form clearing, due date and description display, and Sam's Hub were not recorded |
| M5 | Left the task name blank with an assignee selected; validation appeared and the task was not created | C5 / C6 (closest) | NOT RUN: no existing check uses this exact input |
| M6a | Clicked Delete on `D08 Manual Test` and cancelled; the task remained | D3 (partial) | NOT RUN: a refresh after cancelling was not recorded |
| M6b | Deleted `D08 Manual Test` again and confirmed; the task disappeared | D1 (partial) | NOT RUN: the confirmation text and "Task deleted." message were not recorded |

A manual PASS is recorded only when my observation covers the whole expected result of a check. The checks were not changed to fit what I observed.

---

## 5. Hardest verb: Update

**Conclusion (from the test evidence):** Update was the hardest verb to specify and test.

**Why, using the test table:**

* **Two different actors and two different controls.** Officers edit and reassign on the officer page (U1, U2, U6–U8). Members mark their own tasks complete or incomplete on the hub (U3–U5). The other verbs each have one actor.
* **One change affects several views.** Reassigning a task has to add it to the new assignee's hub *and* remove it from the old assignee's hub (U2). Completing an overdue task (U5) or clearing its due date (U8) also has to remove the Overdue label.
* **Editing reuses Create's validation, plus states Create doesn't have.** An invalid edit must leave the original untouched (U6). Cancelling must discard changes (U7). Saving must not bring back a task that was deleted in another tab (U10). Deleting a task while it is open in the edit form (D5) is a Delete check that exists only because of Update's edit state.
* **Many checks, and the only evidence correction.** Update is tied with Create for the most checks (10 each of 36), but Create's checks are mostly form validation on one page, while Update's span two pages, two roles, and multi-tab state. The single test-evidence correction during the build was on an Update check (U6, see §6).

**What the evidence does and does not show:**

* **Automated:** all 10 Update checks passed.
* **Manual:** my one Update observation (M3) confirmed that completion persists after a refresh, but it covers only part of U3. No Update check has a full manual pass.
* So this conclusion rests mainly on the automated evidence and the number and type of edge cases. It is not based on a failure I saw.

---

## 6. Corrections and reflection

From the session record:

**Corrections made during implementation (by Claude, during the build):**

* **Evidence-timing fix (U6).** In the first automated run, the U6 note recorded the page message *after* the page was refreshed but labeled it as the message from *before* Cancel, so it showed an empty message. The test script was fixed to capture the message at the right moment and to assert its exact text ("The task was not saved. Fix the marked fields."), and the whole suite was run again. The app code did not change.
* **Predicted vs observed double-click (C9).** Before building, Claude predicted that a double-click on Save would create one task and then show empty-form errors on the second click. The automated run showed one task created, the "Task created." message, and **no** field errors. The check's expected result (exactly one task) was kept unchanged. The difference was documented instead of hidden, and a real-mouse double-click was suggested as a manual check.
* **Layout tweak.** After looking at screenshots, the Edit/Delete buttons were kept on one line (CSS only), and the suite was re-run: 36/36 in both time zones.

**Instructions I gave that changed Claude's proposed plan.** These were my decisions, not bug fixes:

* Use the browser's built-in `confirm()` for deletion, and do not add a reset button.
* Report automated Playwright results separately from manual results, mark anything not actually run as NOT RUN, and never claim a pass without an observed result.
* Do not change the acceptance criteria or weaken a check to make it pass.
* Do not commit or push until I had reviewed the work. When the session's automatic commit reminder appeared twice, Claude followed this instruction and did not commit. I later decided to commit so I could review the app on my own computer.

**What the record shows:** the unexpected-action checks were written before any code, so edge cases such as a blank name, cancelling a delete, or a task deleted in another tab had a stated expected result before they were tested. Because a manual pass requires the whole expected result to be observed, four of my six manual observations count only as partial evidence (§4). Following each check's steps exactly as written, including refreshes and on-screen messages, would let those observations count as full manual results.

---

## 7. Authentication

**What I tested:** the session does not record any moment when I asked for login or authentication. My instructions were "do not add authentication", and none was built. The app uses a "Viewing as" demo picker, as PRD §11 allows.

**Reflection (not tested):** a real club deployment would need authentication and role-based access, because this prototype only *pretends* to know who is using it:

* Anyone can choose any member in "Viewing as", including an officer, and then create, edit, reassign, or delete any task.
* "Officers only" (U9, D7) and "only complete your own task" (U3) are enforced by the page, not by a server, so someone can get around them.
* Anyone with DevTools can edit the stored data directly (R9).
* Even after moving to Supabase, the architecture notes that without login the database cannot tell who is asking (`docs/03-architecture.md` §6). Real security would need sign-in plus Row Level Security policies based on the signed-in member's role.

---

## 8. Key session summary

| Step | My actions | Claude's actions | Observed result |
|---|---|---|---|
| 1 | Asked for a read-only inspection of the repository | Read the repository and docs | No `CLAUDE.md` and no application code; only planning docs (concept brief, PRD, architecture, diagram, stack decision) |
| 2 | Gave the CRUD specification and constraints; asked for observable checks and a plan, with no building yet | Proposed 36 checks (21 unexpected-action), a file plan, and two open questions | Plan ready for approval |
| 3 | Approved with adjustments: keep `confirm()`, no reset button, separate automated and manual results, NOT RUN for anything not run, no weakened checks, a Discovery Log draft, no commit yet | Built the app and docs; wrote a Playwright script in its temporary workspace (not in the repository); fixed the U6 evidence-timing issue and re-ran the suite | Automated: 36/36 passed (UTC) and 36/36 (America/New_York); manual: all NOT RUN |
| 4 | Asked to start a local server for review | Started the server in the cloud container and explained that my browser could not reach it there | No manual review possible from the cloud server |
| 5 | Decided to commit so I could review on my computer | Committed `8e24df4` and pushed to `claude/practical-euler-lwkor2`, with no merge and no pull request | Branch updated on GitHub |
| 6 | Cloned the repo, checked out the branch, ran `python3 -m http.server 8000`, and did the manual review (as reported in my session messages) | Gave step-by-step instructions only; did not run anything on my computer | Observations M1–M6 (§4) |
| 7 | Asked to finish this log from my observations | Mapped observations to checks without weakening them; completed this log and the checks document | Manual: R6 and R2 passed; M3–M6 partial |

**Session link:** this log does not include a share link. The commits on this branch carry the session's URL in their `Claude-Session:` line, but that URL is not a public share link and may open only for my own account. To get a link for submission, open this session at claude.ai/code and use its share option (if my plan allows sharing), then paste the link here.
