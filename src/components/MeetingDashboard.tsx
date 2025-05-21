
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMeetings, addMeeting } from '@/services/mongoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const MeetingDashboard: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  
  const { data: meetings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['meetings'],
    queryFn: fetchMeetings,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load meetings. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
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
      refetch();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Meeting Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Meeting</CardTitle>
            <CardDescription>Record a meeting summary and extract tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Meetings</h3>
          {isLoading ? (
            <p>Loading meetings...</p>
          ) : meetings.length > 0 ? (
            meetings.map((meeting: any) => (
              <Card key={meeting._id}>
                <CardHeader>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription>
                    {new Date(meeting.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{meeting.summary}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500">
                    {meeting.tasks?.length || 0} tasks extracted
                  </p>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No meetings found. Add your first meeting!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDashboard;
