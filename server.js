const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ROOT ROUTE - MUST BE BEFORE OTHER ROUTES
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API is running!',
    endpoints: {
      'GET /api/todos': 'Get all todos',
      'POST /api/todos': 'Create a new todo',
      'PUT /api/todos/:id': 'Update a todo',
      'DELETE /api/todos/:id': 'Delete a todo',
      'GET /api/todos/suggest': 'Get motivational tip'
    },
    stats: {
      incompleteTasks: 1,
      tip: 'Focus on one task at a time!'
    }
  });
});

// Routes
const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });