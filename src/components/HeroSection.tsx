
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const HeroSection: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Success!",
        description: "Thanks for signing up! We'll be in touch soon.",
      });
      setEmail('');
    } else {
      toast({
        title: "Please enter your email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative bg-white pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-0"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Your AI-Powered <span className="gradient-text">Remote Work Assistant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Stop juggling multiple tools. Let AI handle your meetings, tasks, and reminders in one seamless workspace.
          </p>
          <form onSubmit={handleSignup} className="flex max-w-md mx-auto gap-x-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow"
            />
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
              Join waitlist
            </Button>
          </form>
          <p className="text-sm text-gray-500 mt-3">Join 500+ teams already signed up</p>
          
          <div className="mt-16 relative">
            <div className="rounded-xl shadow-2xl shadow-brand-100/50 border border-gray-200 overflow-hidden animate-fade-in">
              <img 
                src="https://placehold.co/1200x800/f0f7ff/0472d1?text=WorkWise+Dashboard+Preview" 
                alt="WorkWise Dashboard" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-brand-100 rounded-full blur-3xl opacity-30 z-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
