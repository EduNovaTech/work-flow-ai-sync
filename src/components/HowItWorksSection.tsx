
import React from 'react';

const steps = [
  {
    number: "01",
    title: "Record or upload your meetings",
    description: "Connect with Zoom, Google Meet or simply upload audio files.",
  },
  {
    number: "02",
    title: "Get AI-generated summaries",
    description: "Our AI analyzes the content and creates concise, structured summaries.",
  },
  {
    number: "03",
    title: "Extract tasks automatically",
    description: "The AI identifies action items and adds them to your task list.",
  },
  {
    number: "04",
    title: "Receive smart reminders",
    description: "Get notified about upcoming deadlines via email or Slack.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            How <span className="gradient-text">WorkWise</span> works
          </h2>
          <p className="text-xl text-gray-600">
            A simple workflow that saves your team hours of busywork
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex mb-12 items-start">
              <div className="mr-6 bg-brand-600 text-white font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="border-l-2 border-dashed border-brand-200 h-8 ml-6 mt-4"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
