
import React from 'react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-brand-600">WorkWise</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium">
                Pricing
              </a>
              <a href="#faq" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium">
                FAQ
              </a>
            </div>
          </div>
          <div>
            <Button variant="ghost" className="mr-2">
              Log in
            </Button>
            <Button className="bg-brand-600 hover:bg-brand-700">
              Sign up for beta
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
