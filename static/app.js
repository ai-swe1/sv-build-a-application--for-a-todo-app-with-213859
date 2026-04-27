// Simple client for the Todo API
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('todo-app');
  container.innerHTML = '<p>Loading...</p>';

  fetch('/api/todos')
    .then(res => res.json())
    .then(todos => {
      if (todos.length === 0) {
        container.innerHTML = '<p>No todos yet.</p>';
        return;
      }
      const list = document.createElement('ul');
      todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.title || JSON.stringify(todo);
        list.appendChild(li);
      });
      container.innerHTML = '';
      container.appendChild(list);
    })
    .catch(err => {
      container.innerHTML = `<p>Error loading todos: ${err}</p>`;
    });
});