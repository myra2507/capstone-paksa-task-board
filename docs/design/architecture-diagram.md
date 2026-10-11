# Architecture Diagram — Club Task and Event Hub

> **Status: planned.** These diagrams describe the intended MVP design from [`../03-architecture.md`](../03-architecture.md). None of these components have been built yet.

GitHub renders the Mermaid code blocks below as diagrams automatically.

---

## 1. System overview

The three planned parts and how data moves between them. There is no custom server and no login service.

**Every box names the requirement it serves.** Story numbers and § sections refer to [`../02-prd.md`](../02-prd.md); R-numbers refer to the requirement list in §2 of [`../03-architecture.md`](../03-architecture.md).

```mermaid
flowchart LR
    user(["Club member or officer<br/>(desktop browser)"])

    subgraph browser["Browser: plain HTML / CSS / JavaScript"]
        picker["Demo-user picker<br/>(Viewing as: dropdown)<br/><i>Serves: PRD §11 demo user selection (R2)</i>"]
        hub["Main hub: index.html<br/>My Tasks + Upcoming Events<br/><i>Serves: Stories 1, 2, 3, 4, 9 (R3–R8)</i>"]
        officer["Officer pages<br/>tasks / events / roster<br/><i>Serves: Stories 7, 10, 11, 12 (R9–R13)</i>"]
        client["supabase-js client<br/><i>Serves: all stories that read or save data</i>"]
        picker --> hub
        picker --> officer
        hub --> client
        officer --> client
    end

    subgraph vercel["Vercel (static hosting)"]
        files["HTML, CSS, JS files<br/>from GitHub main branch<br/><i>Serves: PRD §11 desktop web app (R14)</i>"]
    end

    subgraph supabase["Supabase project"]
        api["Auto-generated REST API<br/>+ Row Level Security policies<br/><i>Serves: Stories 1–4, 7, 9–12 reads and writes</i>"]
        db[("PostgreSQL<br/>members / tasks / events<br/><i>Serves: §10 data rules, §13 roster rule,<br/>saved changes after refresh (R14)</i>")]
        api -->|SQL| db
        db -->|rows| api
    end

    user --> picker
    files -->|"1. page files (HTTPS)"| browser
    client -->|"2. read / write requests (HTTPS + JSON)"| api
    api -->|"3. JSON results"| client
```

**What each arrow means**

1. When the site is opened, Vercel sends the static page files to the browser. Vercel runs no app code.
2. The pages use the Supabase client to send requests to the Supabase API.
3. Supabase runs the matching SQL against PostgreSQL and sends results back as JSON.

**Deliberately absent:** authentication service, real-time connection, notification or reminder service, email or calendar integrations, custom backend server, serverless functions.

---

## 2. Data model

Three tables. Each task points to exactly one roster member. `ON DELETE RESTRICT` on that link stops a member from being removed while they still have tasks.

```mermaid
erDiagram
    MEMBERS ||--o{ TASKS : "is assigned"
    MEMBERS {
        bigint id PK
        text name "required"
        text role "member or officer"
    }
    TASKS {
        bigint id PK
        text name "required"
        text description "optional"
        bigint assignee_id FK "required, ON DELETE RESTRICT"
        date due_date "optional, date only"
        boolean is_complete "default false"
        timestamptz created_at "auto"
    }
    EVENTS {
        bigint id PK
        text title "required"
        date event_date "required"
        time start_time "optional"
        time end_time "optional"
        text location "optional"
        text description "optional"
    }
```

`EVENTS` has no relationship to the other tables, because the PRD does not link events to members or tasks.

| Table | Serves |
|---|---|
| `MEMBERS` | Story 12 (roster), PRD §3 roles, demo-user picker (§11) |
| `TASKS` | Stories 1, 2, 7, 9, 10; §10 Tasks; §13 Roster rule via `ON DELETE RESTRICT` |
| `EVENTS` | Stories 3, 11; §10 Events |

---

## 3. Story trace: View Assigned Tasks (Story 1)

*As a club member, I want to see tasks assigned to me so that I know what I am responsible for.*

```mermaid
sequenceDiagram
    actor M as Member (Jordan)
    participant V as Vercel
    participant FE as Frontend JS (hub.js)
    participant API as Supabase REST API
    participant DB as PostgreSQL

    M->>V: Open site URL
    V-->>M: index.html, styles.css, JS files
    FE->>FE: Read saved member id from localStorage
    alt No member chosen yet
        FE->>API: GET members (id, name, role)
        API->>DB: SELECT from members
        DB-->>API: roster rows
        API-->>FE: JSON roster
        M->>FE: Choose "Jordan" in Viewing as
    end
    FE->>API: GET tasks where assignee_id = Jordan, order by due_date (nulls last)
    API->>API: Check Row Level Security policy (demo: read allowed)
    API->>DB: SELECT ... WHERE assignee_id = ... ORDER BY due_date ASC NULLS LAST, created_at
    DB-->>API: Only Jordan's task rows
    API-->>FE: JSON array of tasks
    FE->>FE: Compute local today, label overdue, mark complete
    alt Zero tasks
        FE-->>M: "You have no assigned tasks."
    else One or more tasks
        FE-->>M: My Tasks list (dated first, undated last)
    end
    Note over FE,API: Upcoming Events loads through its own separate request,<br/>so an empty or failed task list never hides events.
```

**Limitation:** the filter `assignee_id = Jordan` is applied because the frontend asks for it. Without login, the database can't verify who is asking (see §6 of [`03-architecture.md`](../03-architecture.md)).
