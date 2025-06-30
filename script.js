// ---------- DOM references ----------
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoListEl = document.getElementById("todoList");

// ---------- model ----------
let todos = JSON.parse(localStorage.getItem("todos") || "[]"); // [{id, text, done}]

// ---------- initial render ----------
render();

// ---------- add new todo ----------
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return; // ignore empty input
  todos.push({ id: Date.now(), text, done: false });
  todoInput.value = "";
  saveAndRender();
});

// ---------- list click delegation ----------
todoListEl.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  const id = li ? Number(li.dataset.id) : null;
  if (!id) return;

  if (e.target.matches('input[type="checkbox"]')) {
    toggleDone(id);
  } else if (e.target.classList.contains("xBtn")) {
    deleteTodo(id);
  }
});

// ---------- helpers ----------
function toggleDone(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveAndRender();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
}

function render() {
  todoListEl.innerHTML = ""; // clear

  if (!todos.length) {
    todoListEl.innerHTML =
      '<li style="justify-content:center;color:#777;">Nothing to do 😊</li>';
    return;
  }

  todos.forEach(({ id, text, done }) => {
    const li = document.createElement("li");
    li.dataset.id = id;
    li.classList.toggle("done", done);
    li.innerHTML = `
      <div>
        <input type="checkbox" ${done ? "checked" : ""} />
        <span>${text}</span>
      </div>
      <div class="actions">
        <button class="xBtn" title="Delete">&times;</button>
      </div>`;
    todoListEl.appendChild(li);
  });
}
