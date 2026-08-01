require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors('*'));

// Data Decision: Standardized Schema (id, task, completed, dueDate)
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false, dueDate: null },
  { id: 2, task: 'Build CRUD API', completed: false, dueDate: '2026-08-15' }
];

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// GET Completed – Custom Read
// (Note: Defined before /todos/:id so "completed" isn't captured as an ID)
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.status(200).json(completed);
});

// GET Single Todo
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.status(200).json(todo);
});

// POST New – Create (with validation & fallback defaults)
app.post('/todos', (req, res) => {
  const { task, dueDate } = req.body;

  // Validation Check
  if (!task) {
    return res.status(400).json({ error: 'Task content is required' });
  }

  // Data Decision: Explicit field assignment for safety
  const newTodo = {
    id: todos.length + 1,
    task: task,
    completed: false, // Default to false upon creation
    dueDate: dueDate || null // Optional date field
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  // Merge updates safely
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter((t) => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(204).send(); // Silent success
});

// ----------------------------------------------------
// Error Handling & Server Listen
// ----------------------------------------------------

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));