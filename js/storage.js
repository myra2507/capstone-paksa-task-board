// TEMPORARY PROTOTYPE STORAGE (D08)
//
// This file stores the club roster and tasks in the browser's localStorage.
// It is a stand-in for the Supabase database described in
// docs/03-architecture.md, which has NOT been set up yet.
//
// Limitations of this prototype storage:
// - Data lives only in this one browser on this one computer.
//   Other people and other browsers do not see the same tasks.
// - Clearing the browser's site data deletes every change and
//   brings back the seeded demo data.
// - The roster is fixed demo data; roster management is not part of D08.
// - Nothing here enforces rules on the server. The page code checks the rules.
//
// Real Supabase integration is deferred to a later milestone.

const STORAGE_KEYS = {
  members: "clubHub.members",
  tasks: "clubHub.tasks",
};

// Set when saved data could not be read and the demo data was restored.
let storageNotice = "";

// Demo members are fake people. Sam starts with no tasks so the empty
// My Tasks message can be checked.
function buildSeedMembers() {
  return [
    { id: 1, name: "Avery", role: "officer" },
    { id: 2, name: "Morgan", role: "officer" },
    { id: 3, name: "Jordan", role: "member" },
    { id: 4, name: "Sam", role: "member" },
  ];
}

// Seed due dates are relative to today so the overdue and future examples
// stay meaningful whenever the demo data is created.
function buildSeedTasks() {
  const now = new Date().toISOString();
  return [
    {
      id: 1,
      name: "Reserve room for general meeting",
      description: "Book a room that holds at least 30 people.",
      assigneeId: 3,
      dueDate: localDateFromToday(5),
      isComplete: false,
      createdAt: now,
    },
    {
      id: 2,
      name: "Send event recap email",
      description: "",
      assigneeId: 3,
      dueDate: localDateFromToday(-2),
      isComplete: false,
      createdAt: now,
    },
    {
      id: 3,
      name: "Update club bulletin board",
      description: "Add the new semester calendar.",
      assigneeId: 3,
      dueDate: "",
      isComplete: false,
      createdAt: now,
    },
    {
      id: 4,
      name: "Order snacks for social",
      description: "",
      assigneeId: 1,
      dueDate: localDateFromToday(3),
      isComplete: true,
      createdAt: now,
    },
    {
      id: 5,
      name: "Draft budget proposal",
      description: "Include last semester's spending.",
      assigneeId: 2,
      dueDate: localDateFromToday(14),
      isComplete: false,
      createdAt: now,
    },
  ];
}

function seedStorage() {
  localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(buildSeedMembers()));
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(buildSeedTasks()));
}

// Returns the parsed array, null if the key is missing, or throws if the
// saved value is not a JSON array.
function readArray(key) {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return null;
  }
  const value = JSON.parse(raw);
  if (!Array.isArray(value)) {
    throw new Error(key + " is not a list");
  }
  return value;
}

// Reads members and tasks, seeding demo data on first use and restoring it
// if the saved data cannot be read.
function loadData() {
  try {
    const members = readArray(STORAGE_KEYS.members);
    const tasks = readArray(STORAGE_KEYS.tasks);
    if (members !== null && tasks !== null) {
      return { members: members, tasks: tasks };
    }
  } catch (error) {
    storageNotice = "Saved data couldn't be read, so the demo data was restored.";
  }
  seedStorage();
  return { members: buildSeedMembers(), tasks: readArray(STORAGE_KEYS.tasks) };
}

function getMembers() {
  return loadData().members;
}

function getTasks() {
  return loadData().tasks;
}

function findMember(memberId) {
  return getMembers().find(function (member) {
    return member.id === memberId;
  });
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

function createTask(fields) {
  const tasks = getTasks();
  const nextId = tasks.reduce(function (max, task) {
    return Math.max(max, task.id);
  }, 0) + 1;
  const task = {
    id: nextId,
    name: fields.name,
    description: fields.description,
    assigneeId: fields.assigneeId,
    dueDate: fields.dueDate,
    isComplete: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

// Each change re-reads storage first, so a task deleted in another tab is
// reported as missing (returns false) instead of being saved back.
function updateTask(taskId, fields) {
  const tasks = getTasks();
  const task = tasks.find(function (t) {
    return t.id === taskId;
  });
  if (!task) {
    return false;
  }
  Object.assign(task, fields);
  saveTasks(tasks);
  return true;
}

function setTaskComplete(taskId, isComplete) {
  return updateTask(taskId, { isComplete: isComplete });
}

function deleteTask(taskId) {
  const tasks = getTasks();
  const remaining = tasks.filter(function (t) {
    return t.id !== taskId;
  });
  saveTasks(remaining);
  return remaining.length < tasks.length;
}
