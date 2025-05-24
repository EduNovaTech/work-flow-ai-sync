
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
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// AI summarization function (mock for now, would integrate with OpenAI API in production)
async function generateMeetingSummary(transcript) {
  // This would be replaced with an actual API call to OpenAI or other AI service
  console.log("Generating summary for transcript:", transcript.substring(0, 50) + "...");
  
  // Mock AI summary generation
  const summary = `Summary of meeting discussing ${transcript.substring(0, 20)}...`;
  
  // Mock task extraction
  const tasks = [
    {
      title: `Review ${transcript.substring(0, 10)}`,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]  // Tomorrow
    },
    {
      title: `Follow up on ${transcript.substring(20, 30)}`,
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0]  // Day after tomorrow
    }
  ];
  
  return { summary, tasks };
}

// API Routes

// Get all meetings
app.get('/api/meetings', async (req, res) => {
  try {
    const meetings = await db.collection('meetings').find().sort({ date: -1 }).toArray();
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single meeting
app.get('/api/meetings/:id', async (req, res) => {
  try {
    const meeting = await db.collection('meetings').findOne({ _id: new ObjectId(req.params.id) });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new meeting with AI summary
app.post('/api/meetings', async (req, res) => {
  try {
    const { title, transcript, date } = req.body;
    
    // Generate AI summary and extract tasks
    const { summary, tasks } = await generateMeetingSummary(transcript || '');
    
    // Create new meeting
    const newMeeting = {
      title,
      date: date || new Date().toISOString(),
      summary,
      transcript: transcript || '',
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await db.collection('tasks').find().sort({ dueDate: 1 }).toArray();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, dueDate, meetingId } = req.body;
    
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task (toggle completion, etc)
app.patch('/api/tasks/:id', async (req, res) => {
  try {
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Smart Reminders Setup - Mock endpoint for setting up email/Slack reminders
app.post('/api/reminders', async (req, res) => {
  try {
    const { taskId, type, destination } = req.body;
    
    // In production, this would connect to email service or Slack API
    // For now, we just save the reminder preferences
    
    await db.collection('reminders').insertOne({
      taskId,
      type, // 'email' or 'slack'
      destination, // email address or slack channel
      createdAt: new Date()
    });
    
    res.status(201).json({ message: 'Reminder setup successfully' });
  } catch (error) {
    console.error('Error setting up reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
