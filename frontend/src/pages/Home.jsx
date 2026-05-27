import React from 'react';
import { ArrowRightLeft, FileImage, Type, Crop, Maximize, RotateCw, FileText, Lock, Image, Layers, Palette, Grid, Zap, Shield, FileOutput, PenTool } from 'lucide-react';
import ToolCard from '../components/ui/ToolCard';

const categories = [
  {
    title: 'Optimize Image',
    icon: <Zap className="w-6 h-6 mb-4 text-accent" />,
    tools: [
      { id: 'compress', title: 'Compress Image', description: 'Reduce file size while maintaining visual quality.', icon: Maximize, path: '/tool/compress' },
      { id: 'upscale', title: 'AI Upscaler', description: 'Enhance and upscale images without losing quality.', icon: Maximize, path: '/tool/upscale' },
      { id: 'ocr', title: 'Image to Text (OCR)', description: 'Extract and copy text instantly from screenshots.', icon: Type, path: '/tool/ocr' },
    ]
  },
  {
    title: 'Convert TO Image',
    icon: <Image className="w-6 h-6 mb-4 text-accent" />,
    tools: [
      { id: 'heic-to-jpg', title: 'HEIC to JPG', description: 'Convert Apple HEIC photos to standard JPG format.', icon: ArrowRightLeft, path: '/tool/heic-to-jpg' },
      { id: 'svg-to-png', title: 'SVG to PNG', description: 'Rasterize scalable vectors into standard images.', icon: ArrowRightLeft, path: '/tool/svg-to-png' },
      { id: 'favicon', title: 'Favicon Generator', description: 'Generate web-ready favicons (ico, png, zip).', icon: Image, path: '/tool/favicon' },
    ]
  },
  {
    title: 'Format Conversion',
    icon: <FileOutput className="w-6 h-6 mb-4 text-accent" />,
    tools: [
      { id: 'to-jpg', title: 'Convert to JPG', description: 'Convert any image format to standard JPG.', icon: ArrowRightLeft, path: '/tool/convert?to=jpg' },
      { id: 'to-png', title: 'Convert to PNG', description: 'Convert any image format to transparent PNG.', icon: ArrowRightLeft, path: '/tool/convert?to=png' },
      { id: 'to-webp', title: 'Convert to WEBP', description: 'Convert any image format to modern WEBP.', icon: ArrowRightLeft, path: '/tool/convert?to=webp' },
      { id: 'to-gif', title: 'Convert to GIF', description: 'Convert any image format to static GIF.', icon: ArrowRightLeft, path: '/tool/convert?to=gif' },
      { id: 'to-tiff', title: 'Convert to TIFF', description: 'Convert any image format to high-quality TIFF.', icon: ArrowRightLeft, path: '/tool/convert?to=tiff' },
      { id: 'convert-custom', title: 'Custom Converter', description: 'Choose from 10+ formats to convert into.', icon: ArrowRightLeft, path: '/tool/convert' },
      { id: 'image-to-base64', title: 'Image to Base64', description: 'Convert images to raw Base64 data strings.', icon: ArrowRightLeft, path: '/tool/image-to-base64' },
      { id: 'image-to-pdf', title: 'Image to PDF', description: 'Convert images into a single PDF document.', icon: FileText, path: '/tool/image-to-pdf' },
      { id: 'to-svg', title: 'Raster to Vector', description: 'Trace pixel images into Vector Graphics (SVG).', icon: FileImage, path: '/tool/to-svg' },
    ]
  },
  {
    title: 'Edit Image',
    icon: <PenTool className="w-6 h-6 mb-4 text-accent" />,
    tools: [
      { id: 'crop', title: 'Crop Image', description: 'Crop images to exact pixels or specific ratios.', icon: Crop, path: '/tool/crop' },
      { id: 'rotate', title: 'Rotate & Flip', description: 'Rotate images or flip them horizontally/vertically.', icon: RotateCw, path: '/tool/rotate' },
      { id: 'watermark', title: 'Add Watermark', description: 'Stamp a custom text watermark onto your images.', icon: PenTool, path: '/tool/watermark' },
      { id: 'meme', title: 'Meme Generator', description: 'Add Top and Bottom text to your images.', icon: Type, path: '/tool/meme' },
      { id: 'filters', title: 'Image Filters', description: 'Apply grayscale, blur, and brightness adjustments.', icon: Palette, path: '/tool/filters' },
      { id: 'make-gif', title: 'GIF Maker', description: 'Stitch multiple images into a looping GIF.', icon: Layers, path: '/tool/make-gif' },
    ]
  },
  {
    title: 'Organize Image',
    icon: <Grid className="w-6 h-6 mb-4 text-accent" />,
    tools: [
      { id: 'grid-splitter', title: 'Grid Splitter', description: 'Slice an image into a 3x3 grid for Instagram.', icon: Grid, path: '/tool/grid-splitter' },
      { id: 'extract-colors', title: 'Color Palette', description: 'Extract the dominant hex colors from any photo.', icon: Palette, path: '/tool/extract-colors' },
      { id: 'social-packager', title: 'Social Packager', description: 'Auto-crop for Instagram, Twitter, and YouTube.', icon: Layers, path: '/tool/social-packager' },
    ]
  },
  {
    title: 'Image Security',
    icon: <Shield className="w-6 h-6 mb-4 text-accent" />,
    tools: [
      { id: 'exif', title: 'EXIF Viewer & Stripper', description: 'View hidden metadata and strip it for privacy.', icon: Shield, path: '/tool/exif' },
      { id: 'stego-encode', title: 'Hide Secret Message', description: 'Invisibly encode a secret text into an image.', icon: Lock, path: '/tool/stego-encode' },
      { id: 'stego-decode', title: 'Reveal Secret', description: 'Decrypt and reveal hidden steganography text.', icon: Lock, path: '/tool/stego-decode' },
    ]
  }
];

const Home = () => {
  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-slate-900 dark:text-white mb-6">
          Every tool you could need to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark">
            master your images
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
          100% Free online image tools. Organize, convert, optimize, and secure your images with professional-grade AI and editing tools.
        </p>
      </section>

      {/* Categorized Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 space-y-16">
        {categories.map((category, index) => (
          <div key={index} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center space-x-3 mb-6">
              {category.icon}
              <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                {category.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map((tool) => (
                <ToolCard 
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  to={tool.path}
                />
              ))}
            </div>
            {index !== categories.length - 1 && <div className="h-px bg-slate-200 dark:bg-slate-800 w-full mt-16"></div>}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
