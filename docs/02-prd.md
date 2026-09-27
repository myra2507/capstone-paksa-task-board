# Product Requirements Document — Club Task and Event Hub

## 1. Product Overview


The Club Task and Event Hub is a centralized web app for student club members and officers to manage club tasks and upcoming events in one place.

Based on user research, club responsibilities and event information may be spread across email, calendars, and other communication platforms. Members may also rely on memory to keep track of assigned tasks.

The MVP will provide a single hub for one club where members can view their assigned tasks, see due dates, and view upcoming club events. Officers can assign tasks to members and keep the club's tasks, events, and roster up to date.

Each member will only see tasks assigned to them in their main hub.

---

## 2. Problem

Student club responsibilities and event information can be communicated through different places, making it difficult for members to keep track of what they need to do and when they need to do it.

In the user interview, the participant was involved in a club but did not use a consistent calendar. Club events and information were often sent through email, and she used Outlook Calendar only when needed. She also usually kept tasks in her head, while a designated note-taker distributed assignments and tasks.

The Club Task and Event Hub addresses this problem by providing one central location for members to view their assigned tasks and upcoming club events.

---

## 3. Target Users and Roles

The MVP supports **one club** and exactly two roles:

* **Club Member**
* **Club Officer**

### Club Member

A club member can:

* View their own assigned tasks.
* View task due dates when provided.
* Mark their own tasks as complete.
* View upcoming club events.
* View tasks and events together on the main hub.

Members cannot view other members' tasks in their main hub.

### Club Officer

A club officer is also a club member and has all member capabilities.

Officers can additionally:

* Create and assign tasks to any club member, including themselves or another officer.
* Provide a due date when appropriate.
* Edit, reassign, and delete tasks.
* Create, edit, and delete club events.
* Add, edit, and remove members from the club roster.
* View all club tasks in the officer task-management area for management purposes.

---

## 4. User Research Evidence

The product is based on an interview with a student club member.

The participant:

* Is involved in a club.
* Does not have a consistent calendar.
* Receives club events and information through email.
* Uses Outlook Calendar only when needed.
* Usually keeps tasks in her head.
* Has a designated note-taker in the club who distributes assignments and tasks.

These findings support the need for a centralized location where club members can see their responsibilities and upcoming events.

---

## 5. Product Goals

The MVP will:

1. Provide members with one place to view their assigned tasks.
2. Make task due dates visible when a due date is provided.
3. Provide one place to view upcoming club events.
4. Display tasks and upcoming events together on the main hub.
5. Allow officers to assign tasks to specific club members.
6. Ensure members only see their own assigned tasks in their main hub.

The product is not intended to replace all club communication or existing calendar systems.

---

## 6. MVP Scope

The main MVP flow is:

**Officer assigns task → task appears in assigned member's hub → member sees task and due date → member sees upcoming events in the same hub → member marks task complete.**

The MVP includes:

1. Viewing assigned tasks.
2. Viewing task due dates.
3. Viewing upcoming events.
4. Viewing tasks and events together.
5. Officer task assignment.
6. Marking tasks complete.
7. Officer editing, reassigning, and deleting tasks.
8. Officer creating, editing, and deleting events.
9. Officer managing the club roster.

These capabilities support the core workflow from task assignment through completion while keeping the MVP focused on one club.

---

## 7. User Stories and Requirements

### Story 1 — View Assigned Tasks

**As a club member, I want to see tasks assigned to me so that I know what I am responsible for.**

**Acceptance Criteria:**

* Given a member has an assigned task, opening the main hub displays that task in **My Tasks**.
* If the member has no assigned tasks, the My Tasks section displays a message indicating that there are no assigned tasks.
* Tasks assigned to other members are not displayed in the member's My Tasks section.

---

### Story 2 — View Task Due Dates

**As a club member, I want to see task due dates so that I know when my work needs to be completed.**

**Acceptance Criteria:**

* A task may have a due date represented as a calendar date.
* Due dates are displayed clearly enough for members to distinguish which tasks are due first.
* A task without a due date does not display an invented due date.
* Due dates do not include required times.

---

### Story 3 — View Upcoming Club Events

**As a club member, I want to see upcoming club events so that I know what is happening.**

**Acceptance Criteria:**

* An event displayed in Upcoming Events includes a title and date.
* Optional event details may include time, location, and description.
* Multiple events are displayed chronologically, with the earliest event first.
* Events occurring before today are not displayed in Upcoming Events.
* Events occurring today are displayed.
* If there are no upcoming events, the section displays a message indicating that there are no upcoming events.

---

### Story 4 — View Tasks and Events Together

**As a club member, I want to see my tasks and upcoming events in one place so that I do not have to search through multiple platforms.**

**Acceptance Criteria:**

* My Tasks and Upcoming Events are displayed directly on the main hub.
* Tasks and events appear in separate sections.
* If there are no tasks, the event section remains visible.
* If there are no events, the task section remains visible.
* A member's main hub never displays another member's tasks.
* The main hub is the first page the member sees when entering the app.

---

### Story 7 — Assign Tasks

**As a club officer, I want to assign a task to a specific club member so that responsibility for the task is clear.**

**Acceptance Criteria:**

* A task requires a task name.
* A task requires exactly one club-member assignee.
* The assignee must be a member of the club roster.
* A description is optional.
* A due date is optional.
* If an assignee is not selected, the task cannot be saved and the required field is identified.
* If a task name is not provided, the task cannot be saved and the required field is identified.
* Officers can assign tasks to any roster member, including themselves or another officer.
* After saving, the assigned member can see the task in My Tasks.

---

### Story 9 — Mark Task Complete

**As a club member, I want to mark my assigned task as complete so that I can track my progress.**

**Acceptance Criteria:**

* A member can mark their own assigned task as complete.
* A completed task is clearly shown as complete.
* A member cannot mark another member's task as complete.

---

### Story 10 — Edit, Reassign, or Delete Tasks

**As a club officer, I want to manage existing tasks so that task information stays accurate.**

**Acceptance Criteria:**

* An officer can edit a task's name, description, or due date.
* Changes are reflected after the app is refreshed.
* An officer can reassign a task from one roster member to another.
* After reassignment, the task appears for the new assignee and no longer appears for the previous assignee.
* An officer can delete a task.
* After deletion, the task no longer appears.
* An officer cannot save a task without a task name or assignee.
* A non-officer cannot edit, reassign, or delete tasks.

---

### Story 11 — Manage Club Events

**As a club officer, I want to manage club events so that members can see accurate upcoming events.**

**Acceptance Criteria:**

* An event requires a title.
* An event requires a date.
* Time, location, and description are optional.
* If the title or date is missing, the event cannot be saved and the missing required field is identified.
* Officers can edit existing events.
* Officers can delete existing events.
* Changes to events are reflected after the app is refreshed.
* A non-officer cannot create, edit, or delete events.

---

### Story 12 — Manage Club Roster

**As a club officer, I want to manage the club roster so that tasks can only be assigned to current club members.**

**Acceptance Criteria:**

* An officer can add a member to the club roster.
* A roster member can be assigned a role of Member or Officer.
* A roster member can be selected as a task assignee.
* A removed member cannot be selected as a new task assignee.
* A non-officer cannot change the club roster.

---

### Deferred Stories

The following stories are not part of the MVP and are deferred for future development:

**Story 5 — Task Reminders**

As a club member, I want reminders about upcoming task deadlines so that I do not forget to complete my work.

**Story 6 — Event Reminders**

As a club member, I want reminders about upcoming club events so that I do not miss them.

**Story 8 — Assignment Notifications**

As a club member, I want to be notified when an officer assigns me a task so that I know when new work has been given to me.

These features are retained for future reference but will not be built as part of this semester's MVP.

---

## 8. Priorities

### Must Have

* Story 1: View Assigned Tasks
* Story 2: View Task Due Dates
* Story 3: View Upcoming Club Events
* Story 4: View Tasks and Events Together
* Story 7: Assign Tasks
* Story 9: Mark Task Complete
* Story 10: Edit, Reassign, or Delete Tasks
* Story 11: Manage Club Events
* Story 12: Manage Club Roster

### Should Have

None for the current MVP.

### Won't Have This Semester

* Task reminders
* Event reminders
* Assignment notifications
* Calendar or email integrations
* Automatic importing of events or tasks
* Multiple clubs
* Recurring events
* Advanced permission systems
* Multiple assignees for one task
* Task due times
* Real-time updates
* Confetti or reward features
* Advanced analytics
* Automatic task assignment based on member availability

---

## 9. MVP Acceptance Criteria

The MVP is considered functional when:

1. An officer can create a task with a name and one roster member as the assignee.
2. The assigned member can open the app and see the task in My Tasks.
3. A provided due date is displayed clearly, while a task without a due date does not display an invented date.
4. Today and future events appear in Upcoming Events in chronological order on the same main hub.
5. Members do not see another member's task in their My Tasks section.
6. A member can mark their own task as complete.
7. An officer can edit, reassign, and delete tasks, and reassigned tasks appear only for the new assignee.
8. An officer can create, edit, and delete events and manage roster members.
9. Empty task and event sections display clear messages instead of appearing broken.

---

## 10. Data and Display Requirements

### Club

* The MVP supports exactly one club.

### Roster

Each roster member has:

* Name
* Role: Member or Officer

Only roster members can be assigned tasks.

### Tasks

Each task contains:

* Name — required
* Description — optional
* Assignee — required, exactly one roster member
* Due date — optional, calendar date only
* Completion status — required and false when created

A member can mark their own task complete.

Completed tasks remain visible in My Tasks and are clearly marked as complete. The member can undo completion and return the task to an incomplete state.

In My Tasks:

* Tasks with due dates appear first, ordered by earliest due date.
* Tasks without due dates appear after tasks with due dates.
* Completed tasks remain in the same ordering but are clearly marked complete.
* Tasks with a due date before today are labeled as overdue.
* Overdue tasks remain visible until completed or deleted.
* No due date is invented when one was not provided.
* Members only see their own tasks in the main hub.

Officers may assign a due date that is already in the past.

### Events

Each event contains:

* Title — required
* Date — required
* Start/end time — optional
* Location — optional
* Description — optional

An upcoming event is an event whose date is today or later.

An event whose date is before today is considered past and is hidden from the Upcoming Events section.

"Today" is based on the current local date where the app is being used.

Upcoming events are displayed chronologically.

### Main Hub

The main hub is the first page members see.

It contains two separate sections:

**My Tasks**

* Shows the current user's tasks.
* Shows completion status.
* Shows due dates when provided.

**Upcoming Events**

* Shows all upcoming club events.
* Displays events chronologically.

The sections operate independently. If one section is empty, the other section remains visible.

### Officer Management Areas

Officer management areas are separate from the main member hub.

Officers may view all club tasks within the officer task-management area so they can edit, reassign, or delete them.

This officer management access does not change what regular members see in their main hub.

---

## 11. Platform and Technical Assumptions

* The MVP is a desktop web application.
* The MVP does not require real-time updates.
* Users may refresh the application to see saved changes.
* Sample or demonstration data may be used for development and testing.
* Full authentication is not required for this course MVP.
* A simple demo user-selection system can identify the current roster member and their role.

---

## 12. Out of Scope

The following are outside the MVP:

* Task reminders
* Event reminders
* Assignment notifications
* Email integration
* Calendar integration
* Automatic importing
* Multiple clubs
* Advanced permission systems
* Recurring events
* Automatic assignment based on member availability
* Social or reward features
* Analytics

---

## 13. Break-Test Requirements

The MVP must continue to behave correctly when tested with edge cases.

### Task Visibility

* A task assigned to Member A must appear for Member A.
* The same task must not appear in Member B's My Tasks.
* A task must not appear under the wrong assignee after reassignment.

### Due Dates

* A task with a due date must display that date.
* A task without a due date must not receive an invented date.
* A task with a past due date must be identifiable as overdue.

### Events

* Today's events must appear.
* Past events must not appear in Upcoming Events.
* Future events must appear in chronological order.
* An empty event list must display an appropriate message.

### Reassignment

* When a task is reassigned, it must appear for the new assignee.
* It must no longer appear for the previous assignee.

### Empty Sections

* An empty My Tasks section must display a message.
* An empty Upcoming Events section must display a message.
* One empty section must not prevent the other section from displaying its content.

### Roster

* A member with assigned tasks cannot be removed from the roster.
* The officer must first reassign or delete that member's assigned tasks.
* Once the member has no assigned tasks, the officer can remove them from the roster.

---

## 14. Success Criteria

The MVP succeeds when:

* An officer can assign a task to a club member.
* The assigned member can find the task in their main hub.
* A task's due date is identifiable when one exists.
* Members can see upcoming club events on the same hub as their tasks.
* Members do not see another member's assignment as their own.
* Members can mark their assigned tasks as complete.
* Officers can keep tasks, events, and the club roster up to date.

---

## 15. Future Considerations

Potential future improvements include:

* Task reminders
* Event reminders
* Assignment notifications
* Calendar and email integrations
* Importing events or tasks
* Support for multiple clubs
* Recurring events
* Assignment based on member availability
* Reward or social features
* Analytics

These features are not required for the current MVP.

---

## 16. Open Questions

The core MVP requirements have been defined sufficiently for development. Future implementation decisions may include:

* How the demo user-selection experience should be presented visually.
* Whether additional task sorting or filtering options would be useful in a future version.
* How completed tasks should be displayed in a future expanded task-management experience.
* Whether removed-member task handling should eventually support additional workflows beyond reassignment or deletion.
