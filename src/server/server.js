
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase, client } from './mongodb.js';
import { ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
let db;

// Connect to MongoDB
connectToDatabase()
  .then((database) => {
    db = database;
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// AI summarization function (mock for now, would integrate with OpenAI API in production)
async function generateMeetingSummary(transcript) {
  console.log("Generating summary for transcript:", transcript.substring(0, 50) + "...");
  
  // Mock AI summary generation - extract key points
  const words = transcript.toLowerCase().split(' ');
  const keyTopics = words.filter(word => 
    word.includes('project') || 
    word.includes('deadline') || 
    word.includes('task') ||
    word.includes('meeting') ||
    word.includes('review')
  );
  
  const summary = `Meeting discussed ${keyTopics.slice(0, 3).join(', ')}. Key decisions and action items were identified for follow-up.`;
  
  // Mock task extraction based on common patterns
  const tasks = [];
  if (transcript.toLowerCase().includes('review') || transcript.toLowerCase().includes('check')) {
    tasks.push({
      title: `Review discussed items from meeting`,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    });
  }
  if (transcript.toLowerCase().includes('follow up') || transcript.toLowerCase().includes('contact')) {
    tasks.push({
      title: `Follow up on action items`,
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0]
    });
  }
  if (transcript.toLowerCase().includes('prepare') || transcript.toLowerCase().includes('draft')) {
    tasks.push({
      title: `Prepare materials for next meeting`,
      dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0]
    });
  }
  
  return { summary, tasks };
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get all meetings
app.get('/api/meetings', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    const meetings = await db.collection('meetings').find().sort({ date: -1 }).toArray();
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single meeting
app.get('/api/meetings/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    const meeting = await db.collection('meetings').findOne({ _id: new ObjectId(req.params.id) });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new meeting with AI summary
app.post('/api/meetings', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    
    const { title, transcript, date } = req.body;
    
    if (!title || !transcript) {
      return res.status(400).json({ message: 'Title and transcript are required' });
    }
    
    // Generate AI summary and extract tasks
    const { summary, tasks } = await generateMeetingSummary(transcript);
    
    // Create new meeting
    const newMeeting = {
      title,
      date: date || new Date().toISOString(),
      summary,
      transcript,
      createdAt: new Date()
    };
    
    // Insert meeting
    const result = await db.collection('meetings').insertOne(newMeeting);
    
    // Add extracted tasks with reference to meeting
    if (tasks && tasks.length > 0) {
      const tasksWithMeetingId = tasks.map(task => ({
        ...task,
        meetingId: result.insertedId.toString(),
        completed: false,
        createdAt: new Date()
      }));
      
      await db.collection('tasks').insertMany(tasksWithMeetingId);
    }
    
    // Return the created meeting
    const createdMeeting = await db.collection('meetings').findOne({ _id: result.insertedId });
    res.status(201).json(createdMeeting);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    const tasks = await db.collection('tasks').find().sort({ dueDate: 1 }).toArray();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    
    const { title, dueDate, meetingId } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const newTask = {
      title,
      dueDate,
      meetingId,
      completed: false,
      createdAt: new Date()
    };
    
    const result = await db.collection('tasks').insertOne(newTask);
    const createdTask = await db.collection('tasks').findOne({ _id: result.insertedId });
    
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a task (toggle completion, etc)
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    
    const { id } = req.params;
    const updates = req.body;
    
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(id) });
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Smart Reminders Setup
app.post('/api/reminders', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    
    const { taskId, type, destination } = req.body;
    
    if (!taskId || !type || !destination) {
      return res.status(400).json({ message: 'TaskId, type, and destination are required' });
    }
    
    await db.collection('reminders').insertOne({
      taskId,
      type,
      destination,
      createdAt: new Date()
    });
    
    res.status(201).json({ message: 'Reminder setup successfully' });
  } catch (error) {
    console.error('Error setting up reminder:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
