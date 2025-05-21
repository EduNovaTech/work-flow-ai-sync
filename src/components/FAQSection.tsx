
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "How does the AI meeting summary feature work?",
    answer: "Upload a meeting recording or connect your Zoom/Google Meet account. Our AI transcribes the audio and generates a concise, structured summary highlighting key points, decisions, and action items. The summary is stored in your dashboard for easy reference."
  },
  {
    question: "What integrations does WorkWise support?",
    answer: "Currently, we support integrations with Slack (for notifications and reminders), Google Meet, Zoom (for meeting recordings), and email services. We're actively working on expanding our integrations to include Notion, Trello, and other productivity tools."
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We take security and privacy seriously. All data is encrypted both in transit and at rest. We never share your data with third parties, and we only use it to provide the services you've requested. We're also working toward SOC 2 compliance."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to the service until the end of your current billing period. We don't lock you into long-term contracts."
  },
  {
    question: "How accurate are the AI-generated summaries?",
    answer: "Our AI uses state-of-the-art language models to provide highly accurate summaries. However, like all AI systems, it's not perfect. That's why we provide an easy way to review and edit summaries if needed. Our accuracy improves over time as our models learn."
  },
  {
    question: "Do you offer a trial period?",
    answer: "Yes! Our free tier allows you to try the basic functionality. For the Starter and Pro plans, we offer a 14-day free trial with no credit card required."
  }
];

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about WorkWise
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
