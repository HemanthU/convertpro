import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UploadArea from '../components/ui/UploadArea';
import { Download, AlertCircle, CheckCircle, UploadCloud, LayoutGrid } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ToolPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const toolPath = location.pathname.split('/tool/')[1];
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState('download');

  const [compressQuality, setCompressQuality] = useState(80);
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [cropTop, setCropTop] = useState(0);
  const [cropLeft, setCropLeft] = useState(0);
  const [cropWidth, setCropWidth] = useState(500);
  const [cropHeight, setCropHeight] = useState(500);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  const [upscaleFactor, setUpscaleFactor] = useState(2);
  const [gifDelay, setGifDelay] = useState(500);
  
  const [watermarkText, setWatermarkText] = useState('© ConvertPro');
  const [memeTop, setMemeTop] = useState('TOP TEXT');
  const [memeBottom, setMemeBottom] = useState('BOTTOM TEXT');
  const [filterType, setFilterType] = useState('grayscale');
  const [stegoMessage, setStegoMessage] = useState('Secret Message');
  const [customConvertFormat, setCustomConvertFormat] = useState('png');

  const [ocrText, setOcrText] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [extractedColors, setExtractedColors] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [stegoDecoded, setStegoDecoded] = useState(null);
  const getToolTitle = () => {
    switch (toolPath) {
      case 'convert': return `Convert ${searchParams.get('from')?.toUpperCase() || 'Image'} to ${searchParams.get('to')?.toUpperCase() || 'Format'}`;
      case 'compress': return 'Compress Image';
      case 'resize': return 'Resize Image';
      case 'crop': return 'Crop Image';
      case 'rotate': return 'Rotate & Flip';
      case 'image-to-pdf': return 'Image to PDF';
      case 'upscale': return 'AI Upscaler';
      case 'to-svg': return 'Raster to Vector (SVG)';
      case 'ocr': return 'Image to Text (OCR)';
      case 'image-to-base64': return 'Image to Base64';
      default: return 'Image Tool';
    }
  };

  const handleUpload = async (files) => {
    setIsProcessing(true);
    setError(null);
    setDownloadUrl(null);

    const formData = new FormData();
    const isMultiple = toolPath === 'image-to-pdf' || toolPath === 'convert';
    
    // The /api/convert endpoint ALWAYS expects the key 'images', regardless of whether it's a multiple or single upload tool in the UI.
    const hitsConvertApi = toolPath === 'convert' || toolPath.startsWith('to-');
    
    files.forEach(file => {
      formData.append(hitsConvertApi || isMultiple ? 'images' : 'image', file);
    });

    if (toolPath === 'convert') {
      formData.append('toFormat', searchParams.get('to') || 'png');
    } else if (toolPath === 'compress') {
      formData.append('quality', compressQuality);
    } else if (toolPath === 'resize') {
      if (resizeWidth) formData.append('width', resizeWidth);
      if (resizeHeight) formData.append('height', resizeHeight);
      formData.append('maintainAspectRatio', maintainAspectRatio);
    } else if (toolPath === 'crop') {
      formData.append('top', cropTop);
      formData.append('left', cropLeft);
      formData.append('width', cropWidth);
      formData.append('height', cropHeight);
    } else if (toolPath === 'rotate' || toolPath === 'rotate-flip') {
      formData.append('angle', rotateAngle);
      formData.append('flipH', flipH);
      formData.append('flipV', flipV);
    } else if (toolPath === 'upscale') {
      formData.append('factor', upscaleFactor);
    }
    
    try {
      let endpoint = '';
      const advancedTools = ['upscale', 'ocr', 'image-to-base64', 'to-svg'];
      
      if (toolPath === 'image-to-pdf') {
        endpoint = `${API_URL}/pdf/images-to-pdf`;
      } else if (toolPath.startsWith('to-') && toolPath !== 'to-svg') {
        endpoint = `${API_URL}/convert`;
        formData.append('toFormat', toolPath.split('-')[1]);
      } else if (advancedTools.includes(toolPath)) {
        endpoint = `${API_URL}/advanced/${toolPath}`;
      } else if (['resize', 'crop', 'rotate-flip'].includes(toolPath) || toolPath === 'rotate') {
        endpoint = `${API_URL}/edit/${toolPath === 'rotate' ? 'rotate-flip' : toolPath}`;
      } else {
        endpoint = `${API_URL}/${toolPath}`; // Custom converter hits /api/convert
      }

      // endpoints that return JSON data instead of a file blob
      const jsonEndpoints = ['ocr'];
      const isJson = jsonEndpoints.includes(toolPath);

      const response = await axios.post(endpoint, formData, {
        responseType: isJson ? 'json' : 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (isJson) {
        if (toolPath === 'ocr') setOcrText(response.data.text);
        
        setIsProcessing(false);
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      let ext = 'jpg';
      if (toolPath === 'image-to-pdf') ext = 'pdf';
      else if (files.length > 1) ext = 'zip'; // Only fall back to ZIP for convert/others if multiple
      else if (toolPath === 'convert') ext = searchParams.get('to') || customConvertFormat || 'png';
      else if (toolPath === 'to-jpg') ext = 'jpg';
      else if (toolPath === 'to-png') ext = 'png';
      else if (toolPath === 'to-svg') ext = 'svg';
      else if (toolPath === 'image-to-base64') ext = 'txt';
      else if (toolPath === 'to-webp') ext = 'webp';
      else if (toolPath === 'to-gif') ext = 'gif';
      else if (toolPath === 'to-tiff') ext = 'tiff';
      else if (toolPath === 'upscale') ext = 'png';

      setFilename(`ConvertPro_${toolPath}_${Date.now()}.${ext}`);
      setDownloadUrl(url);

      setTimeout(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `ConvertPro_${toolPath}_${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 100);

    } catch (err) {
      console.error(err);
      setError('An error occurred during processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderOptions = () => {
    if (toolPath === 'compress') {
      return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Compression Quality: {compressQuality}%</label>
          <input type="range" min="1" max="100" value={compressQuality} onChange={(e) => setCompressQuality(e.target.value)} className="w-full accent-accent" />
        </div>
      );
    }
    if (toolPath === 'convert' && !searchParams.get('to')) {
      return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Output Format</label>
          <select value={customConvertFormat} onChange={(e) => setCustomConvertFormat(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white">
            <option value="png">PNG</option>
            <option value="jpeg">JPG / JPEG</option>
            <option value="webp">WEBP</option>
            <option value="gif">GIF</option>
            <option value="tiff">TIFF</option>
            <option value="avif">AVIF</option>
          </select>
        </div>
      );
    }
    if (toolPath === 'resize') {
      return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Width (px)</label>
              <input type="number" placeholder="Auto" value={resizeWidth} onChange={(e) => setResizeWidth(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Height (px)</label>
              <input type="number" placeholder="Auto" value={resizeHeight} onChange={(e) => setResizeHeight(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white" />
            </div>
          </div>
          <label className="flex items-center text-sm text-slate-700 dark:text-slate-300 mt-2">
            <input type="checkbox" checked={maintainAspectRatio} onChange={(e) => setMaintainAspectRatio(e.target.checked)} className="mr-3 w-4 h-4 rounded text-accent" /> Maintain Aspect Ratio
          </label>
        </div>
      );
    }
    if (toolPath === 'crop') {
      return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Top (px)</label>
            <input type="number" value={cropTop} onChange={(e) => setCropTop(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Left (px)</label>
            <input type="number" value={cropLeft} onChange={(e) => setCropLeft(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Width (px)</label>
            <input type="number" value={cropWidth} onChange={(e) => setCropWidth(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Height (px)</label>
            <input type="number" value={cropHeight} onChange={(e) => setCropHeight(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white" />
          </div>
        </div>
      );
    }
    if (toolPath === 'rotate' || toolPath === 'rotate-flip') {
      return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rotate Angle</label>
            <select value={rotateAngle} onChange={(e) => setRotateAngle(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white">
              <option value="0">0° (No Rotation)</option>
              <option value="90">90° Clockwise</option>
              <option value="180">180°</option>
              <option value="270">270° Counter-Clockwise</option>
            </select>
          </div>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} className="mr-3 w-4 h-4 rounded text-accent" /> Flip Horizontal
            </label>
            <label className="flex items-center text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} className="mr-3 w-4 h-4 rounded text-accent" /> Flip Vertical
            </label>
          </div>
        </div>
      );
    }
    if (toolPath === 'upscale') {
      return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upscale Factor</label>
          <select value={upscaleFactor} onChange={(e) => setUpscaleFactor(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard text-slate-900 dark:text-white">
            <option value="2">2x (Double size)</option>
            <option value="4">4x (Quadruple size)</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const hasJsonResult = ocrText || base64Data;

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white mb-4">
          {getToolTitle()}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Upload your files below to start processing. All files are automatically deleted after 1 hour.
        </p>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="mr-3 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* JSON Results Handlers */}
      {ocrText && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-darkCard rounded-3xl p-10 md:p-16 text-left shadow-soft border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Extracted Text:</h2>
          <textarea readOnly className="w-full h-64 p-4 border rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700 mb-6" value={ocrText} />
          <button onClick={() => setOcrText(null)} className="px-6 py-3 bg-accent text-white rounded-xl">Process Another</button>
        </div>
      )}
      
      {base64Data && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-darkCard rounded-3xl p-10 md:p-16 text-left shadow-soft border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Base64 Output:</h2>
          <textarea readOnly className="w-full h-64 p-4 border rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700 mb-6 font-mono text-xs" value={base64Data} />
          <button onClick={() => setBase64Data(null)} className="px-6 py-3 bg-accent text-white rounded-xl">Process Another</button>
        </div>
      )}

      {!downloadUrl && !hasJsonResult ? (
        <UploadArea 
          onUpload={handleUpload} 
          multiple={toolPath === 'convert' || toolPath === 'image-to-pdf'}
          isProcessing={isProcessing}
          optionsUI={renderOptions()}
        />
      ) : downloadUrl && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-darkCard rounded-3xl p-10 md:p-16 text-center shadow-soft border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            Success! Your file is ready.
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Your file has been successfully processed and should start downloading automatically. If it didn't, click the download button below.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <a 
              href={downloadUrl} 
              download={filename}
              className="w-full md:w-auto px-10 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accentDark shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center text-lg"
            >
              <Download className="mr-2" size={24} /> Download File
            </a>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-10">
            <h3 className="text-xl font-heading font-semibold text-slate-800 dark:text-slate-200 mb-6">
              What do you want to do next?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button 
                onClick={() => setDownloadUrl(null)}
                className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center group"
              >
                <UploadCloud className="mr-2 text-accent group-hover:scale-110 transition-transform" size={20} /> Process More Files
              </button>
              <a 
                href="/"
                className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center group"
              >
                 <LayoutGrid className="mr-2 text-accent group-hover:scale-110 transition-transform" size={20} /> Explore All Tools
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPage;
