import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-darkCard border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-accent transition-colors">Sitemap</Link>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} ConvertPro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
