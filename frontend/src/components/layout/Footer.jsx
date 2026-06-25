import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-darkCard border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Popular Tools</h3>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
              <li><Link to="/tool/compress" className="hover:text-accent">Compress Image</Link></li>
              <li><Link to="#" className="hover:text-accent">PDF to Word</Link></li>
              <li><Link to="#" className="hover:text-accent">Merge PDF</Link></li>
              <li><Link to="/tool/image-to-pdf" className="hover:text-accent">Image to PDF</Link></li>
              <li><Link to="/audio-to-mp3" className="hover:text-accent">MP4 to MP3</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
              <li><Link to="#" className="hover:text-accent">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-accent">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-accent">Sitemap</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Security</h3>
            <div className="flex flex-col space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> SSL Secured</span>
              <span className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Files deleted after 24h</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ConvertPro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
