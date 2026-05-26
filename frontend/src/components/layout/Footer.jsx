import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-darkCard border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-500 dark:text-slate-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} ConvertPro. All rights reserved.
          </div>
          <div className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
            Website by HEMU
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
