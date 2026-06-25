import React, { useState } from 'react';
import { Music, Upload, Download, RefreshCw, AlertCircle } from 'lucide-react';
import lamejs from 'lamejs';

const AudioConverter = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith('audio/')) {
      setFile(selected);
      setError(null);
      setDownloadUrl(null);
      setProgress(0);
    } else {
      setError('Please select a valid audio file (WAV, OGG, M4A, etc).');
    }
  };

  const convertToMp3 = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setProgress(10);

    try {
      // 1. Read file into ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      // 2. Decode audio data using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setProgress(50);

      // 3. Extract channels
      const left = audioBuffer.getChannelData(0); // Float32Array
      // Convert to Int16Array for lamejs
      const leftInt16 = new Int16Array(left.length);
      for (let i = 0; i < left.length; i++) {
        let s = Math.max(-1, Math.min(1, left[i]));
        leftInt16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      setProgress(70);

      // 4. Encode to MP3 using lamejs
      const mp3encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128); // Mono, SampleRate, 128kbps
      const mp3Data = [];
      
      const sampleBlockSize = 1152;
      for (let i = 0; i < leftInt16.length; i += sampleBlockSize) {
        const sampleChunk = leftInt16.subarray(i, i + sampleBlockSize);
        const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(new Int8Array(mp3buf));
        }
      }
      
      const mp3buf = mp3encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(new Int8Array(mp3buf));
      }

      setProgress(90);

      // 5. Create Blob and Download URL
      const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
      const url = URL.createObjectURL(mp3Blob);
      setDownloadUrl(url);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError('An error occurred during audio conversion. The file may be unsupported.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen px-4 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-6">
          <Music className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-4xl font-black font-heading text-slate-900 dark:text-white mb-4">
          Free Audio to MP3 Converter
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Convert audio files (WAV, OGG, M4A) to MP3 completely free and securely in your browser.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-darkCard rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!downloadUrl ? (
            <>
              {!file ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Choose Audio File
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                      Drag & drop an audio file here or click to browse. Max size depends on your device memory.
                    </p>
                    <span className="btn-primary">Browse Files</span>
                  </label>
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 truncate max-w-sm mx-auto">
                    {file.name}
                  </h3>
                  <p className="text-slate-500 mb-6">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-medium text-slate-600">
                        <span>Converting in browser...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-purple-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 justify-center">
                      <button onClick={reset} className="btn-secondary">
                        Cancel
                      </button>
                      <button onClick={convertToMp3} className="btn-primary">
                        Convert to MP3
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-10 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Conversion Complete!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm mx-auto">
                Your audio has been successfully converted to MP3. This was processed entirely on your device for absolute privacy.
              </p>
              <div className="flex gap-4 justify-center">
                <button onClick={reset} className="btn-secondary">
                  Convert Another
                </button>
                <a
                  href={downloadUrl}
                  download={`converted_${file.name.split('.')[0]}.mp3`}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download MP3
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioConverter;
