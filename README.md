# Club Task and Event Hub

A web app for one student club: members see the tasks assigned to them, and officers create, edit, reassign, and delete tasks.

Planning documents:

* Product requirements: [`docs/02-prd.md`](docs/02-prd.md)
* Technical architecture: [`docs/03-architecture.md`](docs/03-architecture.md)
* D08 CRUD checks and results: [`docs/d08-crud-checks.md`](docs/d08-crud-checks.md)
* D08 Discovery Log (draft): [`docs/d08-discovery-log.md`](docs/d08-discovery-log.md)

## Current status: D08 task CRUD prototype

This milestone builds **task Create, Read, Update, and Delete only**. Events, roster management, and the other PRD features are not built yet.

| Page | What it does |
|---|---|
| `index.html` (main hub) | "Viewing as" demo-user picker and **My Tasks**: the current member's tasks only, with due dates, overdue labels, and Mark complete / Mark incomplete |
| `officer-tasks.html` | Officers only: **All Tasks** list with assignees, a form to create and edit (including reassign) tasks, and Delete with a confirmation |

There is **no login**. "Viewing as" is the demo user-selection system allowed by PRD §11; anyone can choose any member.

## ⚠️ Temporary storage: localStorage (prototype only)

For D08, tasks and the demo roster are stored in the browser's **localStorage**, not in a database.

* Data is saved only in **this browser on this computer**. Other people, browsers, and devices do not see the same tasks.
* Clearing the browser's site data erases all changes and restores the seeded demo data.
* The roster is fixed demo data: Avery (Officer), Morgan (Officer), Jordan (Member), Sam (Member). All names are fake.
* Rules such as "officers only" are enforced only by the page code, not by any server.

**Supabase integration, as described in `docs/03-architecture.md`, is deferred to a later milestone.** In this prototype, `js/storage.js` stands in for the planned `js/supabase.js`. This differs from the architecture document on purpose, and the architecture document has not been changed.

## How to run

No install step and no dependencies. From the repository folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a desktop browser.

To reset to the demo data: open DevTools → Application → Local Storage → `http://localhost:8000`, delete the `clubHub.*` keys, and refresh.

## Files

```
index.html            Main hub: demo-user picker + My Tasks
officer-tasks.html    Officer task management
css/styles.css        Shared styling
js/storage.js         TEMPORARY localStorage storage + seeded demo data
js/current-user.js    "Viewing as" demo-user choice (not authentication)
js/dates.js           Local "today", overdue check, date display, task order
js/hub.js             Main hub page logic
js/officer-tasks.js   Officer page logic and form validation
```
