"use client";

import React from 'react';
import { Upload, FileText, Sparkles, Download, Copy, Trash2, File } from 'lucide-react';
import ChatSidebar from './ChatSidebar';

type UploadContentProps = {
  stage: string;
  uploadMethod: string;
  isProcessing: boolean;
  showChat: boolean;
  isDarkMode: boolean;
  theme: any;
  onUploadMethodChange: (method: string) => void;
  onSummarize: () => void;
  onShowChat: (show: boolean) => void;
  // Backend integration props
  file: File | null;
  text: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  summaryResult: Record<string, string> | null;
  error: string | null;
  // New for chat
  documentId?: string | number | null;
  userId?: string | null;
};

export default function UploadContent({
  stage,
  uploadMethod,
  isProcessing,
  showChat,
  isDarkMode,
  theme,
  onUploadMethodChange,
  onSummarize,
  onShowChat,
  file,
  text,
  onFileChange,
  onTextChange,
  summaryResult,
  error,
  documentId,
  userId,
}: UploadContentProps) {
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  // Simulate file upload progress
  React.useEffect(() => {
    if (file && !isUploading) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Animate progress from 0 to 100 over 2.5 seconds
      const duration = 2500; // 2.5 seconds
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
        @keyframes pulse-glow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.15);
          }
        }
      `}</style>
      <div className="h-full flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      {stage === 'upload' ? (
        /* UPLOAD STAGE */
        <div className="w-full max-w-3xl">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme.text} mb-2`}>
              Transform Research Papers into Clear Insights
            </h2>
            <p className={`${theme.textSecondary} text-sm sm:text-base md:text-lg px-2`}>
              Upload a PDF or paste text to get AI-powered summaries in seconds
            </p>
          </div>

          {/* Upload Method Tabs */}
          <div className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-xl border ${theme.cardBorder} overflow-hidden relative transition-all duration-500`}
            style={{
              boxShadow: isDarkMode 
                ? '0 0 30px 0px rgba(99, 102, 241, 0.5), 0 0 60px 0px rgba(139, 92, 246, 0.4), 0 0 90px 0px rgba(167, 139, 250, 0.3), 0 30px 60px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                : '0 0 30px 0px rgba(99, 102, 241, 0.35), 0 0 60px 0px rgba(139, 92, 246, 0.25), 0 0 90px 0px rgba(167, 139, 250, 0.15), 0 30px 60px -15px rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
              animation: 'pulse-glow 4s ease-in-out infinite'
            }}
          >
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
                    className={`border-2 border-dashed ${theme.uploadBorder} rounded-xl p-6 sm:p-8 md:p-12 text-center ${!file ? `${theme.uploadHoverBorder} ${theme.uploadHoverBg} cursor-pointer` : ''} transition-all block min-h-[280px] sm:min-h-[320px] md:min-h-[360px] flex flex-col items-center justify-center`}
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
                        {/* File Icon with type badge */}
                        <div className="relative inline-block mb-4">
                          {uploadProgress === 100 && !isUploading ? (
                            /* Checkmark replaces the entire file icon when complete */
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                              <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            /* File icon during upload */
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

                        {/* Upload Status Text */}
                        <p className={`text-sm font-semibold ${theme.text} mb-1`}>
                          {isUploading ? 'Uploading Document...' : 'Upload Complete'}
                        </p>
                        
                        {/* File Name */}
                        <p className={`text-xs ${theme.textMuted} mb-4 truncate max-w-[300px] mx-auto`}>
                          {file.name}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div 
                              className="h-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-100 ease-linear" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className={`text-xs ${theme.textMuted}`}>
                            {isUploading ? `${Math.round(uploadProgress)}%` : `${(file.size / 1024).toFixed(2)} KB`}
                          </p>
                        </div>

                        {/* Clear Upload Button */}
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
                  <textarea
                    placeholder="Paste your research paper text here..."
                    className={`w-full h-40 sm:h-48 md:h-56 p-3 sm:p-4 ${theme.inputBg} border ${theme.inputBorder} rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none text-sm sm:text-base ${theme.inputText} ${theme.inputPlaceholder}`}
                    value={text}
                    onChange={onTextChange}
                  />
                  <p className={`text-xs ${theme.textMuted} mt-2`}>
                    Paste the full paper here
                  </p>
                </div>
              )}

              <button
                onClick={onSummarize}
                disabled={isProcessing}
                className="w-full mt-4 sm:mt-5 py-3 md:py-4 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full font-semibold text-sm sm:text-base md:text-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Summarize Paper
                  </>
                )}
              </button>
              {error && (
                <div className="mt-3 text-sm text-red-600 text-center">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS STAGE */
        <div className="max-w-5xl mx-auto w-full">
          {/* Paper Info Card (optional, could extract title/authors from summaryResult in future) */}
          <div className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-xl shadow-lg border ${theme.cardBorder} p-4 sm:p-6 mb-4 sm:mb-6`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className={`text-base sm:text-lg md:text-xl font-bold ${theme.text} mb-2`}>
                  Paper Summary
                </h3>
                <p className={`text-xs sm:text-sm ${theme.textTertiary}`}>
                  Results generated by PARSe AI
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className={`p-1.5 sm:p-2 ${theme.hoverBg} rounded-lg transition-colors`} title="Download">
                  <Download className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.textSecondary}`} />
                </button>
                <button className={`p-1.5 sm:p-2 ${theme.hoverBg} rounded-lg transition-colors`} title="Copy">
                  <Copy className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.textSecondary}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Summaries from backend */}
          <div className="space-y-3 sm:space-y-4">
            {summaryResult && Object.keys(summaryResult).length > 0 ? (
              <>
                {/* Show main sections */}
                {['Abstract', 'Introduction', 'Methodology', 'Results', 'Conclusion'].map((section, idx) => {
                  if (!summaryResult[section]) return null;
                  // Define gradient colors for each card
                  const gradients = [
                    'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(78,70,197,0.8) 60%, rgba(45,42,120,1) 100%)', // Abstract - Indigo
                    'linear-gradient(160deg, rgba(34,211,238,0.8) 0%, rgba(24,170,190,0.8) 60%, rgba(8,120,130,1) 100%)', // Introduction - Cyan
                    'linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(105,70,200,0.8) 60%, rgba(70,42,160,1) 100%)', // Methodology - Purple
                    'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(78,70,197,0.8) 60%, rgba(45,42,120,1) 100%)',  // Results - Indigo
                    'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(78,70,197,0.8) 60%, rgba(45,42,120,1) 100%)'  // Conclusion - Indigo
                  ];
                  return (
                    <div 
                      key={section} 
                      className="rounded-xl shadow-lg p-4 sm:p-6 transition-transform duration-300 hover:-translate-y-1"
                      style={{ background: gradients[idx] }}
                    >
                      <h4 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 text-white rounded-lg flex items-center justify-center text-sm font-bold border border-white/30">
                          {idx + 1}
                        </span>
                        {section}
                      </h4>
                      <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                        {summaryResult[section]}
                      </p>
                    </div>
                  );
                })}
                  {/* Show Keywords after main sections */}
                  {summaryResult["Keywords"] && (
                    <div 
                      className="rounded-xl shadow-lg p-4 sm:p-6 transition-transform duration-300 hover:-translate-y-1"
                      style={{ background: 'linear-gradient(160deg, rgba(34,211,238,0.8) 0%, rgba(24,170,190,0.8) 60%, rgba(8,120,130,1) 100%)' }}
                    >
                      <h4 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 text-white rounded-lg flex items-center justify-center text-sm font-bold border border-white/30">
                          ★
                        </span>
                        Keywords
                      </h4>
                      <p className="text-white/90 leading-relaxed text-sm sm:text-base whitespace-pre-line">{summaryResult["Keywords"]}</p>
                    </div>
                  )}
                {/* Show any other sections returned by backend that aren't in main sections or Keywords */}
                {Object.keys(summaryResult)
                  .filter((section) => !['Abstract', 'Introduction', 'Methodology', 'Results', 'Conclusion', 'Keywords'].includes(section))
                  .map((section) => (
                    <div key={section} className="rounded-xl shadow-lg p-4 sm:p-6 transition-transform duration-300 hover:-translate-y-1 bg-white/10">
                      <h4 className="text-base sm:text-lg font-bold text-blue-700 mb-2">{section}</h4>
                      <p className="text-white/90 leading-relaxed text-sm sm:text-base">{summaryResult[section]}</p>
                    </div>
                  ))}
              </>
            ) : (
              <div className="text-center text-white/70 py-8">No summary available.</div>
            )}
          </div>
        </div>
      )}

        {/* Chat Sidebar - Floating (outside content flow) */}
        {showChat && stage === 'results' && (
          <ChatSidebar
            isDarkMode={isDarkMode}
            theme={theme}
            onClose={() => onShowChat(false)}
            documentId={documentId ?? null}
            userId={userId ?? null}
          />
        )}
      </div>
    </>
  );
}