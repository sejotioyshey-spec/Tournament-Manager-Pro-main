let output = document.getElementById("output");
let clear_btn = document.getElementById("clearBTN");
let total_task = document.getElementById("total-count");
let completed_task = document.getElementById("completed-count");
let pending_task = document.getElementById("pending-count");

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const icon = themeToggle.querySelector("i");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  icon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  icon.classList.replace(
    isDark ? "fa-moon" : "fa-sun",
    isDark ? "fa-sun" : "fa-moon"
  );
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Update Stats
function updateStats() {
  let tasks = document.querySelectorAll(".task-item");
  let completedTasks = document.querySelectorAll(".task-checkbox:checked");

  total_task.innerText = tasks.length;
  completed_task.innerText = completedTasks.length;
  pending_task.innerText = tasks.length - completedTasks.length;
}

// Save Tasks to Local Storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach((taskItem) => {
    const text = taskItem.querySelector(".task-text").textContent;
    const checked = taskItem.querySelector(".task-checkbox").checked;
    tasks.push({ text, checked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks from Local Storage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    createTask(task.text, task.checked);
  });
  updateStats();
}

// Add Task
function add_task() {
  let inputValue = document.getElementById("input").value.trim();
  if (inputValue == "") {
    alert("Please enter a task");
    return;
  }

  createTask(inputValue, false);
  document.getElementById("input").value = "";
  saveTasks();
  updateStats();
}

// Create Task Element
function createTask(text, checked = false) {
  let taskItem = document.createElement("div");
  taskItem.className = "task-item";

  let taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.className = "task-checkbox";
  taskCheckbox.checked = checked;

  let taskText = document.createElement("div");
  taskText.className = "task-text";
  taskText.textContent = text;

  if (checked) {
    taskText.classList.add("checked");
    taskItem.classList.add("checked");
  }

  let editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

  // Checkbox logic
  taskCheckbox.addEventListener("change", function () {
    taskText.classList.toggle("checked", this.checked);
    taskItem.classList.toggle("checked", this.checked);
    moveToProperPosition(taskItem);
    saveTasks();
    updateStats();
  });

  // Edit logic
  editBtn.addEventListener("click", function () {
    let newText = prompt("Edit your task:", taskText.textContent);
    if (newText !== null && newText.trim() !== "") {
      taskText.textContent = newText.trim();
      saveTasks();
    }
  });

  // Delete logic
  deleteBtn.addEventListener("click", function () {
    taskItem.remove();
    saveTasks();
    updateStats();
  });

  // Assemble
  taskItem.append(taskCheckbox, taskText, editBtn, deleteBtn);
  moveToProperPosition(taskItem);
}

//  Move Task to Proper Position
function moveToProperPosition(taskItem) {
  const allTasks = Array.from(output.children);
  const firstChecked = allTasks.find(
    (task) =>
      task.querySelector(".task-checkbox") &&
      task.querySelector(".task-checkbox").checked
  );

  const checkbox = taskItem.querySelector(".task-checkbox");
  if (checkbox.checked) {
    output.appendChild(taskItem);
  } else if (firstChecked) {
    output.insertBefore(taskItem, firstChecked);
  } else {
    output.insertBefore(taskItem, output.firstChild);
  }
}

// Clear All Tasks
clear_btn.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear all tasks?")) {
    output.innerHTML = "";
    localStorage.removeItem("tasks");
    updateStats();
  }
});

//Enter Key Support
document.getElementById("input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") add_task();
});

// On Page Load
loadTasks();
