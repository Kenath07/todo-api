const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Add your production domain(s) here
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'], // Development origins
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// ROOT ROUTE - MUST BE BEFORE OTHER ROUTES
app.get('/', async (req, res) => {
  try {
    const Todo = require('./models/Todo');
    const incompleteTasks = await Todo.countDocuments({ completed: false });
    const totalTasks = await Todo.countDocuments();
    
    const tips = [
      'Focus on one task at a time!',
      'You are doing great! Keep going!',
      'Take a short break and come back stronger!',
      'You are almost there! Push through!',
      'Break big tasks into smaller ones!'
    ];
    const tip = tips[Math.min(incompleteTasks, tips.length - 1)];
    
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
        totalTasks,
        incompleteTasks,
        completedTasks: totalTasks - incompleteTasks,
        tip
      }
    });
  } catch (error) {
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
        totalTasks: 0,
        incompleteTasks: 0,
        completedTasks: 0,
        tip: 'Focus on one task at a time!'
      }
    });
  }
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

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI environment variable is required');
  process.exit(1);
}

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