# 0001 — Backend stack: Supabase (PostgreSQL), not Firebase

*Status: Accepted, 2026-10-11. Full comparison and story trace: [`../03-architecture.md`](../03-architecture.md) §5 and §10.*

* **Context:** The MVP is a plain HTML/CSS/JS site on Vercel that stores one club's roster, tasks that each have exactly one roster-member assignee, and events, with a demo-user picker and no real-time updates (PRD §3, §10, §11); my D06 finalists were Supabase and Firebase.
* **Decision:** Use Supabase — its PostgreSQL database and auto-generated REST API — as the only backend; Supabase Auth, Realtime, Storage, and Edge Functions are not used because the PRD doesn't need them.
* **Why not Firebase:** Firestore has no foreign keys and no date-only type, so "the assignee must be on the roster," "a member with tasks can't be removed," date-only due dates, and dated-tasks-first sorting (PRD Story 7, §10, §13) would all become JavaScript I'd have to write and test myself; Firebase's main strengths, real-time sync and offline support, serve features the PRD leaves out.
* **What it costs:** Free Supabase projects pause after about 7 days of low activity (Firebase's free plan doesn't), so I must keep it active or restore it before demos and grading; I also have to write SQL for tables, constraints, and Row Level Security, and manage hosting in a separate Vercel dashboard instead of one Firebase console.
* **What would change my mind:** The PRD adding real-time updates or offline use, free-tier pausing repeatedly breaking demos or grading, or the SQL and Row Level Security setup taking so long it threatens the MVP schedule.
