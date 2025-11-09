"use client";

import React from 'react';
import { Upload, FileText, Sparkles, MessageSquare, Download, Copy } from 'lucide-react';

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
}: UploadContentProps) {
  return (
    <div className="h-full flex items-center justify-center px-6 py-8">
      {stage === 'upload' ? (
        /* UPLOAD STAGE */
        <div className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <h2 className={`text-2xl md:text-3xl font-bold ${theme.text} mb-2`}>
              Transform Research Papers into Clear Insights
            </h2>
            <p className={`${theme.textSecondary} text-base md:text-lg`}>
              Upload a PDF or paste text to get AI-powered summaries in seconds
            </p>
          </div>

          {/* Upload Method Tabs */}
          <div className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-xl shadow-lg border ${theme.cardBorder} overflow-hidden`}>
            <div className={`flex border-b ${theme.cardBorder}`}>
              <button
                onClick={() => onUploadMethodChange('file')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium transition-all ${
                  uploadMethod === 'file'
                    ? 'bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                    : `${theme.tabInactive} ${theme.tabInactiveBg}`
                }`}
              >
                <Upload className="w-5 h-5" />
                Upload PDF/DOCX
              </button>
              <button
                onClick={() => onUploadMethodChange('text')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium transition-all ${
                  uploadMethod === 'text'
                    ? 'bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white'
                    : `${theme.tabInactive} ${theme.tabInactiveBg}`
                }`}
              >
                <FileText className="w-5 h-5" />
                Paste Text
              </button>
            </div>

            <div className="p-6 md:p-8">
              {uploadMethod === 'file' ? (
                <div className={`border-2 border-dashed ${theme.uploadBorder} rounded-xl p-8 md:p-12 text-center ${theme.uploadHoverBorder} ${theme.uploadHoverBg} transition-all cursor-pointer`}>
                  <Upload className={`w-12 h-12 md:w-16 md:h-16 mx-auto ${theme.textMuted} mb-4`} />
                  <p className={`text-base md:text-lg font-medium ${theme.text} mb-2`}>
                    Drop your research paper here
                  </p>
                  <p className={`text-sm ${theme.textTertiary} mb-3`}>
                    or click to browse files
                  </p>
                  <p className={`text-xs ${theme.textMuted}`}>
                    Supports PDF and DOCX (Max 25MB)
                  </p>
                </div>
              ) : (
                <div>
                  <textarea
                    placeholder="Paste your research paper text here..."
                    className={`w-full h-48 md:h-56 p-4 ${theme.inputBg} border ${theme.inputBorder} rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none ${theme.inputText} ${theme.inputPlaceholder}`}
                  />
                  <p className={`text-xs ${theme.textMuted} mt-2`}>
                    Paste the full paper or abstract for best results
                  </p>
                </div>
              )}

              <button
                onClick={onSummarize}
                disabled={isProcessing}
                className="w-full mt-5 py-3 md:py-4 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl font-semibold text-base md:text-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS STAGE */
        <div className="grid grid-cols-12 gap-6 max-w-5xl mx-auto">
          {/* Main Content Area */}
          <div className={`${showChat ? 'col-span-7' : 'col-span-12'} transition-all duration-300`}>
            {/* Paper Info Card */}
            <div className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-xl shadow-lg border ${theme.cardBorder} p-6 mb-6`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${theme.text} mb-2`}>
                    Machine Learning Approaches for Climate Change Prediction
                  </h3>
                  <p className={`text-sm ${theme.textTertiary}`}>
                    John Doe, Jane Smith • Nature Climate Change • 2024
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className={`p-2 ${theme.hoverBg} rounded-lg transition-colors`} title="Download">
                    <Download className={`w-5 h-5 ${theme.textSecondary}`} />
                  </button>
                  <button className={`p-2 ${theme.hoverBg} rounded-lg transition-colors`} title="Copy">
                    <Copy className={`w-5 h-5 ${theme.textSecondary}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Summaries */}
            <div className="space-y-4">
              {['Abstract', 'Introduction', 'Methodology', 'Conclusion'].map((section, idx) => {
                // Define gradient colors for each card
                const gradients = [
                  'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(78,70,197,0.8) 60%, rgba(45,42,120,1) 100%)', // Abstract - Indigo
                  'linear-gradient(160deg, rgba(34,211,238,0.8) 0%, rgba(24,170,190,0.8) 60%, rgba(8,120,130,1) 100%)', // Introduction - Cyan
                  'linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(105,70,200,0.8) 60%, rgba(70,42,160,1) 100%)', // Methodology - Purple
                  'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(78,70,197,0.8) 60%, rgba(45,42,120,1) 100%)'  // Conclusion - Indigo
                ];
                
                return (
                  <div 
                    key={section} 
                    className="rounded-xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1"
                    style={{ background: gradients[idx] }}
                  >
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-white/20 text-white rounded-lg flex items-center justify-center text-sm font-bold border border-white/30">
                        {idx + 1}
                      </span>
                      {section}
                    </h4>
                    <p className="text-white/90 leading-relaxed">
                      This is a sample summary of the {section.toLowerCase()} section. The AI has analyzed the research paper and extracted the key points, presenting them in a clear and concise manner for easy understanding.
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Key Terms */}
            <div 
              className="rounded-xl shadow-lg p-6 mt-6 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: 'linear-gradient(160deg, rgba(34,211,238,0.8) 0%, rgba(24,170,190,0.8) 60%, rgba(8,120,130,1) 100%)' }}
            >
              <h4 className="text-lg font-bold text-white mb-4">Key Terms & Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {['Machine Learning', 'Climate Change', 'Neural Networks', 'Data Analysis', 'Prediction Models', 'Environmental Science'].map(term => (
                  <span key={term} className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          {!showChat ? (
            <></>
          ) : (
            <div className="col-span-5">
              <div className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-xl shadow-lg border ${theme.cardBorder} sticky top-24 h-[calc(100vh-8rem)] flex flex-col`}>
                <div className={`p-4 border-b ${theme.cardBorder} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#22D3EE]" />
                    <h4 className={`font-bold ${theme.text}`}>AI Chat</h4>
                  </div>
                  <button
                    onClick={() => onShowChat(false)}
                    className={`${theme.textTertiary} hover:${theme.text} text-sm transition-colors`}
                  >
                    Close
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className={`${isDarkMode ? 'bg-white/10' : 'bg-slate-100'} rounded-lg p-3 border ${theme.cardBorder}`}>
                    <p className={`text-sm ${theme.textSecondary}`}>
                      Hi! I've analyzed your paper. Ask me anything about the methodology, results, or any specific section.
                    </p>
                  </div>
                </div>

                <div className={`p-4 border-t ${theme.cardBorder}`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about the paper..."
                      className={`flex-1 px-4 py-2 ${theme.inputBg} border ${theme.inputBorder} rounded-lg focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent ${theme.inputText} ${theme.inputPlaceholder}`}
                    />
                    <button className="px-4 py-2 bg-linear-to-r from-[#22D3EE] to-[#8B5CF6] text-white rounded-lg hover:scale-105 transition-all">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
