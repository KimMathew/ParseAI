"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Menu, MessageSquare } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { getTheme } from '@/lib/theme';
import CustomToast from '@/components/CustomToast';
import Sidebar from '@/components/Sidebar';
import AnimatedBackground from './upload/components/AnimatedBackground';
import { supabase } from '@/lib/supabaseClient';
import { getDocumentsByUser, getSummaryByDocumentId } from '@/lib/supabaseApi';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);

  // Fetch user from Supabase auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        let avatarSource = data.user.user_metadata?.name || data.user.email || '';
        let avatar = avatarSource.trim().length > 0 ? avatarSource.slice(0, 2).toUpperCase() : 'U';
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email,
          email: data.user.email,
          avatar,
        });
      }
    };
    fetchUser();
  }, []);

  // Fetch upload history for this user
  const fetchHistory = async () => {
    if (!user?.id) return;
    const { data: docs, error } = await getDocumentsByUser(user.id);
    if (error) return;
    const items = await Promise.all((docs || []).map(async (doc: any) => {
      const { data: summary } = await getSummaryByDocumentId(doc.id);
      const summaryResult = summary ? {
        Abstract: summary.abstract_summary,
        Introduction: summary.introduction_summary,
        Methodology: summary.methodology_summary,
        Conclusion: summary.conclusion_summary,
        Keywords: summary.keywords,
      } : null;
      return {
        id: doc.id,
        title: doc.title,
        type: doc.file_type || 'text',
        timestamp: new Date(doc.created_at).toLocaleString(),
        preview: summary?.keywords || summary?.abstract_summary || 'No preview',
        summaryResult,
        file_url: doc.file_url,
      };
    }));
    setUploadHistory(items);
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Set sidebar open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHistoryClick = (item: any) => {
    setSelectedHistory(item.id);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    // You'll need to pass this data to child pages via context or URL params
  };

  const handleNewUpload = () => {
    setSelectedHistory(null);
    // Close sidebar on mobile when starting new upload
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const theme = getTheme(isDarkMode);

  return (
    <>
      <Toaster 
        position="top-right"
        expand={false}
        gap={12}
        offset={16}
        toastOptions={{
          unstyled: true,
        }}
      />
      <div className={`min-h-screen ${theme.bg} flex transition-colors duration-300`}>
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          selectedHistory={selectedHistory}
          isDarkMode={isDarkMode}
          theme={theme}
          user={user ?? { name: '', email: '', avatar: 'U' }}
          uploadHistory={uploadHistory}
          onHistoryClick={handleHistoryClick}
          onNewUpload={handleNewUpload}
          isCollapsed={!sidebarOpen}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'} relative`}>
          <AnimatedBackground isDarkMode={isDarkMode} />

          {/* Header */}
          <header className="sticky top-0 z-50 bg-transparent">
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className={`${theme.cardBg} backdrop-blur-xl border ${theme.cardBorder} rounded-full shadow-lg`}>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-3 cursor-pointer rounded-full transition-colors`}
                  aria-label="Toggle sidebar"
                >
                  <span className="hidden lg:block">
                    {sidebarOpen ? <ChevronLeft className={`w-5 h-5 ${theme.textSecondary}`} /> : <Menu className={`w-5 h-5 ${theme.textSecondary}`} />}
                  </span>
                  <span className="lg:hidden">
                    <Menu className={`w-5 h-5 ${theme.textSecondary}`} />
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Placeholder for future actions */}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto relative z-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
