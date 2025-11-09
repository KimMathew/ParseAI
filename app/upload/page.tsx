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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock user data
  const user = {
    name: 'Kim Bautista',
    email: 'kim.bautista@email.com',
    avatar: 'KB'
  };

  // Mock history data
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

  const handleSummarize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStage('results');
      setSelectedHistory(1);
    }, 2000);
  };

  const handleNewUpload = () => {
    setStage('upload');
    setUploadMethod('file');
    setShowChat(false);
    setSelectedHistory(null);
  };

  const handleHistoryClick = (item: { id: number; title: string; type: string; timestamp: string; preview: string }) => {
    setSelectedHistory(item.id);
    setStage('results');
    setShowChat(false);
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
      <div className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? 'ml-80' : 'ml-0'} transition-all duration-300`}>
        {/* Header */}
        <header className={`${theme.headerBg} border-b ${theme.sidebarBorder} sticky top-0 z-50`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 ${theme.hoverBg} rounded-lg transition-colors`}
              >
                {sidebarOpen ? <ChevronLeft className={`w-5 h-5 ${theme.textSecondary}`} /> : <Menu className={`w-5 h-5 ${theme.textSecondary}`} />}
              </button>
              <div className="flex items-center gap-3">
                <img 
                  src="/images/parseai-logo.png" 
                  alt="PARSe AI Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className={`text-xl font-bold ${theme.text}`}>PARSe AI</h1>
                  <p className={`text-xs ${theme.textTertiary}`}>Paper Analysis & Research Summarizer</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:scale-105 transition-all duration-200 font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Upload New
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
          />
        </div>
      </div>

      {/* Floating Chat Button - Only show in results stage when chat is closed */}
      {stage === 'results' && !showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full hover:scale-110 transition-all duration-200 flex items-center justify-center z-50 shadow-2xl"
          title="Chat with AI"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
