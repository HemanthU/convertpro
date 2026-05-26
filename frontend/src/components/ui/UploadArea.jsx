import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle, Loader2 } from 'lucide-react';

const UploadArea = ({ onUpload, multiple = true, accept = "image/*", isProcessing = false, optionsUI = null }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    setFiles(multiple ? [...files, ...fileArray] : [fileArray[0]]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const submitUpload = () => {
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300
          ${dragActive ? 'border-accent bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-accent hover:bg-slate-50 dark:hover:bg-slate-800/50'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 text-accent rounded-full flex items-center justify-center mb-2">
            <UploadCloud size={40} />
          </div>
          <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
            Choose files or drag & drop here
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            JPG, PNG, WEBP, GIF up to 50MB
          </p>
          <button 
            type="button"
            onClick={() => inputRef.current.click()}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-accent to-accentDark text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
          >
            Select Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 bg-white dark:bg-darkCard rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 p-6">
          <h4 className="font-heading font-semibold mb-4 text-slate-900 dark:text-white flex items-center justify-between">
            <span>Selected Files ({files.length})</span>
            {isProcessing && <span className="text-accent flex items-center text-sm"><Loader2 className="animate-spin mr-2" size={16}/> Processing...</span>}
          </h4>
          <div className="space-y-3 mb-6">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="text-accent bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <FileIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isProcessing && (
                  <button onClick={() => removeFile(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {optionsUI && (
            <div className="mb-8">
              {optionsUI}
            </div>
          )}
          <button 
            type="button"
            onClick={submitUpload}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-accent to-accentDark text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center"
          >
            {isProcessing ? (
              <><Loader2 className="animate-spin mr-2" /> Processing Files...</>
            ) : (
              <><CheckCircle className="mr-2" /> Start Processing</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
