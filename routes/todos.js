const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new todo
router.post('/', async (req, res) => {
  try {
    if (!req.body.title || req.body.title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    const todo = new Todo({
      title: req.body.title
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (req.body.title !== undefined) {
      if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
        return res.status(400).json({ message: 'Title must be a non-empty string' });
      }
      todo.title = req.body.title.trim();
    }
    if (req.body.completed !== undefined) {
      if (typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed must be a boolean' });
      }
      todo.completed = req.body.completed;
    }
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    await todo.deleteOne();
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET suggest endpoint (smart feature)
router.get('/suggest', async (req, res) => {
  try {
    const incompleteTodos = await Todo.countDocuments({ completed: false });
    const tips = [
      'You are doing great! Keep going!',
      'Focus on one task at a time!',
      'Take a short break and come back stronger!',
      'You are almost there! Push through!',
      'Break big tasks into smaller ones!'
    ];
    const tip = tips[Math.min(incompleteTodos, tips.length - 1)];
    res.json({ incompleteTasks: incompleteTodos, tip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;