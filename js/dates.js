// Date helpers. Due dates are calendar dates stored as "YYYY-MM-DD" text.
// "Today" is the browser's local date, not UTC (PRD §10, architecture §8).

function toLocalISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function todayLocalISO() {
  return toLocalISODate(new Date());
}

function localDateFromToday(dayOffset) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return toLocalISODate(date);
}

// Overdue applies only to incomplete tasks (architecture assumption 4).
function isOverdue(task) {
  return Boolean(task.dueDate) && !task.isComplete && task.dueDate < todayLocalISO();
}

// Builds the date from its parts so it is never shifted by a time zone.
function formatDueDate(isoDate) {
  const parts = isoDate.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Dated tasks first (earliest first), then undated tasks; ties by creation.
function compareTasks(a, b) {
  if (a.dueDate && !b.dueDate) return -1;
  if (!a.dueDate && b.dueDate) return 1;
  if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
  if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
  return a.id - b.id;
}
