
import { toast } from "sonner";

interface Meeting {
  _id?: string;
  title: string;
  date: string;
  summary: string;
  transcript?: string;
  tasks?: Task[];
  createdAt?: Date;
}

interface Task {
  _id?: string;
  title: string;
  dueDate?: string;
  completed?: boolean;
  meetingId?: string;
}

interface Reminder {
  taskId: string;
  type: 'email' | 'slack';
  destination: string;
}

const API_URL = "http://localhost:5000/api";

export const fetchMeetings = async (): Promise<Meeting[]> => {
  try {
    const response = await fetch(`${API_URL}/meetings`);
    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching meetings:", error);
    toast.error("Failed to load meetings");
    return [];
  }
};

export const addMeeting = async (meeting: { title: string; transcript: string; date?: string }): Promise<Meeting> => {
  try {
    const response = await fetch(`${API_URL}/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meeting),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add meeting');
    }
    
    toast.success("Meeting processed successfully");
    return await response.json();
  } catch (error) {
    console.error("Error adding meeting:", error);
    toast.error("Failed to process meeting");
    throw error;
  }
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to load tasks");
    return [];
  }
};

export const addTask = async (task: Omit<Task, '_id' | 'createdAt'>): Promise<Task> => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add task');
    }
    
    toast.success("Task added successfully");
    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
    toast.error("Failed to add task");
    throw error;
  }
};

export const toggleTaskCompletion = async (id: string, completed: boolean): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    toast.success("Task updated successfully");
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
    throw error;
  }
};

export const setupReminder = async (reminder: Reminder): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminder),
    });
    
    if (!response.ok) {
      throw new Error('Failed to set up reminder');
    }
    
    toast.success(`${reminder.type === 'email' ? 'Email' : 'Slack'} reminder set up successfully`);
  } catch (error) {
    console.error("Error setting up reminder:", error);
    toast.error("Failed to set up reminder");
    throw error;
  }
};
