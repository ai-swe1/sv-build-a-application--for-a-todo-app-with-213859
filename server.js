import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

const DATA_FILE = path.join(__dirname, 'todos.json');

function readTodos() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// Get all todos
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// Create a new todo
app.post('/api/todos', (req, res) => {
  const title = req.body.title;
  if (!title) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }
  const todos = readTodos();
  const newTodo = { title, completed: false };
  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
});

// Get a todo by id
app.get('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  const todos = readTodos();
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    res.status(404).json({ message: 'Todo not found' });
    return;
  }
  res.json(todo);
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const completed = req.body.completed;
  const todos = readTodos();
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    res.status(404).json({ message: 'Todo not found' });
    return;
  }
  if (title) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  writeTodos(todos);
  res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  const todos = readTodos();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    res.status(404).json({ message: 'Todo not found' });
    return;
  }
  todos.splice(index, 1);
  writeTodos(todos);
  res.json({ message: 'Todo deleted' });
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
});