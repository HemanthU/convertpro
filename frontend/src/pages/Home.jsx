import React from 'react';
import { ArrowRightLeft, FileImage, Type, Crop, Maximize, RotateCw, FileText, Lock, Image, Layers, Palette, Grid, Zap, Shield, FileOutput, PenTool } from 'lucide-react';
import ToolCard from '../components/ui/ToolCard';

const tools = [
  { id: 'compress', title: 'Compress Image', description: 'Reduce file size while maintaining visual quality.', icon: Maximize, path: '/tool/compress' },
  { id: 'upscale', title: 'AI Upscaler', description: 'Enhance and upscale images without losing quality.', icon: Maximize, path: '/tool/upscale' },
  { id: 'ocr', title: 'Image to Text (OCR)', description: 'Extract and copy text instantly from screenshots.', icon: Type, path: '/tool/ocr' },
  { id: 'svg-to-png', title: 'SVG to PNG', description: 'Rasterize scalable vectors into standard images.', icon: ArrowRightLeft, path: '/tool/convert?from=svg&to=png' },
  { id: 'to-jpg', title: 'Convert to JPG', description: 'Convert any image format to standard JPG.', icon: ArrowRightLeft, path: '/tool/convert?to=jpg' },
  { id: 'to-png', title: 'Convert to PNG', description: 'Convert any image format to transparent PNG.', icon: ArrowRightLeft, path: '/tool/convert?to=png' },
  { id: 'to-webp', title: 'Convert to WEBP', description: 'Convert any image format to modern WEBP.', icon: ArrowRightLeft, path: '/tool/convert?to=webp' },
  { id: 'to-gif', title: 'Convert to GIF', description: 'Convert any image format to static GIF.', icon: ArrowRightLeft, path: '/tool/convert?to=gif' },
  { id: 'to-tiff', title: 'Convert to TIFF', description: 'Convert any image format to high-quality TIFF.', icon: ArrowRightLeft, path: '/tool/convert?to=tiff' },
  { id: 'convert-custom', title: 'Custom Converter', description: 'Choose from 10+ formats to convert into.', icon: ArrowRightLeft, path: '/tool/convert' },
  { id: 'image-to-base64', title: 'Image to Base64', description: 'Convert images to raw Base64 data strings.', icon: ArrowRightLeft, path: '/tool/image-to-base64' },
  { id: 'image-to-pdf', title: 'Image to PDF', description: 'Convert images into a single PDF document.', icon: FileText, path: '/tool/image-to-pdf' },
  { id: 'to-svg', title: 'Raster to Vector', description: 'Trace pixel images into Vector Graphics (SVG).', icon: FileImage, path: '/tool/to-svg' },
  { id: 'crop', title: 'Crop Image', description: 'Crop images to exact pixels or specific ratios.', icon: Crop, path: '/tool/crop' },
  { id: 'rotate', title: 'Rotate & Flip', description: 'Rotate images or flip them horizontally/vertically.', icon: RotateCw, path: '/tool/rotate' },
];

const Home = () => {
  return (
    <div className="min-h-screen pb-16 bg-mesh relative overflow-hidden">
      {/* Decorative floating blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/5 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-20 px-4 text-center animate-float">

        <h1 className="text-5xl md:text-7xl font-black font-heading text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          Every tool you could need to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-500 to-purple-500">
            master your images
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 font-medium">
          100% Free online image tools.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationFillMode: 'both' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>
    </div>
  );
};

export default Home;
