const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store for demonstration
let todos = [
  { id: 1, task: 'Learn Express.js', completed: false },
  { id: 2, task: 'Build a CRUD API', completed: true },
  { id: 3, task: 'Complete Week 3 Assignment', completed: false }
];

// ----------------------------------------------------
// 1. Array Bonus: GET /todos/active (filter !completed)
// NOTE: Placed BEFORE /todos/:id so "active" isn't matched as an ID
// ----------------------------------------------------
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  res.status(200).json(activeTodos);
});

// ----------------------------------------------------
// 2. GET /todos (Read all)
// ----------------------------------------------------
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// ----------------------------------------------------
// 3. GET /todos/:id (Single read)
// ----------------------------------------------------
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(item => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(200).json(todo);
});

// ----------------------------------------------------
// 4. POST /todos (Create with validation)
// Validation: Requires "task" field
// ----------------------------------------------------
app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validation check
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'Validation failed: "task" field is required.' });
  }

  const newTodo = {
    id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task: task.trim(),
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// ----------------------------------------------------
// 5. PUT /todos/:id (Update)
// ----------------------------------------------------
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(item => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { task, completed } = req.body;

  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = Boolean(completed);

  res.status(200).json(todo);
});

// ----------------------------------------------------
// 6. DELETE /todos/:id (Delete)
// ----------------------------------------------------
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(index, 1);
  res.status(200).json({ message: 'Todo deleted successfully', todo: deletedTodo[0] });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});