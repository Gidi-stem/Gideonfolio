(function () {

  // ---- State ----
  // In-memory array of task objects. No browser storage is used,
  // per artifact rules — this resets on reload. Swap in a call to
  // window.storage (see persistent_storage docs) if you want tasks
  // to persist between visits.
  let tasks = [
    { id: 1, title: 'Draft CleP sequential sign-off flow', due: '', priority: 'high', done: false },
    { id: 2, title: 'Review Group 12 sprint notes', due: '', priority: 'medium', done: false },
    { id: 3, title: 'Submit Federal Technical College proposal', due: '', priority: 'medium', done: false }
  ];
  let nextId = 4;
  let currentFilter = 'all';

  // ---- Elements ----
  const form = document.getElementById('taskForm');
  const titleInput = document.getElementById('taskTitle');
  const dueInput = document.getElementById('taskDue');
  const priorityInput = document.getElementById('taskPriority');
  const list = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('taskCount');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // ---- Functions ----

  function addTask(title, due, priority) {
    tasks.push({ id: nextId++, title: title.trim(), due, priority, done: false });
  }

  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
  }

  function getVisibleTasks() {
    if (currentFilter === 'active') return tasks.filter(t => !t.done);
    if (currentFilter === 'done') return tasks.filter(t => t.done);
    return tasks;
  }

  function formatDue(due) {
    if (!due) return 'No due date';
    const d = new Date(due + 'T00:00:00');
    if (isNaN(d)) return due;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function buildTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.dataset.priority = task.priority;
    li.dataset.id = task.id;

    li.innerHTML = `
      <button class="task-check" aria-label="${task.done ? 'Mark as not done' : 'Mark as done'}" data-action="toggle"></button>
      <div class="task-main">
        <div class="task-title"></div>
        <div class="task-meta">${formatDue(task.due)} · ${task.priority} priority</div>
      </div>
      <button class="task-delete" aria-label="Delete task" data-action="delete">✕</button>
    `;

    // Set title via textContent (not innerHTML) to avoid injecting
    // unescaped user input into the page.
    li.querySelector('.task-title').textContent = task.title;

    return li;
  }

  function render() {
    const visible = getVisibleTasks();

    list.innerHTML = '';
    if (visible.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      const fragment = document.createDocumentFragment();
      visible.forEach(task => fragment.appendChild(buildTaskElement(task)));
      list.appendChild(fragment);
    }

    const remaining = tasks.filter(t => !t.done).length;
    countEl.textContent = `${remaining} of ${tasks.length} task${tasks.length === 1 ? '' : 's'} remaining`;
  }

  // ---- Events ----

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();

    if (!title) {
      titleInput.classList.add('invalid');
      titleInput.focus();
      return;
    }
    titleInput.classList.remove('invalid');

    addTask(title, dueInput.value, priorityInput.value);
    form.reset();
    priorityInput.value = 'medium';
    titleInput.focus();
    render();
  });

  // Event delegation for check / delete buttons inside the list
  list.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const li = button.closest('.task-item');
    const id = Number(li.dataset.id);

    if (button.dataset.action === 'toggle') {
      toggleTask(id);
      render();
    } else if (button.dataset.action === 'delete') {
      li.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      li.style.opacity = '0';
      li.style.transform = 'translateX(12px)';
      setTimeout(() => { deleteTask(id); render(); }, 180);
    }
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // ---- Init ----
  render();

})();