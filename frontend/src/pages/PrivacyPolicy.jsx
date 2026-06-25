import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto text-slate-700 dark:text-slate-300">
      <h1 className="text-4xl font-black font-heading text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100">1. Information Collection</h2>
        <p className="mb-4">ConvertPro does not permanently store your files. All files processed on our platform are automatically deleted from our servers within 1 hour of processing to ensure your complete privacy and data security.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100">2. Analytics</h2>
        <p className="mb-4">We use basic analytics to understand how users interact with our website to improve our services. This does not involve tracking your personal files or sensitive information.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100">3. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
