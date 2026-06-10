import axios from 'axios';

const routes = {
  tasksPath: () => '/api/tasks',
};

// BEGIN
const renderTasks = (tasks) => {
  const ul = document.getElementById('tasks');
  ul.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = task.name;
    ul.appendChild(li);
  });
};

export default async () => {
  const form = document.querySelector('form');
  let tasks = [];

  const response = await axios.get(routes.tasksPath());
  tasks = response.data.items;
  renderTasks(tasks);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    await axios.post(routes.tasksPath(), { name });
    tasks.unshift({ name });
    renderTasks(tasks);
    form.reset();
  });
};
// END
