"use client";

import React from 'react';
import { Upload, FileText, Sparkles, Trash2 } from 'lucide-react';

type UploadFormProps = {
  uploadMethod: string;
  isProcessing: boolean;
  isDarkMode: boolean;
  theme: any;
  onUploadMethodChange: (method: string) => void;
  onSummarize: () => void;
  file: File | null;
  text: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function UploadForm({
  uploadMethod,
  isProcessing,
  isDarkMode,
  theme,
  onUploadMethodChange,
  onSummarize,
  file,
  text,
  onFileChange,
  onTextChange,
}: UploadFormProps) {
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  // Simulate file upload progress
  React.useEffect(() => {
    if (file && !isUploading) {
      setIsUploading(true);
      setUploadProgress(0);
      
      const duration = 2500;
      const steps = 50;
      const increment = 100 / steps;
      const interval = duration / steps;
      
      let currentProgress = 0;
      const timer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          setUploadProgress(100);
          clearInterval(timer);
          setTimeout(() => setIsUploading(false), 200);
        } else {
          setUploadProgress(currentProgress);
        }
      }, interval);
      
      return () => clearInterval(timer);
    } else if (!file) {
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [file]);

  return (
    <>
      <style jsx>{`
        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.text} mb-2`}>
            Transform Research Papers into{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #22D3EE, #8B5CF6, #6366F1)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradient-flow 8s linear infinite',
              }}
            >
              Clear Insights
            </span>
          </h2>
          <p className={`${theme.textSecondary} text-sm sm:text-base md:text-lg px-2`}>
            Upload a PDF or paste text to get AI-powered summaries in seconds
          </p>
        </div>

        {/* Upload Method Tabs */}
        <div className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-xl overflow-hidden relative transition-all duration-500`}>
          <div className={`flex border-b ${theme.cardBorder}`}>
            <button
              onClick={() => onUploadMethodChange('file')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 font-medium transition-all text-sm sm:text-base cursor-pointer ${
                uploadMethod === 'file'
                  ? 'bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                  : `${theme.tabInactive} ${theme.tabInactiveBg}`
              }`}
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Upload PDF/DOCX</span>
              <span className="xs:hidden">Upload</span>
            </button>
            <button
              onClick={() => onUploadMethodChange('text')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 font-medium transition-all text-sm sm:text-base cursor-pointer ${
                uploadMethod === 'text'
                  ? 'bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                  : `${theme.tabInactive} ${theme.tabInactiveBg}`
              }`}
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Paste Text</span>
              <span className="xs:hidden">Paste</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {uploadMethod === 'file' ? (
              <div>
                <label
                  className={`border-2 border-dashed ${theme.uploadBorder} rounded-xl p-6 sm:p-8 md:p-12 text-center ${!file ? `${theme.uploadHoverBorder} ${theme.uploadHoverBg} cursor-pointer` : ''} transition-all flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] md:min-h-80`}
                  htmlFor="file-upload-input"
                >
                  {!file ? (
                    <>
                      <Upload className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto ${theme.textMuted} mb-3 sm:mb-4`} />
                      <p className={`text-sm sm:text-base md:text-lg font-medium ${theme.text} mb-2`}>
                        Drop your research paper here
                      </p>
                      <p className={`text-xs sm:text-sm ${theme.textTertiary} mb-2 sm:mb-3`}>
                        or click to browse files
                      </p>
                      <p className={`text-xs ${theme.textMuted}`}>
                        Supports PDF and DOCX (Max 25MB)
                      </p>
                    </>
                  ) : (
                    <div onClick={(e) => e.preventDefault()}>
                      <div className="relative inline-block mb-4">
                        {uploadProgress === 100 && !isUploading ? (
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-20 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                            <div className="text-center">
                              <FileText className={`w-8 h-8 ${theme.textMuted} mx-auto mb-1`} />
                              <div className="text-[10px] font-bold text-white/60 uppercase">
                                {file.type.includes('pdf') ? 'PDF' : 'DOCX'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className={`text-sm sm:text-base font-semibold ${theme.text} mb-2 sm:mb-3`}>
                        {isUploading ? 'Uploading Document...' : 'Upload Complete'}
                      </p>
                      
                      <p className={`text-xs sm:text-sm ${theme.textMuted} truncate max-w-[300px] mx-auto`}>
                        {file.name}
                      </p>

                      {uploadProgress === 100 && !isUploading && (
                        <p className={`text-xs ${theme.textMuted} mb-4`}>
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      )}

                      {isUploading && (
                        <div className="mb-3 mt-4">
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div 
                              className="h-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-100 ease-linear" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className={`text-xs ${theme.textMuted}`}>
                            {Math.round(uploadProgress)}%
                          </p>
                        </div>
                      )}

                      {uploadProgress === 100 && !isUploading && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const input = document.getElementById('file-upload-input') as HTMLInputElement;
                            if (input) input.value = '';
                            onFileChange({ target: { files: null } } as any);
                          }}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${theme.textSecondary} hover:text-red-500 text-xs font-medium cursor-pointer`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear Upload
                        </button>
                      )}
                    </div>
                  )}
                  <input
                    id="file-upload-input"
                    type="file"
                    accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={onFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <textarea
                    placeholder="Paste your research paper text here..."
                    className={`w-full min-h-[230px] sm:min-h-[270px] md:min-h-[290px] p-3 sm:p-4 ${text ? 'pb-12' : ''} ${theme.inputBg} border ${theme.inputBorder} rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none text-sm sm:text-base ${theme.inputText} ${theme.inputPlaceholder}`}
                    value={text}
                    onChange={onTextChange}
                  />
                  {text && (
                    <button
                      onClick={() => onTextChange({ target: { value: '' } } as any)}
                      className={`absolute bottom-4 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.cardBg} backdrop-blur-sm border ${theme.cardBorder} rounded-lg transition-all ${theme.textSecondary} hover:text-red-500 cursor-pointer shadow-lg z-10 text-xs font-medium`}
                      title="Clear text"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  )}
                </div>
                <p className={`text-xs ${theme.textMuted} mt-2`}>
                  Paste the full paper here
                </p>
              </div>
            )}

            <button
              onClick={onSummarize}
              disabled={isProcessing || isUploading || (uploadMethod === 'file' && !file) || (uploadMethod === 'text' && !text.trim())}
              className="w-full mt-4 sm:mt-5 py-3 md:py-4 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full font-semibold text-sm sm:text-base md:text-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Summarize Paper
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
