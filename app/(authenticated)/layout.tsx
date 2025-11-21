"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Menu, MessageSquare } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { getTheme } from '@/lib/theme';
import CustomToast from '@/components/CustomToast';
import Sidebar from '@/components/Sidebar';
import AnimatedBackground from './upload/components/AnimatedBackground';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import { getDocumentsByUser, getSummaryByDocumentId } from '@/lib/supabaseApi';
import { HistoryProvider, useHistory } from './HistoryContext';
import { ThemeProvider, useTheme } from './ThemeContext';


export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  
  // Prevent page caching to fix back button issue after logout
  useEffect(() => {
    // Add meta tags to prevent caching
    const metaCache = document.createElement('meta');
    metaCache.httpEquiv = 'Cache-Control';
    metaCache.content = 'no-store, no-cache, must-revalidate, proxy-revalidate';
    document.head.appendChild(metaCache);

    const metaPragma = document.createElement('meta');
    metaPragma.httpEquiv = 'Pragma';
    metaPragma.content = 'no-cache';
    document.head.appendChild(metaPragma);

    const metaExpires = document.createElement('meta');
    metaExpires.httpEquiv = 'Expires';
    metaExpires.content = '0';
    document.head.appendChild(metaExpires);

    return () => {
      document.head.removeChild(metaCache);
      document.head.removeChild(metaPragma);
      document.head.removeChild(metaExpires);
    };
  }, []);
  
  return (
    <ThemeProvider>
      <HistoryProvider>
        <LayoutWrapper historyRefreshKey={historyRefreshKey} onHistoryRefresh={() => setHistoryRefreshKey(k => k + 1)}>
          {children}
        </LayoutWrapper>
      </HistoryProvider>
    </ThemeProvider>
  );
}

function LayoutWrapper({ children, historyRefreshKey, onHistoryRefresh }: { children: React.ReactNode, historyRefreshKey: number, onHistoryRefresh: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
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
      } else {
        // No user found - redirect to signin
        window.location.replace('/signin');
      }
    };
    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.replace('/signin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to format timestamp
  const formatTimestamp = (dateString: string) => {
    const uploadDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time to midnight for comparison
    const uploadDateMidnight = new Date(uploadDate.getFullYear(), uploadDate.getMonth(), uploadDate.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayMidnight = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (uploadDateMidnight.getTime() === todayMidnight.getTime()) {
      return 'Today';
    } else if (uploadDateMidnight.getTime() === yesterdayMidnight.getTime()) {
      return 'Yesterday';
    } else {
      return uploadDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    }
  };

  // Fetch upload history for this user
  const fetchHistory = async () => {
    if (!user?.id) return;
    const { data: docs, error } = await getDocumentsByUser(user.id);
    if (error) return;
    const items = await Promise.all((docs || []).map(async (doc: any) => {
      const { data: summary } = await getSummaryByDocumentId(doc.id);
      let parsedDefinitions = null;
      if (summary?.definitions) {
        try {
          parsedDefinitions = typeof summary.definitions === 'string' 
            ? JSON.parse(summary.definitions) 
            : summary.definitions;
        } catch (e) {
          console.error('Failed to parse definitions:', e);
        }
      }
      const summaryResult = summary ? {
        Abstract: summary.abstract_summary,
        Introduction: summary.introduction_summary,
        Methodology: summary.methodology_summary,
        Results: summary.results_summary,
        Conclusion: summary.conclusion_summary,
        Keywords: summary.keywords,
        Definitions: parsedDefinitions,
      } : null;
      return {
        id: doc.id,
        title: doc.title,
        type: doc.file_type || 'text',
        timestamp: formatTimestamp(doc.created_at),
        created_at: doc.created_at,
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
  }, [user?.id, historyRefreshKey]);

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
    // Pass the full item data including summaryResult to children via context
    // This will be handled by HistoryProvider wrapper
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleNewUpload = () => {
    setSelectedHistory(null);
    // Clear the history item in context to trigger upload view
    // This will be handled by LayoutContent wrapper
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const theme = getTheme(isDarkMode);

  return (
    <LayoutContent 
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      selectedHistory={selectedHistory}
      isDarkMode={isDarkMode}
      onThemeToggle={toggleTheme}
      user={user}
      uploadHistory={uploadHistory}
      handleHistoryClick={handleHistoryClick}
      handleNewUpload={handleNewUpload}
      theme={theme}
      onHistoryRefresh={onHistoryRefresh}
    >
      {children}
    </LayoutContent>
  );
}

function LayoutContent({ 
  children, 
  sidebarOpen, 
  setSidebarOpen, 
  selectedHistory, 
  isDarkMode, 
  onThemeToggle, 
  user, 
  uploadHistory, 
  handleHistoryClick, 
  handleNewUpload, 
  theme, 
  onHistoryRefresh
}: any) {
  const { setSelectedHistoryItem } = useHistory();

  const onHistoryClick = (item: any) => {
    handleHistoryClick(item);
    setSelectedHistoryItem(item); // Pass full item to context
  };

  const onNewUpload = () => {
    handleNewUpload();
    setSelectedHistoryItem(null); // Clear context to show upload view
  };

  // Pass onHistoryRefresh to children via context or props
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
          onHistoryClick={onHistoryClick}
          onNewUpload={onNewUpload}
          isCollapsed={!sidebarOpen}
          onThemeToggle={onThemeToggle}
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
