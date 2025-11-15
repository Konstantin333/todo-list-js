import { body, header, main, footer } from "./variables.js";

let allTasks = new Array();
let theme = new String();

function showFrameworks() {
  header["usedFramework"].addEventListener("click", () => {
    if (header["frameworks"].style.display === "flex") {
      header["frameworks"].style.display = "none";
    } else {
      header["frameworks"].style.display = "flex";
    }
  });
}

function hideFrameworks(element) {
  element.addEventListener("mousedown", () => {
    header["frameworks"].style.display = "none";
  });
}

function scrollTop() {
  header["text"].addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
}

function changeTheme() {
  header["usedTheme"].addEventListener("click", () => {
    switchToDarkTheme();
  });
}

function switchToDarkTheme() {
  let icon = null;

  if (header["usedTheme"].childNodes.length === 1) {
    icon = header["usedTheme"].childNodes[0];
  } else {
    icon = header["usedTheme"].childNodes[1];
  }

  if (icon.classList.contains("fa-sun")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  [
    body,
    header["thisHeader"],
    header["frameworks"],
    main["thisMain"],
    main["addingTask"],
    main["inputText"],
    main["buttonAdd"],
    main["tasksList"],
    main["emptyList"],
    main["tasksStatus"],
    main["buttonDelete"],
    footer,
  ].forEach((e) => {
    e.classList.toggle("dark-theme");
  });

  if (header["frameworks"].childNodes.length === 5) {
    for (let i = 0; i < header["frameworks"].childNodes.length; i++) {
      if (i % 2 !== 0) continue;
      header["frameworks"].childNodes[i].classList.toggle("dark-theme");
    }
  } else {
    for (let i = 3; i < header["frameworks"].childNodes.length; i++) {
      if (i % 2 == 0) continue;
      header["frameworks"].childNodes[i].classList.toggle("dark-theme");
    }
  }

  if (main["tasksList"].childNodes[1].classList.contains("task")) {
    for (let i = 1; i < main["tasksList"].childNodes.length; i++) {
      main["tasksList"].childNodes[i].classList.toggle("dark-theme");
    }
  } else {
    for (let i = 3; i < main["tasksList"].childNodes.length; i++) {
      main["tasksList"].childNodes[i].classList.toggle("dark-theme");
    }
  }

  theme = String(header["thisHeader"].classList);
  localStorage.setItem("theme", theme);
}

function addOnKeypress() {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });
}

function addOnMouseClick() {
  main["buttonAdd"].addEventListener("click", () => {
    addTask();
  });
}

function addTask() {
  const text = main["inputText"].value;
  main["inputText"].value = "";
  main["inputText"].focus();

  const task = {
    id: Date.now(),
    text: text,
    done: false,
  };

  if (task.text !== "") {
    allTasks.push(task);
    createTask(task);
  }

  saveToLocaleStorage();
}

function createTask(task) {
  const newTask = document.createElement("div");
  newTask.classList.add("task");

  if (main["tasksList"].classList.contains("dark-theme")) {
    newTask.classList.toggle("dark-theme");
  }

  main["tasksList"].append(newTask);

  const newTaskText = document.createElement("div");
  newTaskText.classList.add("taskText");
  newTaskText.id = task.id;

  if (task.done === true) {
    newTaskText.classList.add("task-done");
  }

  newTask.appendChild(newTaskText);
  const node = document.createTextNode(task.text);
  newTaskText.appendChild(node);

  const newTaskButtons = document.createElement("div");
  newTaskButtons.classList.add("taskButtons");
  newTask.appendChild(newTaskButtons);

  const buttonDone = document.createElement("i");
  buttonDone.classList.add("fa-solid");
  buttonDone.classList.add("fa-check");
  buttonDone.addEventListener("click", doneTask);

  if (task.done === true) {
    buttonDone.classList.add("task-done");
  }

  const buttonDelete = document.createElement("i");
  buttonDelete.classList.add("fa-solid");
  buttonDelete.classList.add("fa-trash-can");
  buttonDelete.addEventListener("click", deleteTask);

  newTaskButtons.appendChild(buttonDone);
  newTaskButtons.appendChild(buttonDelete);

  showEmptyList();
  showTasksStatus();
  showButtonDelete();
}

function doneTask() {
  const text = this.parentElement.parentElement.childNodes[0];
  const button = this;
  const id = Number(text.id);
  const task = allTasks.find((task) => task.id === id);

  text.classList.toggle("task-done");
  button.classList.toggle("task-done");
  task.done = !task.done;

  saveToLocaleStorage();
  showTasksStatus();
  showButtonDelete();
}

function deleteTask() {
  const task = this.parentElement.parentElement;
  const id = Number(task.childNodes[0].id);
  const index = allTasks.findIndex((task) => task.id === id);

  allTasks.splice(index, 1);
  main["tasksList"].removeChild(task);

  saveToLocaleStorage();
  showEmptyList();
  showTasksStatus();
  showButtonDelete();
}

function showEmptyList() {
  if (allTasks.length === 0) {
    main["emptyList"].style.display = "block";
    main["tasksStatus"].style.display = "none";
    main["statusText"].innerHTML = "";
  } else {
    main["emptyList"].style.display = "none";
    main["tasksStatus"].style.display = "flex";
  }
}

function showTasksStatus() {
  if (allTasks.length > 0) {
    main["statusText"].innerHTML = null;
  }

  const unfinished =
    document.querySelectorAll(".fa-check").length -
    document.querySelectorAll("div.task-done").length;
  let textNode;

  if (unfinished === 0) {
    textNode = "вы выполнили все задачи! пора отдыхать!";
  } else if (unfinished === 1) {
    textNode = `у вас осталась ${unfinished} незавершённая задача`;
  } else if (unfinished > 1 && unfinished < 5) {
    textNode = `у вас осталось ${unfinished} незавершённые задачи`;
  } else {
    textNode = `у вас осталось ${unfinished} незавершённых задач`;
  }

  const paragraph = document.createElement("p");
  const text = document.createTextNode(textNode);
  main["statusText"].appendChild(paragraph);
  paragraph.appendChild(text);
}

function showButtonDelete() {
  if (document.querySelectorAll("div.task-done").length === 0) {
    main["buttonDelete"].style.display = "none";
  } else {
    main["buttonDelete"].style.display = "block";
  }
}

function deleteCompletedTasks() {
  main["buttonDelete"].addEventListener("click", () => {
    const completedTasks = document.querySelectorAll("div.task-done");

    for (let i = 0; i < completedTasks.length; i++) {
      const id = Number(completedTasks[i].id);
      const index = allTasks.findIndex((task) => task.id === id);
      allTasks.splice(index, 1);
      completedTasks[i].parentElement.remove();

      saveToLocaleStorage();
    }

    showEmptyList();
    showButtonDelete();
  });
}

function saveToLocaleStorage() {
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function getFromLocaleStorage() {
  if (localStorage.getItem("tasks")) {
    allTasks = JSON.parse(localStorage.getItem("tasks"));
  }

  allTasks.forEach((task) => {
    createTask(task);
  });

  if (localStorage.getItem("theme") === "dark-theme") {
    switchToDarkTheme();
  }
}

function init() {
  // showFrameworks();
  // hideFrameworks(main.thisMain);
  // hideFrameworks(footer);
  scrollTop();
  changeTheme();
  addOnKeypress();
  addOnMouseClick();
  showEmptyList();
  showTasksStatus();
  deleteCompletedTasks();
  getFromLocaleStorage();
}

init();
