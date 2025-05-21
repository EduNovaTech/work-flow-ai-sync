
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-12 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1">
            <h3 className="text-xl font-bold text-brand-600 mb-4">WorkWise</h3>
            <p className="text-gray-600 mb-4">AI-powered assistant for remote teams. Simplify your workflow and boost productivity.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-brand-600">Features</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-brand-600">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Integrations</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Documentation</a></li>
              <li><a href="#faq" className="text-gray-600 hover:text-brand-600">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-600">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {new Date().getFullYear()} WorkWise Inc. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-brand-600 mr-4">Terms</a>
            <a href="#" className="text-gray-500 hover:text-brand-600 mr-4">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-brand-600">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
