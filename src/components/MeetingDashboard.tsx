
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMeetings, addMeeting, fetchTasks, addTask, toggleTaskCompletion } from '@/services/mongoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { Calendar, CheckSquare, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Task {
  _id?: string;
  title: string;
  dueDate?: string;
  completed?: boolean;
  meetingId?: string;
}

const MeetingDashboard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  
  const { data: meetings = [], isLoading: meetingsLoading, error: meetingsError, refetch: refetchMeetings } = useQuery({
    queryKey: ['meetings'],
    queryFn: fetchMeetings,
  });

  const { data: tasks = [], isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  React.useEffect(() => {
    if (meetingsError) {
      console.error("Error fetching meetings:", meetingsError);
      toast.error("Failed to load meetings");
    }
    
    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      toast.error("Failed to load tasks");
    }
  }, [meetingsError, tasksError]);

  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addMeeting({
        title,
        date: new Date().toISOString(),
        summary
      });
      setTitle('');
      setSummary('');
      refetchMeetings();
    } catch (error) {
      console.error("Error submitting meeting:", error);
    }
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      await addTask({
        title: taskTitle,
        dueDate: taskDueDate || undefined,
        meetingId: selectedMeetingId || undefined
      });
      setTaskTitle('');
      setTaskDueDate('');
      refetchTasks();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      await toggleTaskCompletion(id, !completed);
      refetchTasks();
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const filteredTasks = selectedMeetingId
    ? tasks.filter((task: Task) => task.meetingId === selectedMeetingId)
    : tasks;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Meeting Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Meeting</CardTitle>
              <CardDescription>Record a meeting summary and extract tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitMeeting} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Meeting Title</label>
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Weekly Team Sync"
                  />
                </div>
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium mb-1">Meeting Summary</label>
                  <Textarea 
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Discussed project progress, identified next steps..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">Save Meeting</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create tasks with deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div>
                  <label htmlFor="taskTitle" className="block text-sm font-medium mb-1">Task Title</label>
                  <Input 
                    id="taskTitle"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Complete project proposal"
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
                  <Input 
                    id="dueDate"
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="relatedMeeting" className="block text-sm font-medium mb-1">Related Meeting (Optional)</label>
                  <select 
                    id="relatedMeeting" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={selectedMeetingId || ''}
                    onChange={(e) => setSelectedMeetingId(e.target.value || null)}
                  >
                    <option value="">-- None --</option>
                    {meetings.map((meeting: any) => (
                      <option key={meeting._id} value={meeting._id}>
                        {meeting.title}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">Add Task</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="mr-2 h-5 w-5" />
                Tasks
              </CardTitle>
              <CardDescription>
                Track and manage your team's tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <p>Loading tasks...</p>
              ) : filteredTasks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Done</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task: any) => (
                      <TableRow key={task._id}>
                        <TableCell>
                          <Checkbox 
                            checked={task.completed} 
                            onCheckedChange={() => handleToggleTask(task._id, task.completed || false)}
                          />
                        </TableCell>
                        <TableCell className={task.completed ? "line-through text-gray-500" : ""}>
                          {task.title}
                        </TableCell>
                        <TableCell>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-4">No tasks found. Add your first task!</p>
              )}
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Meetings</h3>
            {meetingsLoading ? (
              <p>Loading meetings...</p>
            ) : meetings.length > 0 ? (
              <div className="space-y-4">
                {meetings.map((meeting: any) => (
                  <Card 
                    key={meeting._id} 
                    className={`${selectedMeetingId === meeting._id ? 'border-brand-500 ring-1 ring-brand-500' : ''} cursor-pointer`}
                    onClick={() => setSelectedMeetingId(meeting._id === selectedMeetingId ? null : meeting._id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        {meeting.title}
                      </CardTitle>
                      <CardDescription>
                        {new Date(meeting.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{meeting.summary}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <p className="text-xs text-gray-500">
                        {tasks.filter((task: Task) => task.meetingId === meeting._id).length} tasks
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMeetingId(meeting._id);
                          setTaskTitle('');
                          setTaskDueDate('');
                          document.getElementById('taskTitle')?.focus();
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Task
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No meetings found. Add your first meeting!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDashboard;
