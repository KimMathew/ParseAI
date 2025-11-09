"use client";

import React from 'react';
import { Upload, FileText, LogOut, Clock, Search } from 'lucide-react';

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
}: UploadSidebarProps) {
  return (
    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ${theme.sidebarBg} border-r ${theme.sidebarBorder} flex flex-col overflow-hidden fixed left-0 top-0 h-screen z-40`}>
      {/* User Profile Section */}
      <div className={`p-4 border-b ${theme.sidebarBorder} bg-linear-to-r from-[#6366F1] to-[#8B5CF6] shrink-0`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/20">
            {user.avatar}
          </div>
          <div className="flex-1 text-white">
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-white/70">{user.email}</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium border border-white/10">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {/* Search Bar */}
      <div className={`p-4 border-b ${theme.sidebarBorder} shrink-0`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textMuted}`} />
          <input
            type="text"
            placeholder="Search history..."
            className={`w-full pl-10 pr-4 py-2 ${theme.inputBg} border ${theme.inputBorder} rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm ${theme.inputText} ${theme.inputPlaceholder}`}
          />
        </div>
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

      {/* New Upload Button */}
      <div className={`p-4 border-t ${theme.sidebarBorder} shrink-0`}>
        <button
          onClick={onNewUpload}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:scale-105 transition-all duration-200 font-medium"
        >
          <Upload className="w-4 h-4" />
          New Upload
        </button>
      </div>
    </div>
  );
}
