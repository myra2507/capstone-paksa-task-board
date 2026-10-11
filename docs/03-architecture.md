# Technical Architecture — Club Task and Event Hub

> **Status: planned.** Nothing described in this document has been built yet. Every component, table, page, and query below is a design for the MVP defined in [`02-prd.md`](02-prd.md). Where this document makes a choice the PRD does not spell out, it is labeled **Assumption**.

Related documents:

* Diagram: [`design/architecture-diagram.md`](design/architecture-diagram.md)
* Stack decision: [`decisions/0001-backend-stack.md`](decisions/0001-backend-stack.md)

---

## 1. Summary

The Club Task and Event Hub will be a **static website** written in plain HTML, CSS, and JavaScript, hosted on **Vercel**. The website will read and write data in a **Supabase** project, which provides a **PostgreSQL** database and an automatically generated web API for it.

There is **no custom backend server**, **no login system**, and **no real-time connection**. The browser asks Supabase for data when a page loads or after the user saves a change, and the user refreshes to see changes made by other people. This matches the PRD's technical assumptions (Section 11).

```
Browser (HTML/CSS/JS)  ──page files──  Vercel
        │
        └──HTTPS + JSON──►  Supabase API  ──SQL──►  PostgreSQL
```

---

## 2. MVP requirements this architecture must serve

Taken directly from the PRD. Story numbers match the PRD.

| # | Requirement | PRD source |
|---|---|---|
| R1 | Exactly one club; two roles, Member and Officer. An officer has all member capabilities. | §3, §10 Club |
| R2 | A demo user-selection system identifies the current roster member and their role. No full authentication. | §11 |
| R3 | The main hub is the first page; it shows **My Tasks** and **Upcoming Events** as separate, independent sections. | Story 4, §10 Main Hub |
| R4 | My Tasks shows only the current user's tasks, never another member's. | Stories 1, 4; §13 Task Visibility |
| R5 | Tasks with due dates come first (earliest first), then tasks without due dates. No invented dates. Due dates are calendar dates with no time. Past-due tasks are labeled overdue. Completed tasks stay visible and are marked complete. | Story 2, §10 Tasks |
| R6 | Upcoming Events shows events dated today or later (local date), earliest first; past events are hidden. Title and date are shown; time, location, description are optional. | Story 3, §10 Events |
| R7 | Empty My Tasks and empty Upcoming Events each show a message; one empty section does not hide the other. | Stories 1, 3, 4; §13 Empty Sections |
| R8 | A member can mark their own task complete and undo it; they cannot mark another member's task complete. | Story 9, §10 Tasks |
| R9 | Officers create tasks with a required name and exactly one roster-member assignee, optional description and due date (past dates allowed). Missing required fields block saving and are identified. | Story 7, §10 Tasks |
| R10 | Officers edit, reassign, and delete tasks; a reassigned task appears only for the new assignee. Officers see all tasks in a separate officer task-management area. | Story 10, §10 Officer Management Areas |
| R11 | Officers create, edit, and delete events; title and date are required. | Story 11 |
| R12 | Officers add, edit, and remove roster members and set their role. A member with assigned tasks cannot be removed until those tasks are reassigned or deleted. Removed members cannot be chosen as assignees. | Story 12, §13 Roster |
| R13 | Non-officers cannot manage tasks, events, or the roster. | Stories 10, 11, 12 |
| R14 | Desktop web app; no real-time updates; refreshing shows saved changes; sample data is allowed. | §11 |

---

## 3. Components and responsibilities

Each component is tied to the requirements it exists to serve. If a component didn't serve an MVP requirement, it wouldn't be in this design.

### 3.1 Frontend — plain HTML, CSS, and JavaScript

**What it is:** a handful of `.html` pages, one stylesheet, and a few `.js` files that run in the user's browser. There is no framework (no React) and no build step (no Vite). The files Vercel serves are the same files in the repository.

**Responsibilities:**

| Responsibility | Requirements |
|---|---|
| Show the **demo-user picker** (a dropdown of roster members) in the header of the main hub, and remember the chosen member in the browser (`localStorage`). | R2, R3 |
| Render the **main hub** (`index.html`) as the first page, with My Tasks and Upcoming Events loaded by **separate** requests so one empty or failed section never hides the other. | R3, R7 |
| Ask Supabase for **only the current user's tasks**, sorted with dated tasks first. | R4, R5 |
| Work out **"today" from the browser's local date** (not UTC) and use it to label overdue tasks and to request only today-or-later events. | R5, R6 |
| Show the **mark complete / undo** control only on tasks in the current user's own My Tasks list. | R8 |
| Show **officer pages** (tasks, events, roster) and their navigation links only when the current user's role is Officer; show an "officers only" message otherwise. | R10–R13 |
| **Validate forms** before saving (task name and assignee required; event title and date required) and point to the missing field. | R9, R11 |
| Show a clear message when Supabase **refuses** to remove a member who still has tasks. | R12 |
| Reload the affected list after every save, so the user sees the saved result. | R14 |

**Planned file layout** (not created yet):

```
index.html            Main hub + demo-user picker      (R2–R8)
officer-tasks.html    Officer task management          (R9, R10)
officer-events.html   Officer event management         (R11)
officer-roster.html   Officer roster management        (R12)
css/styles.css        Shared styling (desktop layout)  (R14)
js/supabase.js        Creates the Supabase client      (all data access)
js/current-user.js    Reads/saves the demo-user choice (R2, R13)
js/dates.js           Local "today" and overdue logic  (R5, R6)
js/hub.js, js/officer-*.js   Page-specific code
```

**Data access library:** the frontend will use the **Supabase JavaScript client (`supabase-js`)**, loaded with a single `<script>` tag from a CDN, so no build tools are needed. It is used because it builds the query URLs and required headers for us; the alternative (writing raw `fetch()` calls to the Supabase API) would work but means more hand-written code for every query. **Assumption:** loading the library from a CDN is acceptable for this course.

### 3.2 Supabase API (auto-generated REST API)

**What it is:** Supabase automatically creates a web API for every table in the database. The frontend sends it HTTPS requests; it turns them into SQL, runs them, and returns JSON. We write **no server code**.

**Responsibilities:**

| Responsibility | Requirements |
|---|---|
| Accept read requests with filters and sorting (e.g., "tasks where assignee is X, sorted by due date, undated last"; "events dated on or after today, earliest first"). | R4, R5, R6 |
| Accept create, update, and delete requests from the officer pages and the mark-complete control. | R8–R12 |
| Return database errors (such as "member still has tasks") to the frontend so it can show a message. | R9, R11, R12 |
| Apply Row Level Security policies on each table. (See §6 for what these can and cannot do without login.) | R14 (demo data) |

The frontend authenticates to the API only with the project's **publishable (anon) key**, which Supabase designs to be visible in browser code. The **service-role (secret) key will never be placed in the frontend or committed to this repository.**

### 3.3 PostgreSQL database

**What it is:** the relational database inside the Supabase project. It stores the three kinds of MVP data and enforces the PRD's data rules itself, so the rules hold even if the frontend has a bug.

**Planned tables** (not created yet):

**`members`** — the club roster (R1, R12)

| Column | Type | Rule |
|---|---|---|
| `id` | identity / bigint | primary key |
| `name` | text | required, not blank |
| `role` | text | required, must be `'member'` or `'officer'` |

**`tasks`** (R4, R5, R8, R9, R10)

| Column | Type | Rule |
|---|---|---|
| `id` | identity / bigint | primary key |
| `name` | text | required, not blank |
| `description` | text | optional |
| `assignee_id` | bigint | required; **foreign key to `members.id` with `ON DELETE RESTRICT`** |
| `due_date` | `date` | optional; calendar date only, no time; past dates allowed |
| `is_complete` | boolean | required, defaults to `false` |
| `created_at` | timestamptz | set automatically (used only as a tie-breaker for sorting) |

**`events`** (R6, R11)

| Column | Type | Rule |
|---|---|---|
| `id` | identity / bigint | primary key |
| `title` | text | required, not blank |
| `event_date` | `date` | required |
| `start_time` | `time` | optional |
| `end_time` | `time` | optional |
| `location` | text | optional |
| `description` | text | optional |

**How the database enforces PRD rules:**

* **"Exactly one assignee who is on the roster"** (R9): `assignee_id` is required and must match an existing member.
* **"A member with assigned tasks cannot be removed"** (R12, §13 Roster): `ON DELETE RESTRICT` makes the database refuse to delete a member while any task points to them. The officer must reassign or delete those tasks first; then the delete succeeds.
* **"Removed members cannot be selected as assignees"** (R12): a removed member's row no longer exists, so they can't appear in the assignee dropdown or be referenced by a task.
* **"Due dates have no time"** (R5): the `date` type stores a calendar date only, so there is no time-zone shift.
* **Required fields** (R9, R11): `NOT NULL` and not-blank checks back up the frontend's form validation.

There is **no `clubs` table**, because the PRD supports exactly one club (R1).

### 3.4 Vercel hosting

**What it is:** a service that serves static files from a public URL.

**Responsibilities:**

| Responsibility | Requirements |
|---|---|
| Give club members, testers, and the instructor a **public URL** where the desktop web app opens in a browser. Without hosting, the app runs only on the developer's laptop. | R14, R3 |
| Serve the HTML, CSS, and JS files exactly as they are in the repository (no build step). | R14 |
| Redeploy automatically when changes are pushed to the `main` branch on GitHub. | Supports development; no PRD feature depends on it |

Vercel runs **no application code** for this project: no serverless functions, no API routes. All data goes directly between the browser and Supabase.

**Configuration note:** because there is no build step, Vercel environment variables can't be injected into plain static files. The Supabase **project URL** and **publishable key** will therefore live in `js/supabase.js` in this public repository. That is acceptable for the publishable key by design; it is **not** acceptable for the service-role key, which must never be committed.

---

## 4. Demo-user picker

The PRD (§11) says "A simple demo user-selection system can identify the current roster member and their role" and "Full authentication is not required." The design follows that exactly:

1. The header of the main hub contains a **"Viewing as:"** dropdown filled from the `members` table (name and role).
2. When a user picks a name, the member's `id` is saved in the browser's `localStorage`, so it survives a page refresh.
3. Every page reads that saved `id` to decide whose tasks to show and whether officer pages are available.
4. If nobody has been picked yet, My Tasks shows a prompt to choose a member, and Upcoming Events still displays (R7).

There are **no passwords, no sign-up, no email links, and no Supabase Auth.** Putting the picker on the hub itself keeps the hub as the first page (R3).

**Assumption:** if the saved member has since been removed from the roster, the app clears the choice and asks the user to pick again.

---

## 5. Story trace — "View Assigned Tasks" (Story 1)

> *As a club member, I want to see tasks assigned to me so that I know what I am responsible for.* (PRD Story 1)

This is the planned path of one request from the browser to the database and back.

| Step | Where | What happens |
|---|---|---|
| 1 | Browser → **Vercel** | The member opens the site URL. Vercel returns `index.html`, `styles.css`, and the JS files. |
| 2 | **Frontend** | `current-user.js` reads the saved member `id` from `localStorage`. If none, it loads the roster for the "Viewing as" dropdown and the member picks their name (e.g., "Jordan"). |
| 3 | **Frontend** | `hub.js` asks for Jordan's tasks with the Supabase client: select `id, name, description, due_date, is_complete` from `tasks` where `assignee_id` = Jordan's id, ordered by `due_date` ascending **with empty dates last**, then by `created_at`. |
| 4 | Browser → **Supabase API** | `supabase-js` sends an HTTPS `GET` request to the project's `/rest/v1/tasks` endpoint, with the filter and sort in the URL and the publishable key in the headers. |
| 5 | **Supabase API → PostgreSQL** | The API checks the table's Row Level Security policy (demo policy allows reading), converts the request to a SQL `SELECT … WHERE assignee_id = … ORDER BY due_date ASC NULLS LAST, created_at`, and runs it. |
| 6 | **PostgreSQL → Supabase API → Browser** | The database returns only Jordan's rows, already in PRD order. The API sends them back as a JSON array. |
| 7 | **Frontend** | `dates.js` computes **today's local date**. For each task: show the due date if there is one (never an invented one); add an **Overdue** label if the date is before today and the task is not complete; show completed tasks with a clear "Complete" mark. If the array is empty, show "You have no assigned tasks." |
| 8 | **Frontend** (in parallel) | Upcoming Events loads through its own separate request (`events` where `event_date` ≥ today, ordered by date). A problem or empty result in one section does not affect the other (R7). |

**Requirements satisfied by this path:** R3, R4, R5, R7, plus the §13 break-tests for task visibility and due dates.

**Assumptions in this trace:**

* **Overdue label only on incomplete tasks.** The PRD says past-due tasks are "labeled as overdue" and that "overdue tasks remain visible until completed or deleted." This design reads that as: once a task is completed, it shows as Complete instead of Overdue.
* **Tie-breakers.** The PRD doesn't say how to order two tasks with the same due date, or two events on the same date. This design uses `created_at` for tasks and `start_time` (events without a time last) for events.

---

## 6. Known limitation: no real access control

Because the PRD intentionally has no login, **the database cannot tell who is making a request.** Every visitor uses the same publishable key.

What this means:

* "Members only see their own tasks" (R4) and "non-officers cannot edit" (R13) are enforced by **the frontend** — what it asks for and which buttons it shows — not by the database.
* Someone with technical skill could call the Supabase API directly and read or change any row.
* Row Level Security will be **turned on** for all three tables, with policies that deliberately allow the demo's reads and writes. This makes the access rules visible and intentional, but it does **not** make them secure without real user identity.

This is acceptable for the course MVP because the PRD states that full authentication is not required (§11) and that sample or demonstration data may be used. **Assumption:** the app will hold **only fake demonstration data** — no real student names, emails, or other personal information. Adding real authentication would be a future project, not part of this MVP.

---

## 7. What the architecture deliberately does NOT include

Each item below is out of scope in the PRD (§8 "Won't Have This Semester", §11, §12) or not needed by any MVP requirement.

| Not included | Why |
|---|---|
| Login, passwords, sign-up, Supabase Auth, SSO | PRD §11: demo picker instead of full authentication |
| Real-time updates / Supabase Realtime subscriptions | PRD §8, §11: refreshing is sufficient |
| Task reminders, event reminders, assignment notifications (email, push, SMS, scheduled jobs) | Deferred Stories 5, 6, 8 |
| Email or calendar integration (e.g., Outlook), automatic importing | PRD §8, §12 |
| Multiple clubs or a `clubs` table | PRD §3, §10: exactly one club |
| Roles beyond Member/Officer or advanced permissions | PRD §8, §12 |
| Recurring events, task due times, multiple assignees per task | PRD §8 |
| Analytics, rewards/confetti, social features, automatic assignment by availability | PRD §8, §12 |
| Custom backend server, Vercel serverless functions, Supabase Edge Functions | No MVP requirement needs server-side code |
| Frontend frameworks or build tools (React, Vite, etc.) | Plain HTML/CSS/JS is enough for four pages |
| Mobile app | PRD §11: desktop web application |
| Task filtering/sorting options beyond the PRD's ordering | PRD §16 lists these only as future questions |

---

## 8. Risks and how the design handles them

| Risk | Impact | Plan |
|---|---|---|
| **Supabase free projects pause after about 7 days of low activity** (per Supabase's [Project Pausing docs](https://supabase.com/docs/guides/platform/free-project-pausing)). | The app shows errors during a demo or grading. | Open the project or use the app a few times a week near due dates; restore the project from the dashboard if it pauses. |
| Using the UTC date instead of the local date. | Events or overdue labels can be off by one day in the evening. | `dates.js` builds `YYYY-MM-DD` from the local date only. |
| No real access control (§6). | Data could be read or changed by someone calling the API. | Demo data only; limitation documented. |
| Publishable key visible in a public repo. | Expected by design. | Never commit the service-role key. |

---

## 9. Assumptions (all in one place)

1. **No `clubs` table** — the MVP supports exactly one club.
2. **Removing a member permanently deletes their roster row**; the database blocks this while they have any tasks (complete or not).
3. **Only fake demonstration data** will be stored.
4. **The overdue label applies only to incomplete tasks.**
5. **Sort tie-breakers:** tasks by `created_at`; events by `start_time`, with time-less events last.
6. **The demo-user choice is kept in `localStorage`** and cleared if that member is removed.
7. **Loading `supabase-js` from a CDN** is acceptable for this course.
8. In the officer task-management area, officers can edit, reassign, and delete any task, but the **mark-complete control appears only in a user's own My Tasks**, because the PRD says a member cannot mark another member's task complete.

---

## 10. Stack choice: Supabase over Firebase, and what it costs

The short decision record is [`decisions/0001-backend-stack.md`](decisions/0001-backend-stack.md). This section holds the full comparison behind it. The two finalists from D06 were Supabase and Firebase (Cloud Firestore).

**Decision: Supabase (PostgreSQL + auto-generated REST API). Firebase is not used.**

Supabase stores data in **tables with rows and columns** that can point to each other (foreign keys), and the database refuses data that breaks the rules. Firestore stores flexible **documents** (like JSON objects), with strong built-in real-time syncing and offline support.

| PRD need | Supabase | Firebase (Firestore) |
|---|---|---|
| Task must have one assignee who is on the roster (Story 7) | **Database enforces it** with a foreign key to `members` | No links between documents; my JavaScript would have to check |
| Block removing a member who still has tasks (§13 Roster) | **One rule** (`ON DELETE RESTRICT`); the database refuses the delete | My code must count their tasks first, and a bug could skip it |
| Date-only due dates (Story 2) | **Real `date` type** | Only timestamps; store dates as text like `"2026-10-15"` or risk time-zone shifts |
| Dated tasks first, undated last (§10) | **One query** (`ORDER BY due_date ASC NULLS LAST`) | Sorting on a field skips documents that don't have it, so sort in the browser |
| Officer list of all tasks with assignee names (Story 10) | **One query** joining tasks to members | Copy the member's name into every task, or make extra lookups |
| No login (§11) | Auth available but **not used** | Auth available but **not used** |
| No real-time (§11) | Realtime available but **not used** | Real-time is Firebase's main strength, but the PRD doesn't need it |
| Plain HTML/JS, no build step | Yes (`supabase-js` from a CDN) | Yes (Firebase SDK from a CDN) |
| Access control without login | Same limitation (§6) | Same limitation |

**Why:** this project's data is a small set of linked records with rules — roster → tasks, plus events — which is what a relational database is built for. Several PRD rules become single database rules or single queries instead of JavaScript I'd have to write, test, and remember to call everywhere.

**What I give up by not choosing Firebase:**

1. **No pausing.** Supabase's free plan pauses a project after about 7 days of low activity ([Supabase docs: Project Pausing](https://supabase.com/docs/guides/platform/free-project-pausing)); Firebase's free plan doesn't. This is the biggest practical cost (see §8).
2. **No SQL to learn.** With Supabase I must write SQL for tables, constraints, and Row Level Security policies.
3. **One all-in-one console.** Firebase can host the site and store the data in one product; with Supabase, hosting is a separate Vercel dashboard.
4. **Built-in real-time and offline support.** Not needed for this MVP, but it would matter if those features were added later.
5. **More beginner tutorials**, especially for mobile apps.
6. **Schema flexibility.** Firestore lets you add a field without changing a table; Supabase needs a new column first. For three small, stable tables, that costs little.
