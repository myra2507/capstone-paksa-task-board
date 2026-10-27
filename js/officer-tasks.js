// Officer task management: create, list all, edit/reassign, delete
// (PRD Stories 7 and 10). Officers-only is enforced by this page only;
// without login it is not real access control (architecture §6).

const form = document.getElementById("task-form");
const formHeading = document.getElementById("form-heading");
const nameInput = document.getElementById("task-name");
const assigneeSelect = document.getElementById("task-assignee");
const descriptionInput = document.getElementById("task-description");
const dueDateInput = document.getElementById("task-due-date");
const cancelButton = document.getElementById("cancel-button");
const nameError = document.getElementById("task-name-error");
const assigneeError = document.getElementById("task-assignee-error");
const pageMessage = document.getElementById("page-message");
const tableBody = document.querySelector("#all-tasks tbody");
const table = document.getElementById("all-tasks");
const emptyMessage = document.getElementById("all-tasks-empty");

// Id of the task being edited, or null when the form creates a new task.
let editingTaskId = null;

function renderAssigneeOptions() {
  getMembers().forEach(function (member) {
    const option = document.createElement("option");
    option.value = String(member.id);
    option.textContent = member.name + " (" + roleLabel(member) + ")";
    assigneeSelect.appendChild(option);
  });
}

function cell(text, className) {
  const td = document.createElement("td");
  td.textContent = text;
  if (className) {
    td.className = className;
  }
  return td;
}

function buildTaskRow(task) {
  const row = document.createElement("tr");
  row.dataset.taskId = String(task.id);

  row.appendChild(cell(task.name, "task-name"));
  row.appendChild(cell(memberName(task.assigneeId), "task-assignee"));

  const status = cell(task.isComplete ? "Complete" : "Not complete", "task-status");
  if (isOverdue(task)) {
    const overdue = document.createElement("span");
    overdue.className = "overdue";
    overdue.textContent = "Overdue";
    status.appendChild(overdue);
  }
  row.appendChild(status);

  row.appendChild(cell(task.dueDate ? formatDueDate(task.dueDate) : "No due date", "task-due"));
  row.appendChild(cell(task.description, "task-description"));

  const actions = document.createElement("td");
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-task";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", function () {
    startEditing(task);
  });
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-task";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    confirmDelete(task);
  });
  actions.append(editButton, deleteButton);
  row.appendChild(actions);

  return row;
}

function renderAllTasks() {
  const tasks = getTasks().sort(compareTasks);
  tableBody.replaceChildren();
  tasks.forEach(function (task) {
    tableBody.appendChild(buildTaskRow(task));
  });
  table.hidden = tasks.length === 0;
  emptyMessage.textContent = tasks.length === 0 ? "No tasks yet." : "";
}

function clearErrors() {
  nameError.textContent = "";
  assigneeError.textContent = "";
  nameInput.removeAttribute("aria-invalid");
  assigneeSelect.removeAttribute("aria-invalid");
}

// Returns the cleaned field values, or null after marking each missing
// required field (Story 7, Story 10).
function readForm() {
  clearErrors();
  const name = nameInput.value.trim();
  const assigneeId = Number(assigneeSelect.value);
  let valid = true;

  if (!name) {
    nameError.textContent = "Task name is required.";
    nameInput.setAttribute("aria-invalid", "true");
    valid = false;
  }
  if (!assigneeId || !findMember(assigneeId)) {
    assigneeError.textContent = "Choose an assignee.";
    assigneeSelect.setAttribute("aria-invalid", "true");
    valid = false;
  }
  if (!valid) {
    return null;
  }
  return {
    name: name,
    assigneeId: assigneeId,
    description: descriptionInput.value.trim(),
    dueDate: dueDateInput.value,
  };
}

function resetForm() {
  editingTaskId = null;
  form.reset();
  clearErrors();
  formHeading.textContent = "Create task";
  cancelButton.hidden = true;
}

function startEditing(task) {
  resetForm();
  editingTaskId = task.id;
  formHeading.textContent = "Edit task";
  nameInput.value = task.name;
  assigneeSelect.value = String(task.assigneeId);
  descriptionInput.value = task.description;
  dueDateInput.value = task.dueDate;
  cancelButton.hidden = false;
  pageMessage.textContent = "";
  nameInput.focus();
}

function confirmDelete(task) {
  if (!window.confirm('Delete the task "' + task.name + '"? This cannot be undone.')) {
    return;
  }
  deleteTask(task.id);
  if (editingTaskId === task.id) {
    resetForm();
  }
  pageMessage.textContent = "Task deleted.";
  renderAllTasks();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const fields = readForm();
  if (!fields) {
    pageMessage.textContent = "The task was not saved. Fix the marked fields.";
    return;
  }

  if (editingTaskId === null) {
    createTask(fields);
    pageMessage.textContent = "Task created.";
  } else if (updateTask(editingTaskId, fields)) {
    pageMessage.textContent = "Task updated.";
  } else {
    pageMessage.textContent = "This task no longer exists. It may have been deleted in another tab.";
  }
  resetForm();
  renderAllTasks();
});

cancelButton.addEventListener("click", function () {
  resetForm();
  pageMessage.textContent = "";
});

function init() {
  const current = getCurrentMember();
  document.getElementById("viewing-as-text").textContent = current
    ? "Viewing as: " + current.name + " (" + roleLabel(current) + ")"
    : "Viewing as: nobody chosen";
  showStorageNotice();

  if (!isOfficer(current)) {
    document.getElementById("officers-only").hidden = false;
    return;
  }
  document.getElementById("officer-area").hidden = false;
  renderAssigneeOptions();
  renderAllTasks();
}

init();
