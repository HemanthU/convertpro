import React from 'react';
import { ArrowRightLeft, FileImage, Type, Crop, Maximize, RotateCw, FileText } from 'lucide-react';
import ToolCard from '../components/ui/ToolCard';

const tools = [
  { id: 'jpg-to-png', title: 'JPG to PNG', description: 'Convert your JPG images to PNG with transparent background support.', icon: ArrowRightLeft, path: '/tool/convert?from=jpg&to=png' },
  { id: 'png-to-jpg', title: 'PNG to JPG', description: 'Convert PNG images to JPG format for smaller file sizes.', icon: ArrowRightLeft, path: '/tool/convert?from=png&to=jpg' },
  { id: 'webp-converter', title: 'WEBP Converter', description: 'Convert images to and from WEBP format for modern web usage.', icon: FileImage, path: '/tool/convert?to=webp' },
  { id: 'compress', title: 'Compress Image', description: 'Reduce file size while maintaining visual quality.', icon: Maximize, path: '/tool/compress' },
  { id: 'resize', title: 'Resize Image', description: 'Change dimensions of your images perfectly.', icon: Crop, path: '/tool/resize' },
  { id: 'crop', title: 'Crop Image', description: 'Crop images to exact pixels or specific aspect ratios.', icon: Crop, path: '/tool/crop' },
  { id: 'rotate', title: 'Rotate & Flip', description: 'Rotate images or flip them horizontally and vertically.', icon: RotateCw, path: '/tool/rotate' },
  { id: 'image-to-pdf', title: 'Image to PDF', description: 'Convert one or multiple images into a single PDF document.', icon: FileText, path: '/tool/image-to-pdf' },
  { id: 'exif', title: 'EXIF Viewer & Stripper', description: 'View hidden metadata in your photos and strip it for privacy.', icon: Maximize, path: '/tool/exif' },
  { id: 'upscale', title: 'AI Upscaler', description: 'Enhance and upscale images without losing quality using Lanczos3.', icon: Maximize, path: '/tool/upscale' },
  { id: 'to-svg', title: 'Raster to Vector', description: 'Trace pixel images (JPG/PNG) into scalable Vector Graphics (SVG).', icon: FileImage, path: '/tool/to-svg' },
  { id: 'favicon', title: 'Favicon Generator', description: 'Generate web-ready favicons (ico, png, apple-touch) in a ZIP.', icon: Crop, path: '/tool/favicon' },
  { id: 'ocr', title: 'Image to Text (OCR)', description: 'Extract and copy text instantly from screenshots or documents.', icon: Type, path: '/tool/ocr' },
  { id: 'make-gif', title: 'GIF Maker', description: 'Stitch multiple images into a looping, animated GIF.', icon: FileImage, path: '/tool/make-gif' },
];

const Home = () => {
  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-slate-900 dark:text-white mb-6">
          Every tool you could need to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark">
            edit your images
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
          100% Free online image tools. Convert, compress, resize, crop and edit your images with just a few clicks. No registration required.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard 
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              to={tool.path}
            />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
