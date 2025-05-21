
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const CTASection: React.FC = () => {
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
    <section className="py-20 bg-brand-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to transform how your remote team works?
          </h2>
          <p className="text-xl text-brand-100 mb-10">
            Join the waitlist to be the first to know when we launch and get exclusive early access.
          </p>
          <form onSubmit={handleSignup} className="flex max-w-md mx-auto gap-x-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow bg-white"
            />
            <Button type="submit" className="bg-white text-brand-600 hover:bg-brand-50">
              Join waitlist
            </Button>
          </form>
          <p className="text-sm text-brand-200 mt-4">No credit card required. Free plan available at launch.</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
