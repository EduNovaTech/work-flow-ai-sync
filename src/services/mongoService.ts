
import { toast } from "sonner";

interface Meeting {
  _id?: string;
  title: string;
  date: string;
  summary: string;
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

export const addMeeting = async (meeting: Omit<Meeting, '_id' | 'createdAt'>): Promise<Meeting> => {
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
    
    toast.success("Meeting added successfully");
    return await response.json();
  } catch (error) {
    console.error("Error adding meeting:", error);
    toast.error("Failed to add meeting");
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
