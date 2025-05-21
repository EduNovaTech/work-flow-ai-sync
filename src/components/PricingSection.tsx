
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const PricingSection: React.FC = () => {
  const { toast } = useToast();
  
  const handleSignup = (plan: string) => {
    toast({
      title: `${plan} plan selected`,
      description: "Thanks for your interest! We'll contact you when the beta is ready.",
    });
  };

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for individuals",
      features: [
        "1 user",
        "3 meetings/month",
        "Basic summaries",
        "Simple task extraction",
        "Email reminders",
      ],
      buttonText: "Get Started",
      highlighted: false
    },
    {
      name: "Starter",
      price: "9",
      description: "Great for small teams",
      features: [
        "Up to 3 users",
        "30 meetings/month",
        "Advanced AI summaries",
        "Full task management",
        "Slack integration",
        "Priority support",
      ],
      buttonText: "Join Waitlist",
      highlighted: true
    },
    {
      name: "Pro",
      price: "15",
      description: "For growing teams",
      features: [
        "Up to 10 users",
        "Unlimited meetings",
        "Premium AI features",
        "Advanced integrations",
        "API access",
        "Custom onboarding",
      ],
      buttonText: "Join Waitlist",
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Simple, <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="text-xl text-gray-600">
            Start free and upgrade as your team grows
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border ${
                plan.highlighted 
                  ? "border-brand-500 shadow-lg shadow-brand-100" 
                  : "border-gray-200"
              } relative`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-xs px-4 py-1 rounded-full font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/user/month</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.highlighted 
                      ? "bg-brand-600 hover:bg-brand-700" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => handleSignup(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
