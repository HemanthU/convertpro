import React, { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto text-slate-700 dark:text-slate-300">
      <h1 className="text-4xl font-black font-heading text-slate-900 dark:text-white mb-8">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100">1. Acceptance of Terms</h2>
        <p className="mb-4">By accessing and using ConvertPro, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100">2. Usage Rules</h2>
        <p className="mb-4">You agree to use this service only for lawful purposes. You are strictly prohibited from uploading malicious files, explicit content, or attempting to breach our server infrastructure.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100">3. Limitation of Liability</h2>
        <p>ConvertPro is provided "as is" without any warranties. We are not responsible for any data loss or damages incurred from using our free tools.</p>
      </div>
    </div>
  );
};

export default TermsOfService;
