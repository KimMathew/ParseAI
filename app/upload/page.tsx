"use client";

import React, { useState } from 'react';
import { ChevronLeft, Menu, RotateCcw, Moon, Sun, MessageSquare } from 'lucide-react';
import { getTheme } from '@/lib/theme';
import UploadSidebar from './components/UploadSidebar';
import UploadContent from './components/UploadContent';

export default function UploadPage() {
  const [stage, setStage] = useState('upload');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed default to false for mobile-first
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  // New: file and text state for upload
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  // New: summary result from backend
  const [summaryResult, setSummaryResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Set sidebar open by default on desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock user data
  const user = {
    name: 'Kim Bautista',
    email: 'kim.bautista@email.com',
    avatar: 'KB'
  };
  // Mock history data (keep for now)
  const uploadHistory = [
    {
      id: 1,
      title: 'Machine Learning Approaches for Climate Change',
      type: 'pdf',
      timestamp: '2 hours ago',
      preview: 'Machine Learning Approaches for Climate Change Prediction'
    },
    {
      id: 2,
      title: 'Neural Networks in Medical Diagnosis',
      type: 'pdf',
      timestamp: '1 day ago',
      preview: 'Neural Networks in Medical Diagnosis and Treatment'
    },
    {
      id: 3,
      title: 'Quantum Computing Applications...',
      type: 'text',
      timestamp: '2 days ago',
      preview: 'This study explores the practical applications of quantum computing...'
    },
    {
      id: 4,
      title: 'Renewable Energy Systems',
      type: 'pdf',
      timestamp: '3 days ago',
      preview: 'Renewable Energy Systems: A Comprehensive Review'
    },
    {
      id: 5,
      title: 'Blockchain Technology in Healthcare',
      type: 'pdf',
      timestamp: '1 week ago',
      preview: 'Blockchain Technology Applications in Healthcare Systems'
    }
  ];


  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setText("");
  };

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value) setFile(null);
  };

  // Backend integration for summarization
  const handleSummarize = async () => {
    setError(null);
    setSummaryResult(null);
    if (!file && !text.trim()) {
      setError("Please provide paper text or upload a PDF file.");
      return;
    }
    setIsProcessing(true);
    try {
      let res: Response;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        res = await fetch("http://127.0.0.1:8000/summarize", {
          method: "POST",
          body: fd,
          cache: "no-store",
        });
      } else {
        res = await fetch("http://127.0.0.1:8000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }
      if (!res.ok) {
        const textBody = await res.text();
        throw new Error(`Server error ${res.status}: ${textBody}`);
      }
      const data = await res.json();
      setSummaryResult(data);
      setStage('results');
      setSelectedHistory(null); // Not from history
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewUpload = () => {
    setStage('upload');
    setUploadMethod('file');
    setShowChat(false);
    setSelectedHistory(null);
    setFile(null);
    setText("");
    setSummaryResult(null);
    setError(null);
    // Close sidebar on mobile when starting new upload
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleHistoryClick = (item: { id: number; title: string; type: string; timestamp: string; preview: string }) => {
    setSelectedHistory(item.id);
    setStage('results');
    setShowChat(false);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Get theme configuration
  const theme = getTheme(isDarkMode);

  return (
    <div className={`min-h-screen ${theme.bg} flex transition-colors duration-300`}>
      {/* Sidebar - History Panel */}
      <UploadSidebar
        sidebarOpen={sidebarOpen}
        selectedHistory={selectedHistory}
        isDarkMode={isDarkMode}
        theme={theme}
        user={user}
        uploadHistory={uploadHistory}
        onHistoryClick={handleHistoryClick}
        onNewUpload={handleNewUpload}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-0'}`}>
        {/* Header */}
        <header className={`${theme.headerBg} border-b ${theme.sidebarBorder} sticky top-0 z-50`}>
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 ${theme.hoverBg} rounded-lg transition-colors`}
                aria-label="Toggle sidebar"
              >
                {/* Show ChevronLeft on desktop when sidebar is open, Menu otherwise */}
                <span className="hidden lg:block">
                  {sidebarOpen ? <ChevronLeft className={`w-5 h-5 ${theme.textSecondary}`} /> : <Menu className={`w-5 h-5 ${theme.textSecondary}`} />}
                </span>
                {/* Always show Menu icon on mobile */}
                <span className="lg:hidden">
                  <Menu className={`w-5 h-5 ${theme.textSecondary}`} />
                </span>
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <img 
                  src="/images/parseai-logo.png" 
                  alt="PARSe AI Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className={`text-lg sm:text-xl font-bold ${theme.text}`}>PARSe AI</h1>
                  <p className={`text-xs ${theme.textTertiary}`}>Paper Analysis & Research Summarizer</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 ${theme.hoverBg} rounded-lg transition-all ${theme.textSecondary} hover:scale-105`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {stage === 'results' && (
                <button
                  onClick={handleNewUpload}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:scale-105 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload New</span>
                  <span className="sm:hidden">New</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <UploadContent
            stage={stage}
            uploadMethod={uploadMethod}
            isProcessing={isProcessing}
            showChat={showChat}
            isDarkMode={isDarkMode}
            theme={theme}
            onUploadMethodChange={setUploadMethod}
            onSummarize={handleSummarize}
            onShowChat={setShowChat}
            // New props for backend integration
            file={file}
            text={text}
            onFileChange={handleFileChange}
            onTextChange={handleTextChange}
            summaryResult={summaryResult}
            error={error}
          />
        </div>
      </div>

      {/* Floating Chat Button - Only show in results stage when chat is closed */}
      {stage === 'results' && !showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full hover:scale-110 transition-all duration-200 flex items-center justify-center z-50 shadow-2xl"
          title="Chat with AI"
          aria-label="Open chat"
        >
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
}
