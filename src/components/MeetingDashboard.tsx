
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMeetings, addMeeting, fetchTasks, addTask, toggleTaskCompletion, setupReminder } from '@/services/mongoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { Calendar, CheckSquare, Plus, Mic, FileText, Bell, Mail, Slack } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Task {
  _id?: string;
  title: string;
  dueDate?: string;
  completed?: boolean;
  meetingId?: string;
}

interface Meeting {
  _id?: string;
  title: string;
  date: string;
  summary: string;
  transcript?: string;
}

const MeetingDashboard: React.FC = () => {
  // State for forms
  const [title, setTitle] = useState('');
  const [meetingTranscript, setMeetingTranscript] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  
  // State for reminder form
  const [reminderTask, setReminderTask] = useState<string | null>(null);
  const [reminderType, setReminderType] = useState<'email' | 'slack'>('email');
  const [reminderDestination, setReminderDestination] = useState('');
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  
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
    if (!title || !meetingTranscript) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addMeeting({
        title,
        transcript: meetingTranscript,
        date: new Date().toISOString()
      });
      setTitle('');
      setMeetingTranscript('');
      refetchMeetings();
      refetchTasks(); // Refetch tasks as AI might have created new ones
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
  
  const handleSetupReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTask || !reminderDestination) {
      toast.error("Please select a task and enter a destination");
      return;
    }
    
    try {
      await setupReminder({
        taskId: reminderTask,
        type: reminderType,
        destination: reminderDestination
      });
      setReminderTask(null);
      setReminderDestination('');
      // Close dialog would happen here
    } catch (error) {
      console.error("Error setting up reminder:", error);
    }
  };
  
  // Mock recording functionality
  const toggleRecording = () => {
    if (isRecording) {
      // In a real app, here we would stop recording and get the transcript
      setIsRecording(false);
      toast.success("Recording stopped. Transcript ready!");
      setMeetingTranscript("This is a mock transcript from the recording. In a real app, this would be the actual transcript.");
    } else {
      setIsRecording(true);
      toast.info("Recording started...");
    }
  };

  const filteredTasks = selectedMeetingId
    ? tasks.filter((task: Task) => task.meetingId === selectedMeetingId)
    : tasks;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Meeting Dashboard</h2>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="dashboard">Team Dashboard</TabsTrigger>
          <TabsTrigger value="meetings">AI Meeting Summaries</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Recent Meetings
                </CardTitle>
                <CardDescription>Latest summarized meetings</CardDescription>
              </CardHeader>
              <CardContent>
                {meetingsLoading ? (
                  <p>Loading meetings...</p>
                ) : meetings.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {meetings.slice(0, 3).map((meeting: Meeting) => (
                      <Card key={meeting._id} className="cursor-pointer hover:bg-muted/50">
                        <CardHeader className="p-3">
                          <CardTitle className="text-base">{meeting.title}</CardTitle>
                          <CardDescription>{new Date(meeting.date).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <p className="text-sm">{meeting.summary}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No meetings found</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => document.getElementById('meeting-tab-trigger')?.click()}>
                  View All Meetings
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckSquare className="mr-2 h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Tasks that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <p>Loading tasks...</p>
                ) : tasks.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {tasks.filter((task: Task) => !task.completed).slice(0, 5).map((task: Task) => (
                      <div key={task._id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <Checkbox 
                            id={`task-${task._id}`} 
                            checked={task.completed} 
                            onCheckedChange={() => handleToggleTask(task._id!, task.completed || false)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`task-${task._id}`}
                            className="text-sm cursor-pointer"
                          >
                            {task.title}
                          </label>
                        </div>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No tasks found</p>
                )}
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Bell className="mr-2 h-4 w-4" />
                      Set Up Reminders
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Up Smart Reminders</DialogTitle>
                      <DialogDescription>
                        Get notified about upcoming tasks via email or Slack
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSetupReminder} className="space-y-4 pt-4">
                      <div>
                        <label htmlFor="task" className="block text-sm font-medium mb-1">Select Task</label>
                        <Select 
                          onValueChange={(value) => setReminderTask(value)}
                          value={reminderTask || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select task" />
                          </SelectTrigger>
                          <SelectContent>
                            {tasks.filter((task: Task) => !task.completed).map((task: Task) => (
                              <SelectItem key={task._id} value={task._id!}>
                                {task.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label htmlFor="reminder-type" className="block text-sm font-medium mb-1">Reminder Type</label>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant={reminderType === 'email' ? 'default' : 'outline'}
                            onClick={() => setReminderType('email')}
                            className="flex-1"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </Button>
                          <Button
                            type="button"
                            variant={reminderType === 'slack' ? 'default' : 'outline'}
                            onClick={() => setReminderType('slack')}
                            className="flex-1"
                          >
                            <Slack className="mr-2 h-4 w-4" />
                            Slack
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="destination" className="block text-sm font-medium mb-1">
                          {reminderType === 'email' ? 'Email Address' : 'Slack Channel'}
                        </label>
                        <Input
                          id="destination"
                          value={reminderDestination}
                          onChange={(e) => setReminderDestination(e.target.value)}
                          placeholder={reminderType === 'email' ? 'your@email.com' : '#general'}
                        />
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit" className="w-full">
                          Set Up Reminder
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="meetings" id="meeting-tab-content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Add Meeting for AI Summary
                </CardTitle>
                <CardDescription>Let AI generate summaries and extract tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitMeeting} className="space-y-4">
                  <div>
                    <label htmlFor="meeting-title" className="block text-sm font-medium mb-1">Meeting Title</label>
                    <Input 
                      id="meeting-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Weekly Team Sync"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="transcript" className="block text-sm font-medium mb-1">Meeting Transcript or Notes</label>
                    <div className="mb-2">
                      <Button
                        type="button"
                        onClick={toggleRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        className="w-full"
                      >
                        {isRecording ? (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Record Meeting
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea 
                      id="transcript"
                      value={meetingTranscript}
                      onChange={(e) => setMeetingTranscript(e.target.value)}
                      placeholder="Paste meeting transcript or notes here..."
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      AI will analyze this text to create a summary and extract action items.
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Process with AI
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Meeting Summaries
                </CardTitle>
                <CardDescription>AI-generated meeting summaries</CardDescription>
              </CardHeader>
              <CardContent>
                {meetingsLoading ? (
                  <p>Loading meetings...</p>
                ) : meetings.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {meetings.map((meeting: Meeting) => (
                      <Card 
                        key={meeting._id} 
                        className={`${selectedMeetingId === meeting._id ? 'border-brand-500 ring-1 ring-brand-500' : ''} cursor-pointer`}
                        onClick={() => setSelectedMeetingId(meeting._id === selectedMeetingId ? null : meeting._id)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{meeting.title}</CardTitle>
                          <CardDescription>{new Date(meeting.date).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm">{meeting.summary}</p>
                          
                          {meeting._id === selectedMeetingId && (
                            <>
                              <Separator className="my-2" />
                              <h4 className="font-medium text-sm mb-1">Extracted Tasks:</h4>
                              <ul className="space-y-1">
                                {tasks
                                  .filter((task: Task) => task.meetingId === meeting._id)
                                  .map((task: Task) => (
                                    <li key={task._id} className="flex items-center text-sm">
                                      <Checkbox 
                                        checked={task.completed}
                                        onCheckedChange={() => handleToggleTask(task._id!, task.completed || false)}
                                        className="mr-2"
                                      />
                                      <span className={task.completed ? "line-through text-gray-500" : ""}>
                                        {task.title}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                              {tasks.filter((task: Task) => task.meetingId === meeting._id).length === 0 && (
                                <p className="text-xs text-muted-foreground">No tasks found for this meeting</p>
                              )}
                            </>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMeetingId(meeting._id);
                              document.getElementById('tasks-tab-trigger')?.click();
                            }}
                          >
                            <CheckSquare className="h-3 w-3 mr-1" /> Manage Tasks
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No meeting summaries yet. Add a meeting to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" id="tasks-tab-content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Task
                </CardTitle>
                <CardDescription>Create tasks manually</CardDescription>
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
                    <Select 
                      value={selectedMeetingId || ""} 
                      onValueChange={(value) => setSelectedMeetingId(value || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="-- None --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-- None --</SelectItem>
                        {meetings.map((meeting: any) => (
                          <SelectItem key={meeting._id} value={meeting._id}>
                            {meeting.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Add Task</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckSquare className="mr-2 h-5 w-5" />
                  Tasks
                </CardTitle>
                <CardDescription>
                  {selectedMeetingId ? `Tasks from selected meeting` : `All tasks`}
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
                  <p className="text-center text-gray-500 py-8">
                    {selectedMeetingId 
                      ? "No tasks for the selected meeting. Add your first task!" 
                      : "No tasks found. Add your first task!"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeetingDashboard;
