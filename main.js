function createElement(todo) {
  // get element id template
  const template = document.getElementById("todoTemplate");
  // clone li in template
  const cloneLi = template.content.querySelector("li").cloneNode(true);
  // attach event button of li
  const markAsDoneButton = cloneLi.querySelector(".mark-as-done");

  // update status
  const todoAlert = cloneLi.querySelector(".alert");
  const alertClass =
    todo.status === "completed" ? "alert-success" : "alert-secondary";
  todoAlert.classList.add(alertClass);
  // update action button

  markAsDoneButton.textContent = todo.action;
  const addAction = todo.action === "Reset" ? "btn-warning" : "btn-success";
  markAsDoneButton.classList.add(addAction);

  // add click event for mark-as-done button
  markAsDoneButton.addEventListener("click", () => {
    // get data-status
    const currentStatus = cloneLi.dataset.status;
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    // update data-status
    cloneLi.dataset.status = newStatus;
    // update alert class
    const newAlertClass =
      currentStatus === "completed" ? "alert-secondary" : "alert-success";
    todoAlert.classList.remove("alert-secondary", "alert-success");
    todoAlert.classList.add(newAlertClass);
    // update for data
    const todoList = getTodoList();
    const idx = todoList.findIndex((x) => x.id === todo.id);
    todoList[idx].status = newStatus;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    // update action button
    // update action
    todo.action = todo.action === "Reset" ? "Finish" : "Reset";
    markAsDoneButton.textContent = todo.action;

    todoList[idx].action = todo.action;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    // update class action
    const addAction = todo.action === "Reset" ? "btn-warning" : "btn-success";
    markAsDoneButton.classList.remove("btn-warning", "btn-success");
    markAsDoneButton.classList.add(addAction);
  });
  const removeButton = cloneLi.querySelector(".remove");
  removeButton.addEventListener("click", () => {
    const todoList = getTodoList();
    const newTodo = todoList.filter((x) => x.id !== todo.id);
    localStorage.setItem("todoList", JSON.stringify(newTodo));
    cloneLi.remove();
  });
  // update data
  const liElement = cloneLi.querySelector(".todo__title");
  liElement.textContent = todo.text;
  cloneLi.dataset.id = todo.id;
  cloneLi.dataset.status = todo.status;
  // return li
  return cloneLi;
}
function renderTodoList(todoList, ulElement) {
  const ulElementById = document.getElementById(ulElement);
  for (const todo of todoList) {
    const liElement = createElement(todo);
    ulElementById.append(liElement);
  }
}
function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem("todoList"));
  } catch {
    return [];
  }
}
function handleTodoFormSubmit(event) {
  event.preventDefault();
  const inputSubmit = document.getElementById("todoText");
  // new data
  const newTodo = {
    id: Date.now(),
    text: inputSubmit.value,
    status: "pending",
    action: "Finish",
  };
  // update data for local
  const todoList = getTodoList();
  todoList.push(newTodo);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  // reset form
  const todoForm = document.querySelector(".todoListForm");
  todoForm.reset();
  // render in dom
  const ulElementById = document.getElementById("todoList");
  const liElement = createElement(newTodo);
  ulElementById.append(liElement);
}
(() => {
  // const todoList = [
  //   { id: 1, text: "Learn HTML,CSS", status: "completed", action: "Reset" },
  //   { id: 2, text: "Learn SASS", status: "completed", action: "Reset" },
  //   { id: 3, text: "Learn Javascript", status: "pending", action: "Finish" },
  //   { id: 4, text: "Learn React", status: "pending", action: "Finish" },
  //   { id: 5, text: "Learn Next", status: "pending", action: "Finish" },
  // ];
  const todoList = getTodoList();
  renderTodoList(todoList, "todoList");
  const todoForm = document.querySelector(".todoListForm");
  if (!todoForm) return;
  todoForm.addEventListener("submit", handleTodoFormSubmit);
})();
