"use client";

import React from 'react';
import { Upload, FileText, LogOut, Clock, Sun, Moon } from 'lucide-react';

type UploadHistoryItem = {
  id: number;
  title: string;
  type: string;
  timestamp: string;
  preview: string;
};

type UploadSidebarProps = {
  sidebarOpen: boolean;
  selectedHistory: number | null;
  isDarkMode: boolean;
  theme: any;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  uploadHistory: UploadHistoryItem[];
  onHistoryClick: (item: UploadHistoryItem) => void;
  onNewUpload: () => void;
  onThemeToggle: () => void;
};

export default function UploadSidebar({
  sidebarOpen,
  selectedHistory,
  isDarkMode,
  theme,
  user,
  uploadHistory,
  onHistoryClick,
  onNewUpload,
  onThemeToggle,
}: UploadSidebarProps) {
  return (
    <>
      {/* Backdrop Overlay - Only visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onNewUpload}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${theme.sidebarBg} border-r ${theme.sidebarBorder} 
        flex flex-col overflow-hidden fixed left-0 top-0 h-screen
        transition-all duration-300 ease-in-out
        w-80 max-w-[85vw]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarOpen ? 'lg:w-80' : 'lg:w-0'}
        z-60 lg:z-40
      `}>
      {/* Sidebar Header - Branded */}
      <div className={`p-6 border-b ${theme.sidebarBorder} shrink-0 bg-linear-to-br from-[#6366F1]/10 via-[#8B5CF6]/5 to-transparent`}>
        <div className="flex items-center gap-3">
          <img 
            src="/images/parseai-logo.png" 
            alt="PARSe AI" 
            className="w-12 h-12 object-contain rounded-full"
          />
          <div className="flex-1">
            <h1 className={`text-lg font-bold ${theme.text} mb-0.5`}>PARSe AI</h1>
            <p className={`text-xs ${theme.textMuted} leading-tight`}>
              Paper Analysis & Research Summarizer
            </p>
          </div>
        </div>
      </div>

      {/* New Upload Button */}
      <div className={`p-4 shrink-0`}>
        <button
          onClick={onNewUpload}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all duration-200 font-semibold text-sm group"
        >
          <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
          New Upload
        </button>
      </div>

      {/* Upload History List */}
      <div className="flex-1 overflow-y-auto min-h-0 upload-history-scroll">
        <style jsx>{`
          .upload-history-scroll::-webkit-scrollbar {
            width: 14px;
          }
          .upload-history-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .upload-history-scroll::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
            border-radius: 6px;
            transition: background 0.2s ease;
          }
          .upload-history-scroll::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)'};
          }
          .upload-history-scroll {
            scrollbar-width: thin;
            scrollbar-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'} transparent;
          }
        `}</style>
        <div className="p-4">
          <h3 className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-3`}>
            Upload History
          </h3>
          <div className="space-y-2">
            {uploadHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => onHistoryClick(item)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedHistory === item.id
                    ? 'bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/20'
                    : `${theme.historyItemBg} ${theme.historyItemHover} ${theme.historyItemText} border ${theme.cardBorder}`
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {item.type === 'pdf' ? (
                    <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${selectedHistory === item.id ? 'text-white' : 'text-[#6366F1]'}`} />
                  ) : (
                    <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${selectedHistory === item.id ? 'text-white' : 'text-[#22D3EE]'}`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${selectedHistory === item.id ? 'text-white' : theme.text}`}>
                      {item.title}
                    </p>
                    <p className={`text-xs truncate mt-0.5 ${selectedHistory === item.id ? 'text-white/80' : theme.textTertiary}`}>
                      {item.preview}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-6">
                  <Clock className={`w-3 h-3 ${selectedHistory === item.id ? 'text-white/80' : theme.textMuted}`} />
                  <span className={`text-xs ${selectedHistory === item.id ? 'text-white/80' : theme.textMuted}`}>
                    {item.timestamp}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Toggle - Above Profile */}
      <div className={`p-4 shrink-0`}>
        <div className={`flex items-center ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-lg p-1 border ${theme.cardBorder}`}>
          <button
            onClick={onThemeToggle}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-medium ${
              !isDarkMode 
                ? 'bg-white text-gray-900 shadow-sm' 
                : `${theme.textMuted} hover:${theme.textSecondary}`
            }`}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            onClick={onThemeToggle}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-medium ${
              isDarkMode 
                ? `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} shadow-sm` 
                : `${theme.textMuted} hover:${theme.textSecondary}`
            }`}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
        </div>
      </div>

      {/* User Profile Section - Bottom */}
      <div className={`p-4 border-t ${theme.sidebarBorder} shrink-0 ${theme.cardBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/20">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${theme.text} truncate`}>{user.name}</p>
            <p className={`text-xs ${theme.textMuted} truncate`}>{user.email}</p>
          </div>
          <button 
            className={`p-2 ${theme.hoverBg} hover:bg-red-500/10 rounded-lg transition-all hover:text-red-500 ${theme.textSecondary}`}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
