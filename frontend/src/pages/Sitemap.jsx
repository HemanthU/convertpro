import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto text-slate-700 dark:text-slate-300">
      <h1 className="text-4xl font-black font-heading text-slate-900 dark:text-white mb-8">Sitemap</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Main Pages</h2>
          <ul className="space-y-3">
            <li><Link to="/" className="text-accent hover:underline">Home</Link></li>
            <li><Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-accent hover:underline">Terms of Service</Link></li>
            <li><Link to="/sitemap" className="text-accent hover:underline">Sitemap</Link></li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Image Tools</h2>
          <ul className="space-y-3">
            <li><Link to="/tool/compress" className="text-accent hover:underline">Compress Image</Link></li>
            <li><Link to="/tool/upscale" className="text-accent hover:underline">AI Upscaler</Link></li>
            <li><Link to="/tool/ocr" className="text-accent hover:underline">Image to Text (OCR)</Link></li>
            <li><Link to="/tool/crop" className="text-accent hover:underline">Crop Image</Link></li>
            <li><Link to="/tool/rotate" className="text-accent hover:underline">Rotate & Flip</Link></li>
            <li><Link to="/tool/image-to-base64" className="text-accent hover:underline">Image to Base64</Link></li>
            <li><Link to="/tool/to-svg" className="text-accent hover:underline">Raster to Vector (SVG)</Link></li>
            <li><Link to="/tool/convert" className="text-accent hover:underline">Format Converter</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
