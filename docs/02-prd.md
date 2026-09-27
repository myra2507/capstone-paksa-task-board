# Product Requirements Document — Club Task and Event Hub

## 1. Product Overview

### Product Name

Club Task and Event Hub

### Product Summary

The Club Task and Event Hub is a centralized web application for student club members and club officers to manage club tasks and upcoming events in one place.

The product addresses a problem identified during user research: club information and responsibilities can be spread across email, calendars, and other communication methods, while members may also rely on remembering tasks themselves.

The MVP focuses on bringing assigned tasks, task due dates, and upcoming club events together in one main hub. Club officers can assign tasks to specific members, and members can view the tasks assigned to them.

---

## 2. Problem

Student club members may receive responsibilities and event information through different places. During the user interview, the participant explained that club events and information often arrive through email, that she uses Outlook Calendar only when needed, and that she usually keeps tasks in her head.

This creates a risk that tasks or events are difficult to find or remember.

The product will provide one central location where a member can see their assigned tasks and upcoming club events.

---

## 3. Target Users

### Primary User: Club Member

A student who belongs to a club and needs to keep track of assigned responsibilities and upcoming club events.

The member needs to:

* See tasks assigned specifically to them.
* See when assigned tasks are due.
* See upcoming club events.
* See tasks and events together in one location.

### Secondary User: Club Officer

A student club officer who assigns responsibilities to club members.

The officer needs to:

* Create a task.
* Assign the task to a specific club member.
* Provide a due date when appropriate.

---

## 4. User Research Evidence

The product requirements are based on an interview with a student club member.

Key observations from the interview include:

* The participant is involved in a club.
* The participant does not consistently use a calendar.
* Club events and information commonly arrive through email.
* The participant uses Outlook Calendar when needed rather than as a primary system for all club information.
* The participant usually keeps tasks in her head.
* The club has a designated note-taker who distributes assignments and tasks to members.

These observations support the need for a centralized location for club tasks and events.

---

## 5. Product Goals

The product will:

1. Give club members one place to view their assigned tasks.
2. Make task due dates visible when a due date has been provided.
3. Give club members one place to view upcoming club events.
4. Display assigned tasks and upcoming events together in a main hub.
5. Allow club officers to assign tasks to specific club members.
6. Ensure members only see tasks assigned to them as their own tasks.

The product will not attempt to replace every communication or calendar system used by a club.

---

## 6. MVP Scope

### MVP: Club Task and Event Hub

The MVP will support the following end-to-end flow:

**Officer assigns task → member receives the assigned task → member sees the task and due date → member sees upcoming club events in the same hub.**

The MVP includes:

1. Viewing assigned tasks.
2. Viewing task due dates.
3. Viewing upcoming club events.
4. Viewing tasks and events together in one main hub.
5. Allowing a club officer to assign a task to a specific member.

### Why These Features Are the MVP

These features represent the smallest end-to-end version of the product that addresses the main problem identified during the interview: club responsibilities and information can be spread across different places, while the participant often relies on remembering tasks and checking email or a calendar when necessary.

The MVP creates one central place for the core task and event information without requiring external integrations.

---

## 7. User Stories and Requirements

### Story 1 — View Assigned Tasks

**As a club member, I want to see my assigned tasks in one place so that I don't have to rely on remembering them.**

**Acceptance Criteria**

1. Given a club member has an assigned task, when they open their task view, then the assigned task is displayed.
2. Given a club member has no assigned tasks, when they open their task view, then tasks assigned to other members are not displayed.

---

### Story 2 — View Task Due Dates

**As a club member, I want to see when my assigned tasks are due so that I know which tasks need my attention first.**

**Acceptance Criteria**

1. Given an assigned task has a due date, when the member views the task, then the due date is displayed with the task.
2. Given two assigned tasks have different due dates, when the member views their tasks, then the due dates are shown clearly enough to distinguish which task is due first.
3. Given a task has no due date, when the member views the task, then the system does not display an incorrect or invented due date.

---

### Story 3 — View Upcoming Club Events

**As a club member, I want to see upcoming club events in one place so that I don't have to search through emails to find them.**

**Acceptance Criteria**

1. Given a club has an upcoming event, when a member opens the events view, then the upcoming event is displayed with its event information.
2. Given there are multiple upcoming events, when the member opens the events view, then the events are displayed separately so each event can be identified.
3. Given there are no upcoming events, when the member opens the events view, then past events are not presented as upcoming events.

---

### Story 4 — View Tasks and Events Together

**As a club member, I want to see my tasks and upcoming events together so that club information isn't scattered across different places.**

**Acceptance Criteria**

1. Given a member has assigned tasks and upcoming club events, when they open the main hub, then both their tasks and upcoming events are visible.
2. Given the member has no assigned tasks but does have upcoming events, when they open the main hub, then the upcoming events are still displayed.
3. Given the member has tasks assigned to another member, when they open the main hub, then those other members' assignments are not displayed as their own.

---

### Story 5 — Task Reminders

**As a club member, I want to receive reminders about upcoming tasks so that I don't forget to complete them.**

**Priority: Should Have**

**Acceptance Criteria**

1. Given a member has an assigned task with an upcoming due date, when the reminder time is reached, then the member receives a reminder for that task.
2. Given a member has multiple upcoming tasks, when reminders are generated, then each reminder identifies the task it refers to.
3. Given a task has already passed its due date, when the reminder system runs, then it does not label the task as an upcoming task.

This feature is not required for the MVP.

---

### Story 6 — Event Reminders

**As a club member, I want to receive reminders about upcoming club events so that I don't miss them.**

**Priority: Should Have**

**Acceptance Criteria**

1. Given a member has an upcoming club event, when the event reminder time is reached, then the member receives a reminder identifying the event.
2. Given there are multiple upcoming events, when reminders are sent, then each reminder identifies the corresponding event.
3. Given an event has already occurred, when the reminder system runs, then the system does not send it as an upcoming-event reminder.

This feature is not required for the MVP.

---

### Story 7 — Assign Tasks to Members

**As a club officer, I want to assign a task to a specific club member so that each person knows what they are responsible for.**

**Acceptance Criteria**

1. Given a club officer is creating a task, when they select a club member as the assignee, then that member is listed as responsible for the task.
2. Given a task has been assigned to a member, when that member views their tasks, then the task appears in their assigned-task list.
3. Given an officer has not selected an assignee, when they attempt to assign the task, then the system does not falsely show the task as assigned to a member.

---

### Story 8 — New Assignment Notifications

**As a club member, I want to be notified when an officer assigns me a task so that I know when new work has been given to me.**

**Priority: Should Have**

**Acceptance Criteria**

1. Given an officer assigns a new task to a member, when the assignment is saved, then the assigned member receives a notification about the new task.
2. Given the member receives the notification, when they open it, then they can identify which task was assigned.
3. Given a task is assigned to Member A, when the assignment is saved, then Member B does not receive a notification for Member A's assignment.

This feature is not required for the MVP.

---

## 8. Priorities

### Must Have

The following requirements are necessary for the MVP:

* View assigned tasks.
* See task due dates.
* See upcoming club events.
* See tasks and events together in one main hub.
* Assign tasks to specific club members.

### Should Have

These features are useful but are not required for the core MVP:

* Task reminders.
* Event reminders.
* Notifications for new task assignments.

### Won't Have This Semester

The following features are explicitly outside the semester's MVP scope:

* Automatic calendar integration.
* Automatic email integration.
* Automatic importing of club events from Outlook.
* Automatic importing of club events from email.
* Social or reward features such as confetti.
* Advanced analytics or reporting about member participation.
* Automatic assignment of tasks based on member availability.

These features are excluded so that development remains focused on the core task and event management experience.

---

## 9. MVP Acceptance Criteria

The MVP is complete when all of the following are true:

### MVP Criterion 1

A club officer can create a task and assign it to a specific club member.

### MVP Criterion 2

The assigned member can open the main hub and see the task assigned to them.

### MVP Criterion 3

The assigned task displays its due date when a due date has been provided.

### MVP Criterion 4

The member can see upcoming club events in the same main hub.

### MVP Criterion 5

Tasks assigned to other members are not displayed as the current member's tasks.

---

## 10. Data and Display Requirements

### Tasks

Each task must be associated with:

* A task description or name.
* A specific assignee.
* A due date when one has been provided.

If no due date has been provided, the system must not invent one.

A member's task view must only identify tasks assigned to that member as their own tasks.

### Events

Each event must contain enough information for a member to identify the event.

Upcoming events must be distinguishable from past events.

Past events must not be presented as upcoming events.

### Main Hub

The main hub must provide access to both:

* The current member's assigned tasks.
* Upcoming club events.

The presence or absence of tasks must not prevent upcoming events from being displayed.

---

## 11. Out of Scope

The following are not part of the current semester's product requirements:

### External Integrations

The application will not automatically connect to or import information from:

* Outlook Calendar.
* Email accounts.
* Other external calendar systems.

### Advanced Automation

The application will not automatically determine which member should receive a task based on availability.

### Social and Reward Features

The application will not include additional reward features such as confetti unless the scope is intentionally changed later.

### Analytics

The application will not provide advanced analytics or reporting about member participation.

These exclusions prevent the product from expanding beyond the core problem of centralizing club tasks and events.

---

## 12. Break-Test Requirements

The MVP requirements were reviewed for possible literal interpretations and loopholes.

### Task Visibility

A system could technically display an assigned task somewhere that is difficult to find.

**Requirement:** The assigned task must be visible from the member's main hub without requiring the member to search through unrelated areas.

### Correct Assignee

A system could display a task while identifying the wrong member as the assignee.

**Requirement:** The task must identify the member responsible for completing it.

### Upcoming Events

A system could display a past event in an upcoming-events section.

**Requirement:** Only events occurring in the future may appear in the upcoming-events section.

### Member-Specific Tasks

A system could display every task in the club instead of only the current member's assignments.

**Requirement:** The member's task view must distinguish their assigned tasks from tasks assigned to other members.

---

## 13. Success Criteria

The MVP will demonstrate that:

1. An officer can assign a task to a specific member.
2. The assigned member can find that task in the main hub.
3. The member can identify the task's due date when one exists.
4. The member can see upcoming club events in the same hub.
5. A member does not mistake another member's assignment for their own.

Success is defined by the application satisfying these observable requirements rather than by the number of additional features included.

---

## 14. Future Considerations

Features outside the MVP may be reconsidered after the core task and event hub is functional.

Potential future features include:

* Task reminders.
* Event reminders.
* New assignment notifications.
* Calendar integration.
* Email integration.
* Automatic event importing.
* Availability-based assignment.
* Social or reward features.
* Participation analytics.

These features are not requirements for the current MVP and should not be implemented at the expense of the core task and event experience.
