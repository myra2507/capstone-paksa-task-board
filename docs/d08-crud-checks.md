# D08 — Task CRUD Checks

Observable checks for the D08 task CRUD prototype. Each check has an action and the result you should be able to **see** on the page.

## How results are recorded

There are two separate result columns. They are never merged.

| Column | Meaning |
|---|---|
| **Playwright result** | Result of an automated run in a headless Chromium browser, scripted with Playwright. `PASS` means the script performed the action and its assertions about the page held. It does not mean a person looked at the page. |
| **Manual result** | Result of the student doing the steps by hand in a real browser. `PASS (manual)` only when the student's recorded observation covers the check's whole expected result; otherwise `NOT RUN`. |

A check is never marked `PASS` unless it was actually run. Checks that were not run are marked `NOT RUN`.

## Automated run details

* **Date:** 2026-10-27. First runs about 00:56 UTC; final runs 00:58 UTC, after a style-only CSS change (Edit/Delete buttons kept on one line). The results in the tables are from the final runs.
* **Where:** Claude Code cloud container, headless Chromium, using the Playwright that is pre-installed in that environment. Playwright is **not** a dependency of this repository, and the test script is not committed.
* **Commands:**

  ```bash
  # from the repository folder
  python3 -m http.server 8000

  # in another shell, from the folder that holds the test script
  node d08-checks.js shots                              # browser time zone: UTC (container default)
  TZID=America/New_York node d08-checks.js shots-ny     # browser time zone: America/New_York
  ```

* **Final results:** UTC run 36/36 passed, 0 failed (exit code 0). New York run 36/36 passed, 0 failed (exit code 0). Every check also asserts that the page reported no JavaScript errors.

## Manual review details

* **Who:** the student, by hand.
* **Where:** the student's own computer, running `python3 -m http.server 8000` on branch `claude/practical-euler-lwkor2` (commit `8e24df4`) and opening `http://localhost:8000`.
* **Date, browser, and starting data:** not recorded.
* **How observations were mapped:** a check is marked `PASS (manual)` only when the student's recorded observation covers **every part** of that check's expected result. An observation that covers only part of a check is listed in the table below, and that check stays `NOT RUN`. The checks themselves were not changed to fit the observations.

| # | Student's recorded observation | Matching check | Manual result | What the observation did not record |
|---|---|---|---|---|
| M1 | First visit to the Hub: heading, "Choose a member" dropdown, localStorage prototype banner, initial My Tasks message, and no officer-management link were all present | R6 | **PASS (manual)** | — |
| M2 | Selected Jordan; Jordan's task list displayed correctly | R2 | **PASS (manual)** | — |
| M3 | Completed one of Jordan's tasks, refreshed, and it remained completed | Closest: U3 | NOT RUN (partial) | Which task was used; whether the button changed to "Mark incomplete" |
| M4 | Created `D08 Manual Test` assigned to Sam; it appeared in the officer task list | Closest: C1, C3 | NOT RUN (partial) | C1: description, due date, "Task created." message, form clearing. C3: "No due date" / empty description in the row, and Sam's Hub |
| M5 | Left the task name blank with an assignee selected; validation appeared and the task was not created | Closest: C5, C6 | NOT RUN (partial) | No existing check uses exactly this input (C5 leaves both fields empty; C6 uses a name of only spaces). The exact message text was not recorded |
| M6a | Clicked Delete on `D08 Manual Test`, cancelled the confirmation; the task remained | Closest: D3 | NOT RUN (partial) | Whether the task stayed after a refresh; that "Task deleted." did not appear |
| M6b | Deleted `D08 Manual Test` again and confirmed; the task disappeared | Closest: D1 | NOT RUN (partial) | The confirmation text naming the task; the "Task deleted." message |

Manual totals: **2 checks passed manually (R6, R2)**, 0 failed, 34 `NOT RUN`. Observations M3–M6 are real manual evidence and are cited in the Discovery Log, but they are not counted as passed checks.

## Starting state for manual checks

Unless a check says otherwise, start from the seeded demo data: DevTools → Application → Local Storage → `http://localhost:8000`, delete the `clubHub.*` keys, then refresh.

The demo data includes:

| Task | Assignee | Due date | Status |
|---|---|---|---|
| Reserve room for general meeting | Jordan | 5 days from the day the data was seeded | Not complete |
| Send event recap email | Jordan | 2 days before the day the data was seeded (overdue) | Not complete |
| Update club bulletin board | Jordan | none | Not complete |
| Order snacks for social | Avery | 3 days from the day the data was seeded | Complete |
| Draft budget proposal | Morgan | 14 days from the day the data was seeded | Not complete |

Sam has no tasks. "Officer page" means `officer-tasks.html`; "Hub" means `index.html`.

---

## Create

| ID | Type | Action | Expected visible result | Playwright result | Manual result |
|---|---|---|---|---|---|
| C1 | Happy path | As Avery (Officer), on the Officer page, enter name "Book meeting room", choose Jordan, description "Room 204", a future due date; click Save task | "Task created." appears; the form clears; a new row shows Book meeting room / Jordan / Not complete / the date / Room 204 | PASS | NOT RUN (partial: M4) |
| C2 | Happy path | After C1, choose Jordan on the Hub | "Book meeting room" is in My Tasks, marked Not complete | PASS | NOT RUN |
| C3 | Happy path | Create a task with only a name and assignee Sam | The row shows "No due date" and an empty description; Sam's Hub shows "No due date" and no description | PASS | NOT RUN (partial: M4) |
| C4 | Happy path | Create a task with a due date 3 days before today | Saved; the row shows that date with an **Overdue** label; the assignee's Hub also shows Overdue | PASS | NOT RUN |
| C5 | **Unexpected** | Click Save task with the form empty | "Task name is required." and "Choose an assignee." appear by the fields; "The task was not saved. Fix the marked fields." appears; the number of rows does not change | PASS | NOT RUN (partial: M5) |
| C6 | **Unexpected** | Enter only spaces as the name, choose Jordan, Save | "Task name is required." appears; no row is added | PASS | NOT RUN (partial: M5) |
| C7 | **Unexpected** | Enter name "Make flyers", leave assignee as "Choose a member", Save | Only "Choose an assignee." appears; "Make flyers" stays in the name field; no row is added | PASS | NOT RUN |
| C8 | **Unexpected** | Create a task, then refresh the page | The task is still listed with the same assignee and due date | PASS | NOT RUN |
| C9 | **Unexpected** | Fill a valid task, then double-click Save task | Exactly one task with that name is created | PASS (see note 1) | NOT RUN |
| C10 | **Unexpected** | Create a task named `<b>hi</b>` for Jordan | The name shows literally as `<b>hi</b>`, not bold, on the Officer page and Jordan's Hub | PASS | NOT RUN |

## Read

| ID | Type | Action | Expected visible result | Playwright result | Manual result |
|---|---|---|---|---|---|
| R1 | Happy path | As Avery, open the Officer page | All 5 demo tasks are listed with name, assignee, status, due date (or "No due date"), and description | PASS | NOT RUN |
| R2 | Happy path | Choose Jordan on the Hub | Only Jordan's 3 tasks appear; no other member's task is visible | PASS | PASS (manual, M2) |
| R3 | Happy path | Create "Pick up banner" for Jordan due tomorrow; view Jordan's Hub; then mark "Reserve room for general meeting" complete | Order is: Send event recap email (overdue) → Pick up banner → Reserve room → Update club bulletin board (no date). After completing Reserve room, it shows Complete and the order does not change | PASS | NOT RUN |
| R4 | Happy path | Create a task due 2026-11-03 | The Officer page shows "Nov 3, 2026" and the Hub shows "Due Nov 3, 2026", not a day earlier or later | PASS (see note 2) | NOT RUN |
| R5 | **Unexpected** | Choose Sam on the Hub | "You have no assigned tasks." and no task items | PASS | NOT RUN |
| R6 | **Unexpected** | Open the Hub in a fresh browser profile (nobody chosen) | "Viewing as" shows "Choose a member"; My Tasks says "Choose who you're viewing as to see your tasks."; no tasks shown | PASS | PASS (manual, M1) |
| R7 | **Unexpected** | Choose Jordan, then refresh | Still viewing as Jordan; the same tasks are shown | PASS | NOT RUN |
| R8 | **Unexpected** | Create a task, then clear all localStorage for the site and refresh | The demo data comes back (5 tasks; the created task is gone); "Viewing as" resets; no error notice; pages work | PASS | NOT RUN |
| R9 | **Unexpected** | While viewing as Jordan, set the `clubHub.tasks` key in DevTools to `not json{` and refresh | Notice: "Saved data couldn't be read, so the demo data was restored."; Jordan's 3 demo tasks are shown; the page is not blank | PASS | NOT RUN |

## Update

| ID | Type | Action | Expected visible result | Playwright result | Manual result |
|---|---|---|---|---|---|
| U1 | Happy path | As Avery, click Edit on "Draft budget proposal"; change name to "Draft spring budget", description and due date; Save; refresh | "Task updated."; the row shows the new values before and after the refresh; the old name is gone | PASS | NOT RUN |
| U2 | Happy path | Edit "Reserve room for general meeting" and change the assignee from Jordan to Sam | The row shows Sam; Sam's Hub shows the task; Jordan's Hub no longer does | PASS | NOT RUN |
| U3 | Happy path | As Jordan, click Mark complete on "Update club bulletin board"; refresh | It shows Complete and the button says "Mark incomplete", also after refresh | PASS | NOT RUN (partial: M3) |
| U4 | Happy path | As Avery, click Mark incomplete on "Order snacks for social" (already complete); refresh | It shows Not complete, also after refresh | PASS | NOT RUN |
| U5 | Happy path | As Jordan, mark the overdue "Send event recap email" complete | The Overdue label disappears and the task shows Complete | PASS | NOT RUN |
| U6 | **Unexpected** | Edit "Draft budget proposal", clear the name, Save; then Cancel and refresh | "Task name is required." and "The task was not saved. Fix the marked fields." appear; the form stays in "Edit task"; the row is unchanged, also after refresh | PASS | NOT RUN |
| U7 | **Unexpected** | Edit "Draft budget proposal", change every field, click Cancel; refresh | The form returns to "Create task" and is empty; the Cancel button is hidden; the row is unchanged, also after refresh | PASS | NOT RUN |
| U8 | **Unexpected** | Edit the overdue "Send event recap email", clear the due date, Save | The row shows "No due date" and no Overdue label | PASS | NOT RUN |
| U9 | **Unexpected** | Choose Jordan (Member) on the Hub, then type `officer-tasks.html` in the address bar. Repeat with nobody chosen | "Officers only…" message; no Save, Edit, or Delete controls are visible | PASS | NOT RUN |
| U10 | **Unexpected** | As Avery, open the Officer page in two tabs. Tab A: Edit "Draft budget proposal" and change the name. Tab B: Delete that task (OK). Tab A: Save | Tab A shows "This task no longer exists. It may have been deleted in another tab."; the task is not recreated under either name | PASS | NOT RUN |

## Delete

| ID | Type | Action | Expected visible result | Playwright result | Manual result |
|---|---|---|---|---|---|
| D1 | Happy path | As Avery, click Delete on "Order snacks for social", then OK | The confirmation reads `Delete the task "Order snacks for social"? This cannot be undone.`; after OK the row disappears and "Task deleted." appears | PASS | NOT RUN (partial: M6b) |
| D2 | Happy path | Delete "Order snacks for social", then view Avery's Hub | The task is no longer in Avery's My Tasks | PASS | NOT RUN |
| D3 | **Unexpected** | Click Delete on "Draft budget proposal", then Cancel in the confirmation; refresh | The confirmation appears; the task stays listed and unchanged (5 rows), also after refresh; "Task deleted." does not appear | PASS | NOT RUN (partial: M6a) |
| D4 | **Unexpected** | Delete "Update club bulletin board", then refresh | It stays gone; 4 rows remain | PASS | NOT RUN |
| D5 | **Unexpected** | Click Edit on "Draft budget proposal" and change the name, then click Delete on the same row and OK; then click Save task | The form returns to an empty "Create task"; the row is gone; Save shows the empty-form errors and does not bring the task back | PASS | NOT RUN |
| D6 | **Unexpected** | Delete every task | The Officer page shows "No tasks yet." and hides the table; each member's Hub shows "You have no assigned tasks." | PASS | NOT RUN |
| D7 | **Unexpected** | As Jordan (Member), look for Delete on the Hub; then open `officer-tasks.html` | The Hub has no Edit or Delete buttons and no officer link; the Officer page shows "Officers only…" with no Delete buttons | PASS | NOT RUN |

Every verb has at least two unexpected-action checks: Create 6, Read 5, Update 5, Delete 5.

---

## Notes on the automated results

1. **C9 (double-click).** The check passed: exactly one task was created. Before building, I predicted that the second click would hit the cleared form and show the empty-form errors. That is **not** what the automated run observed. After the double-click the page showed "Task created." and no field errors. The check's expected result (exactly one task) did not change. A double-click with a real mouse in your browser may behave differently from Playwright's simulated double-click, so this is worth checking by hand.
2. **R4 and time zones.** R4 passed in both the UTC and New York runs. The New York run happened at about 20:56 on Oct 26 New York time (00:56 Oct 27 UTC), so the browser's local date and the UTC date were different days. However, no check specifically asserts that "today" (used for the Overdue label) is the local date rather than the UTC date. Treat the local-date "today" behavior as **not verified** by automation.
3. **What a Playwright PASS does not cover:** how the pages look, readability, the native `confirm()` dialog's appearance, other browsers (Firefox, Safari), and opening `index.html` directly as a file instead of through the local server.

## Suggested further manual checks (NOT RUN)

Every check except R6 and R2 is still `NOT RUN` manually. To turn a partial observation into a full manual result, repeat the check exactly as written. These cover what automation could not:

* **C9** with a real mouse double-click.
* **D1** and **D3**, to see the real confirmation dialog in your browser.
* **U10**, with two real tabs.
* **C5**, **U6**, and **R9**, to judge whether the messages are clear to a person.
* An evening check of the Overdue label: after 8 p.m. Eastern (7 p.m. once daylight saving time ends on Nov 1, 2026), when the UTC date has already moved to tomorrow, create a task due **today**. It should **not** show Overdue.
