
const express = require('express');
const cors = require('cors');
const { connectToDatabase, client } = require('./mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB when server starts
let db;
connectToDatabase()
  .then(database => {
    db = database;
    console.log("Database connection established");
  })
  .catch(err => {
    console.error("Failed to connect to database", err);
  });

// API endpoint to fetch meetings
app.get('/api/meetings', async (req, res) => {
  try {
    const meetings = await db.collection('meetings').find({}).toArray();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings", error: error.message });
  }
});

// API endpoint to add a meeting
app.post('/api/meetings', async (req, res) => {
  try {
    const { title, date, summary, tasks } = req.body;
    const result = await db.collection('meetings').insertOne({
      title,
      date,
      summary,
      tasks: tasks || [],
      createdAt: new Date()
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error adding meeting", error: error.message });
  }
});

// API endpoint to get tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await db.collection('tasks').find({}).toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// API endpoint to add a task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, dueDate, meetingId } = req.body;
    const result = await db.collection('tasks').insertOne({
      title,
      dueDate,
      completed: false,
      meetingId,
      createdAt: new Date()
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
});

// API endpoint to mark a task as complete
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const result = await db.collection('tasks').updateOne(
      { _id: new require('mongodb').ObjectId(id) },
      { $set: { completed } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
});

// Add cleanup for MongoDB connection when server shuts down
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
