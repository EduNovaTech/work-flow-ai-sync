
import React from 'react';
import { Calendar, FileText, Clock, Layout } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: "AI Meeting Summaries",
    description: "Upload or record meetings and get smart, concise summaries powered by GPT-4",
    icon: <FileText className="h-8 w-8 text-brand-600" />,
  },
  {
    title: "Task Extraction",
    description: "AI automatically identifies and extracts tasks and due dates from meetings and notes",
    icon: <Calendar className="h-8 w-8 text-brand-600" />,
  },
  {
    title: "Smart Reminders",
    description: "Get timely reminders for upcoming tasks via email or Slack integration",
    icon: <Clock className="h-8 w-8 text-brand-600" />,
  },
  {
    title: "Team Dashboard",
    description: "View all your tasks, files, and meeting summaries in one organized workspace",
    icon: <Layout className="h-8 w-8 text-brand-600" />,
  },
];

const FeatureSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            All the tools your remote team needs, <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-xl text-gray-600">
            Save hours each week with AI-powered automation for your distributed team
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card border border-gray-100 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-2">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
