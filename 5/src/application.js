import uniqueId from 'lodash/uniqueId.js';

// BEGIN
const createList = (name) => ({ id: uniqueId('list_'), name });
const createTask = (name, listId) => ({ id: uniqueId('task_'), name, listId });

export default () => {
  const listForm = document.querySelector('[data-container="new-list-form"]');
  const taskForm = document.querySelector('[data-container="new-task-form"]');
  const listsContainer = document.querySelector('[data-container="lists"]');
  const tasksContainer = document.querySelector('[data-container="tasks"]');

  const generalList = createList('General');
  const state = {
    lists: { [generalList.id]: generalList },
    tasks: {},
    currentListId: generalList.id,
  };

  const slugify = (name) => name.toLowerCase();
  const getListByName = (name) => Object.values(state.lists).find((list) => list.name === name);

  const renderLists = () => {
    listsContainer.innerHTML = '<ul></ul>';
    const ul = listsContainer.querySelector('ul');
    Object.values(state.lists).forEach((list) => {
      const li = document.createElement('li');
      if (list.id === state.currentListId) {
        const bold = document.createElement('b');
        bold.textContent = list.name;
        li.appendChild(bold);
      } else {
        const link = document.createElement('a');
        link.href = `#${slugify(list.name)}`;
        link.textContent = list.name;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          state.currentListId = list.id;
          render();
        });
        li.appendChild(link);
      }
      ul.appendChild(li);
    });
  };

  const renderTasks = () => {
    const currentTasks = Object.values(state.tasks)
      .filter((task) => task.listId === state.currentListId);
    tasksContainer.innerHTML = '';
    if (currentTasks.length === 0) return;
    const ul = document.createElement('ul');
    currentTasks.forEach((task) => {
      const li = document.createElement('li');
      li.textContent = task.name;
      ul.appendChild(li);
    });
    tasksContainer.appendChild(ul);
  };

  const render = () => {
    renderLists();
    renderTasks();
  };

  listForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(listForm);
    const name = formData.get('name');
    if (getListByName(name)) {
      listForm.reset();
      return;
    }
    const list = createList(name);
    state.lists[list.id] = list;
    listForm.reset();
    render();
  });

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(taskForm);
    const name = formData.get('name');
    const task = createTask(name, state.currentListId);
    state.tasks[task.id] = task;
    taskForm.reset();
    render();
  });

  render();
};
// END
