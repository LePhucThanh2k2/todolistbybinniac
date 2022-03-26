function createElement(todo, params) {
  const templateId = document.getElementById("todoTemplate");
  const cloneLi = templateId.content.querySelector("li").cloneNode(true);
  const alertElement = cloneLi.querySelector(".alert");
  //   render content
  const titleElement = cloneLi.querySelector(".todo__title");
  titleElement.textContent = todo.text;
  cloneLi.dataset.id = todo.id;
  // Edit
  const edit = cloneLi.querySelector(".edit");
  edit.addEventListener("click", () => {
    const todoList = getTodoList();
    const todoCurrent = todoList.find((x) => x.id === todo.id);
    const formInput = document.querySelector(".formInput");
    formInput.dataset.id = todoCurrent.id;
    const textInput = document.getElementById("textInput");
    textInput.value = todoCurrent.text;
  });
  // remove
  const removeElement = cloneLi.querySelector(".remove");
  removeElement.addEventListener("click", () => {
    cloneLi.remove();
    // remove in data local
    const todoList = getTodoList();
    const newTodo = todoList.filter((x) => x.id !== todo.id);
    localStorage.setItem("todoList", JSON.stringify(newTodo));
  });

  //////////////////////////// Mark as done////////////////////////////////////
  const markAsDone = cloneLi.querySelector(".mark-as-done");
  //render datalocal to brower
  markAsDone.textContent = todo.action;
  const modelAlert =
    todo.status === "pending" ? "alert-secondary" : "alert-success";
  alertElement.classList.add(modelAlert);
  cloneLi.dataset.status = todo.status;

  const modelBtn = todo.action === "Finish" ? "btn-success" : "btn-warning";
  markAsDone.classList.add(modelBtn);

  // render filter change
  // if (params === 0) {
  //   cloneLi.hidden = !isMatch(cloneLi, params);
  // }

  // click mark-as-done
  markAsDone.addEventListener("click", () => {
    alertElement.classList.remove("alert-secondary", "alert-success");
    markAsDone.classList.remove("btn-success", "btn-warning");
    // change info for data
    todo.status = todo.status === "pending" ? "completed" : "pending";
    todo.action = todo.action === "Finish" ? "Reset" : "Finish";
    markAsDone.textContent = todo.action;
    const modelAlert =
      todo.status === "pending" ? "alert-secondary" : "alert-success";
    alertElement.classList.add(modelAlert);
    const modelBtn = todo.action === "Finish" ? "btn-success" : "btn-warning";
    markAsDone.classList.add(modelBtn);
    cloneLi.dataset.status = todo.status;

    // update for local
    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id === todo.id);
    if (index > -1) {
      todoList[index].status = todo.status;
      todoList[index].action = todo.action;
    }
    localStorage.setItem("todoList", JSON.stringify(todoList));
  });
  /////////////////////////////////////////////////////////////
  return cloneLi;
}
function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem("todoList"));
  } catch {
    return [];
  }
}
function renderTodoList(listItem, ulElement, params) {
  const ul = document.getElementById(ulElement);
  for (const todo of listItem) {
    const newElement = createElement(todo, params);
    ul.append(newElement);
  }
}
function handleTodoFormSubmit(event) {
  event.preventDefault(); // block brower reloading
  const textInput = document.getElementById("textInput");
  const formInput = document.querySelector(".formInput");
  // add todo
  const newTodo = {
    id: Date.now(),
    text: textInput.value,
    status: "pending",
    action: "Finish",
  };
  // update todo
  const isEdit = Boolean(formInput.dataset.id);
  if (isEdit) {
    const todoList = getTodoList();
    const todo = todoList.find((x) => x.id.toString() === formInput.dataset.id);
    todo.text = textInput.value;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    const liElement = document.querySelector(
      `ul#todoList > li[data-id="${formInput.dataset.id}"]`
    );
    if (liElement) {
      const titleElement = liElement.querySelector(".todo__title");
      titleElement.textContent = textInput.value;
    }
  } else {
    // update for data local
    const todoList = getTodoList();
    todoList.push(newTodo);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    const ul = document.getElementById("todoList");
    const newElement = createElement(newTodo);
    ul.append(newElement);
  }
  // render in brower
  // reset form
  delete formInput.dataset.id;
  formInput.reset();
}
function getAllToDoElements() {
  return document.querySelectorAll("ul#todoList > li");
}
////////////////////////// Model Search/////////////////////////

function isMatchSearch(liElement, searchTerm) {
  if (!liElement) return false;
  if (searchTerm === "") return true;

  const titleElement = liElement.querySelector("p.todo__title");
  if (!titleElement) return false;
  const textLi = titleElement.textContent;
  const term = searchTerm.toLowerCase();
  return textLi.toLowerCase().includes(term);
}
function initSearchTerm(params) {
  // find element input
  const searchInput = document.getElementById("searchTerm");
  if (!searchInput) return;
  if (params.get("searchTerm")) {
    searchInput.value = params.get("searchTerm");
  }
  // attach event for input
  searchInput.addEventListener("input", () => {
    handleFilterChange("searchTerm", searchInput.value);
  });
}

//////////////////////// Model Filter////////////////////////////

function isMatchStatus(liElement, filterStatus) {
  return filterStatus === "all" || liElement.dataset.status === filterStatus;
}
function initFilterTerm(params) {
  // find element filter
  const filterElememt = document.getElementById("filter");
  if (params.get("status")) {
    filterElememt.value = params.get("status");
  }
  // attach event for elemet filter
  filterElememt.addEventListener("change", () => {
    handleFilterChange("status", filterElememt.value);
  });
}
/////////////////////////Model Filter Change All///////////////////////
function isMatch(liElement, params) {
  const searchParams = params.get("searchTerm");
  const searchStatus = params.get("status");

  return (
    isMatchSearch(liElement, searchParams) &&
    isMatchStatus(liElement, searchStatus)
  );
}
function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, "", url);

  const todoElement = getAllToDoElements();
  for (const liElement of todoElement) {
    const needToShow = isMatch(liElement, url.searchParams);
    liElement.hidden = !needToShow;
  }
}

(() => {
  const todoList = [
    {
      id: 1,
      text: "6:00 Wake up",
      status: "completed",
      action: "Reset",
    },
    {
      id: 2,
      text: "6:30 Buy coffee - Breakfast food",
      status: "completed",
      action: "Reset",
    },
  ];
  localStorage.setItem("todoList", JSON.stringify(todoList));

  const listItem = JSON.parse(localStorage.getItem("todoList"));

  const formInput = document.querySelector(".formInput");
  const submit = formInput.querySelector("#submit");
  submit.addEventListener("click", handleTodoFormSubmit);

  // get query params object

  const params = new URLSearchParams(window.location.search);

  renderTodoList(listItem, "todoList", params);
  initSearchTerm(params);
  initFilterTerm(params);
  // note: Need fix bug search + filter.Because when user input search but not selector filter then function handleFilterChange not working as intended
})();
