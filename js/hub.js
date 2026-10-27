// Main hub: demo-user picker and My Tasks (PRD Stories 1, 2, 9).

const picker = document.getElementById("viewing-as");
const officerLink = document.getElementById("officer-link");
const taskList = document.getElementById("my-tasks");
const emptyMessage = document.getElementById("my-tasks-empty");
const taskMessage = document.getElementById("task-message");

function renderPicker() {
  const current = getCurrentMember();
  getMembers().forEach(function (member) {
    const option = document.createElement("option");
    option.value = String(member.id);
    option.textContent = member.name + " (" + roleLabel(member) + ")";
    picker.appendChild(option);
  });
  picker.value = current ? String(current.id) : "";
}

function buildTaskItem(task, current) {
  const item = document.createElement("li");
  item.className = "task" + (task.isComplete ? " task-complete" : "");
  item.dataset.taskId = String(task.id);

  const name = document.createElement("h3");
  name.className = "task-name";
  name.textContent = task.name;
  item.appendChild(name);

  const details = document.createElement("p");
  details.className = "task-details";

  const status = document.createElement("span");
  status.className = "task-status " + (task.isComplete ? "status-complete" : "status-open");
  status.textContent = task.isComplete ? "Complete" : "Not complete";
  details.appendChild(status);

  if (isOverdue(task)) {
    const overdue = document.createElement("span");
    overdue.className = "overdue";
    overdue.textContent = "Overdue";
    details.appendChild(overdue);
  }

  const due = document.createElement("span");
  due.className = "task-due";
  due.textContent = task.dueDate ? "Due " + formatDueDate(task.dueDate) : "No due date";
  details.appendChild(due);

  const assignee = document.createElement("span");
  assignee.className = "task-assignee";
  assignee.textContent = "Assigned to: " + current.name + " (you)";
  details.appendChild(assignee);

  item.appendChild(details);

  if (task.description) {
    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description;
    item.appendChild(description);
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "toggle-complete";
  toggle.textContent = task.isComplete ? "Mark incomplete" : "Mark complete";
  toggle.addEventListener("click", function () {
    toggleComplete(task);
  });
  item.appendChild(toggle);

  return item;
}

function toggleComplete(task) {
  const current = getCurrentMember();
  // A member can only change completion on their own task (Story 9).
  if (!current || task.assigneeId !== current.id) {
    taskMessage.textContent = "You can only mark your own tasks complete.";
  } else if (!setTaskComplete(task.id, !task.isComplete)) {
    taskMessage.textContent = "This task no longer exists. It may have been deleted.";
  } else {
    taskMessage.textContent = "";
  }
  renderMyTasks();
}

function renderMyTasks() {
  const current = getCurrentMember();
  officerLink.hidden = !isOfficer(current);
  taskList.replaceChildren();

  if (!current) {
    emptyMessage.textContent = "Choose who you're viewing as to see your tasks.";
    return;
  }

  // Members only ever see their own tasks here (Stories 1 and 4).
  const myTasks = getTasks()
    .filter(function (task) {
      return task.assigneeId === current.id;
    })
    .sort(compareTasks);

  emptyMessage.textContent = myTasks.length === 0 ? "You have no assigned tasks." : "";
  myTasks.forEach(function (task) {
    taskList.appendChild(buildTaskItem(task, current));
  });
}

picker.addEventListener("change", function () {
  setCurrentMemberId(Number(picker.value));
  taskMessage.textContent = "";
  renderMyTasks();
});

renderPicker();
showStorageNotice();
renderMyTasks();
