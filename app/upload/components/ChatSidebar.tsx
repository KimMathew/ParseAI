"use client";

import React from 'react';
import { MessageSquare, X } from 'lucide-react';

type ChatSidebarProps = {
  isDarkMode: boolean;
  theme: any;
  onClose: () => void;
};

export default function ChatSidebar({
  isDarkMode,
  theme,
  onClose,
}: ChatSidebarProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96 h-[calc(100vh-2rem)] sm:h-[600px] max-h-[600px] sm:max-h-[600px] z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-2xl shadow-2xl border ${theme.cardBorder} h-full flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="bg-linear-to-r from-[#6366F1] to-[#8B5CF6] p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">AI Assistant</h4>
              <p className="text-xs text-white/80">Ask about your paper</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Close chat"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-slate-100'} rounded-lg p-3 border ${theme.cardBorder}`}>
            <p className={`text-xs sm:text-sm ${theme.textSecondary}`}>
              👋 Hi! I've analyzed your paper. Ask me anything about the methodology, results, or any specific section.
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className={`p-3 sm:p-4 border-t ${theme.cardBorder} bg-linear-to-t ${isDarkMode ? 'from-[#1F2937]/50' : 'from-slate-50/50'}`}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 ${theme.inputBg} border ${theme.inputBorder} rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-xs sm:text-sm ${theme.inputText} ${theme.inputPlaceholder}`}
            />
            <button className="px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:scale-105 transition-all font-medium text-xs sm:text-sm">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
