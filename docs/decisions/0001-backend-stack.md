# 0001 — Backend stack: Supabase (PostgreSQL) instead of Firebase

* **Status:** Accepted
* **Date:** 2026-10-11
* **Applies to:** Club Task and Event Hub MVP ([`../02-prd.md`](../02-prd.md), [`../03-architecture.md`](../03-architecture.md))

> This decision is about the **planned** design. Nothing has been built yet.

---

## Context

The Club Task and Event Hub needs a place to store and serve three kinds of data: the **club roster**, **tasks**, and **events**. My D06 finalists were **Supabase** and **Firebase**, with Supabase as my initial preference. This record makes the final choice.

The PRD requirements that matter most for this decision:

1. **Data is linked.** Every task has exactly one assignee, who must be on the club roster (Story 7).
2. **Delete rules.** A member with assigned tasks cannot be removed until those tasks are reassigned or deleted (PRD §13 Roster).
3. **Date-only due dates.** Due dates are calendar dates with no time (Story 2).
4. **Specific ordering.** In My Tasks, dated tasks come first by earliest date, then undated tasks (PRD §10).
5. **Filtering by date.** Upcoming Events shows only events dated today or later (Story 3).
6. **Officer overview.** Officers see all tasks with who each is assigned to (Story 10).
7. **No login** — a demo-user picker instead (PRD §11).
8. **No real-time updates** — refreshing is enough (PRD §11).
9. **Desktop web only**, built with plain HTML, CSS, and JavaScript, hosted as a static site on Vercel.

## Options considered

### Option A — Supabase (PostgreSQL + auto-generated REST API)

Stores data in **tables with rows and columns**, like spreadsheets with enforced rules. Tables can point to each other (foreign keys), and the database itself refuses data that breaks the rules.

### Option B — Firebase (Cloud Firestore)

Stores data as **documents** (similar to JSON objects) grouped in collections. Very flexible, with strong built-in real-time syncing and offline support.

## Comparison for this project

| PRD need | Supabase | Firebase (Firestore) |
|---|---|---|
| Task must have one assignee who is on the roster | **Database enforces it** with a foreign key to `members` | No links between documents; my JavaScript would have to check |
| Block removing a member who still has tasks | **One rule** (`ON DELETE RESTRICT`); the database refuses the delete | My code must count their tasks first — and could be skipped by a bug |
| Date-only due dates | **Real `date` type** | Only timestamps; I'd store dates as text like `"2026-10-15"` or risk time-zone shifts |
| Dated tasks first, undated last | **One query** (`ORDER BY due_date ASC NULLS LAST`) | Sorting on a field skips documents that don't have it, so I'd sort in the browser |
| Officer list of all tasks with assignee names | **One query** joining tasks to members | Copy the member's name into every task, or make extra lookups |
| No login (demo picker) | Fine — Auth is available but **not used** | Fine — Auth is available but **not used** |
| No real-time | Realtime available but **not used** | Real-time is Firebase's main strength, but the PRD doesn't need it |
| Works from plain HTML/JS with no build step | Yes (`supabase-js` from a CDN) | Yes (Firebase SDK from a CDN) |
| Access control without login | Same limitation: the database can't tell who is asking | Same limitation |

## Decision

**Use Supabase, with its PostgreSQL database and auto-generated REST API, as the only backend for the MVP.** Firebase is **not** used.

**Why:** this project's data is a small set of **linked records with rules** — roster → tasks, plus events. That is exactly what a relational database is designed for. Several PRD rules (one valid assignee, can't remove a member with tasks, date-only due dates, dated-first ordering) become single database rules or single queries, instead of JavaScript I would have to write, test, and remember to call everywhere. Firebase's biggest advantages — real-time sync and offline support — serve features the PRD explicitly leaves out.

**Supabase features we will NOT use**, even though they're available: Supabase Auth (login), Realtime subscriptions, Storage (file uploads), and Edge Functions (server code). The PRD doesn't need any of them.

## What I give up by not choosing Firebase

These are real trade-offs, not reasons to change the decision, but they need to be acknowledged:

1. **No automatic pausing on Firebase's free plan.** Supabase's free plan pauses a project after about **7 days of low activity** ([Supabase docs: Project Pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). If the project pauses before a demo or grading, the app won't load data until I restore it in the dashboard. Firebase's free plan doesn't pause idle projects. *This is the biggest practical cost.*
2. **No SQL learning curve.** With Supabase I have to write some SQL to create tables, constraints, and policies. Firestore lets you start saving data without designing tables first.
3. **One all-in-one Google console.** Firebase can host the website and store the data in the same product. With Supabase, hosting is a separate service (Vercel), so there are two dashboards to manage.
4. **Built-in real-time and offline support.** Firebase makes live-updating screens and offline caching easy. Not needed for this MVP, but it would matter if real-time updates were added later.
5. **A larger pool of beginner tutorials**, especially for mobile apps.
6. **Schema flexibility.** In Firestore, adding a new field doesn't require changing a table. In Supabase, I'd add a column first. For a small, stable data model like this one, that costs little.

## Consequences

**Positive**

* The database enforces key PRD rules, so the break-tests in PRD §13 for reassignment, roster removal, and missing required fields are backed by the data layer, not just the UI.
* Queries for My Tasks, Upcoming Events, and the officer task list stay short and readable.
* No custom server is needed; the frontend talks to Supabase directly.

**Negative / things to manage**

* Must keep the project active near due dates, or restore it if it pauses.
* Must learn enough SQL for three tables, their constraints, and Row Level Security policies.
* **Without login, Row Level Security cannot tell users apart.** Role rules (members see only their own tasks; only officers edit) are enforced by the frontend, not the database. This would be equally true with Firebase. The app will hold only fake demo data. (See [`../03-architecture.md`](../03-architecture.md) §6.)
* The publishable (anon) key will be visible in the public repo's JavaScript, which Supabase intends; the **service-role key must never be committed**.

## When to revisit this decision

* If the PRD later requires **real-time updates** or **offline use**, Firebase's strengths would weigh more heavily.
* If the free-plan pausing causes repeated problems during the semester.
