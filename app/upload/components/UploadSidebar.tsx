"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Upload, FileText, LogOut, Clock, Search, Moon, Sun } from 'lucide-react';

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
  isCollapsed?: boolean;
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
  isCollapsed = false,
}: UploadSidebarProps) {
  const router = useRouter();
  const [showLogoutMenu, setShowLogoutMenu] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

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
      
      {/* Logout Popup Menu - Rendered outside sidebar to avoid overflow clipping */}
      {showLogoutMenu && isCollapsed && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-70" 
            onClick={() => setShowLogoutMenu(false)}
          />
          {/* Menu - appears to the right of sidebar */}
          <div 
            className={`fixed bottom-4 left-24 ${theme.cardBg} border ${theme.cardBorder} rounded-xl shadow-2xl z-80 backdrop-blur-xl w-64 overflow-hidden`}
          >
            {/* User Info */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 shrink-0">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${theme.text} truncate`}>{user.name}</p>
                  <p className={`text-xs ${theme.textMuted} truncate`}>{user.email}</p>
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className={`border-t ${theme.cardBorder}`}></div>
            {/* Logout Button */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-all text-red-500 cursor-pointer group`}
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Sidebar */}
      <div className={`
        ${theme.sidebarBg} border-r ${theme.sidebarBorder} 
        flex flex-col overflow-hidden fixed left-0 top-0 h-screen
        transition-all duration-300 ease-in-out
        w-80 max-w-[85vw]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarOpen || !isCollapsed ? 'lg:w-80' : 'lg:w-20'}
        z-60 lg:z-40
      `}>
      {/* Sidebar Header - Branded */}
      <div className={`px-4 py-6  border-b ${theme.sidebarBorder} shrink-0 bg-linear-to-br from-[#6366F1]/10 via-[#8B5CF6]/5 to-transparent`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center lg:justify-center' : 'gap-3'}`}>
          <img 
            src="/images/parseai-logo.png" 
            alt="PARSe AI" 
            className="w-12 h-12 min-w-12 min-h-12 max-w-12 max-h-12 object-contain rounded-full shrink-0 flex-none"
          />
          <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 delay-75'
          }`}>
            <h1 className={`text-lg font-bold ${theme.text} mb-0.5 whitespace-nowrap`}>PARSe AI</h1>
            <p className={`text-xs ${theme.textMuted} leading-tight whitespace-nowrap`}>
              Paper Analysis & Research Summarizer
            </p>
          </div>
        </div>
      </div>

      {/* New Upload Button */}
      <div className="p-4 shrink-0">
        <button
          onClick={onNewUpload}
          className={`flex items-center justify-center bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all duration-200 font-semibold text-sm group cursor-pointer ${
            isCollapsed 
              ? 'lg:w-12 lg:h-12 lg:rounded-full lg:mx-auto w-full px-4 py-3 rounded-full' 
              : 'w-full px-4 py-3 rounded-full gap-2'
          }`}
          title={isCollapsed ? "New Upload" : undefined}
        >
          <Upload className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
          <span className={`whitespace-nowrap transition-all duration-300 ${
            isCollapsed ? 'lg:hidden' : 'opacity-100 delay-75'
          }`}>
            New Upload
          </span>
        </button>
      </div>

      {/* Upload History List */}
      {!isCollapsed && (
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
      )}

      {/* Spacer for collapsed state to push bottom items down */}
      {isCollapsed && <div className="hidden lg:block flex-1"></div>}

      {/* Theme Toggle - Above Profile */}
      <div className="p-4 shrink-0">
        {isCollapsed ? (
          <button
            onClick={onThemeToggle}
            className={`hidden lg:flex w-12 h-12 items-center justify-center rounded-full transition-all border mx-auto cursor-pointer ${
              isDarkMode 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                : 'bg-black/5 hover:bg-black/10 border-black/10 text-gray-900'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        ) : (
          <div className={`flex items-center ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-full p-1 border ${theme.cardBorder}`}>
            <button
              onClick={onThemeToggle}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full transition-all text-xs font-medium cursor-pointer ${
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
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full transition-all text-xs font-medium cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-700 text-white shadow-sm' 
                  : `${theme.textMuted} hover:${theme.textSecondary}`
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        )}
      </div>

      {/* User Profile Section - Bottom */}
      <div className={`p-4 border-t ${theme.sidebarBorder} shrink-0 ${theme.cardBg}`}>
        {isCollapsed ? (
          <div className="hidden lg:block">
            <button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="w-full flex justify-center cursor-pointer"
            >
              <div className="w-10 h-10 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 hover:scale-110 transition-transform">
                {user.avatar}
              </div>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/20">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${theme.text} truncate`}>{user.name}</p>
              <p className={`text-xs ${theme.textMuted} truncate`}>{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className={`p-2 ${theme.hoverBg} hover:bg-red-500/10 rounded-lg transition-all hover:text-red-500 ${theme.textSecondary} cursor-pointer`}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
