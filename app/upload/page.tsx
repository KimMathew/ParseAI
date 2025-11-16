"use client";

import React, { useState } from 'react';
import { ChevronLeft, Menu, RotateCcw, Moon, Sun, MessageSquare } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { getTheme } from '@/lib/theme';
import CustomToast from '@/components/CustomToast';
import UploadSidebar from './components/UploadSidebar';
import UploadContent from './components/UploadContent';
import AnimatedBackground from './components/AnimatedBackground';
import { supabase } from '@/lib/supabaseClient';
import { getDocumentsByUser, getSummaryByDocumentId, createDocument, createSummary, uploadFileToStorage } from '@/lib/supabaseApi';

export default function UploadPage() {
  const [stage, setStage] = useState('upload');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed default to false for mobile-first
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [summaryResult, setSummaryResult] = useState<any>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // User state
  const [user, setUser] = useState<any>(null);
  // Upload history state
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);

  // Fetch user from Supabase auth
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        let avatarSource = data.user.user_metadata?.name || data.user.email || '';
        let avatar = avatarSource.trim().length > 0 ? avatarSource.slice(0,2).toUpperCase() : 'U';
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
      // Compose summaryResult object for UploadContent
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

  React.useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
    if (!user?.id) {
      toast.custom((t) => (
        <CustomToast
          type="error"
          title="Authentication required"
          onClose={() => toast.dismiss(t)}
          isDarkMode={isDarkMode}
        />
      ), { duration: 4000 });
      return;
    }
    setIsProcessing(true);
    try {
      let res: Response;
      let file_url = null;
      let file_type = null;
      let docTitle = file ? file.name : (text.slice(0, 40) + (text.length > 40 ? '...' : ''));
      // 1. Upload file to Supabase Storage if file
      if (file) {
        const path = `${user.id}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await uploadFileToStorage(file, path);
        if (uploadError) {
          toast.custom((t) => (
            <CustomToast
              type="error"
              title="File upload failed"
              onClose={() => toast.dismiss(t)}
              isDarkMode={isDarkMode}
            />
          ), { duration: 5000 });
          throw new Error('File upload failed');
        }
        file_url = uploadData?.path || null;
        file_type = file.type.includes('pdf') ? 'pdf' : 'docx';
      } else {
        file_type = 'text';
      }
      // 2. Summarize
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
        toast.custom((t) => (
          <CustomToast
            type="error"
            title="Summarization failed"
            onClose={() => toast.dismiss(t)}
            isDarkMode={isDarkMode}
          />
        ), { duration: 5000 });
        throw new Error(`Server error ${res.status}: ${textBody}`);
      }
      const data = await res.json();
  setSummaryResult(data);
      console.log('Abstract to be saved:', data.Abstract);
      console.log('Introduction to be saved:', data.Introduction);
      console.log('Methodology to be saved:', data.Methodology);
      console.log('Results to be saved:', data.Results);
      console.log('Conclusion to be saved:', data.Conclusion);
      console.log('Keywords to be saved:', data.Keywords);
  setStage('results');
      // 3. Save document to Supabase
      const { data: docData, error: docError } = await createDocument({
        user_id: user.id,
        title: docTitle,
        file_url: file_url || '',
        file_type,
        original_text: file ? undefined : text,
      });

      console.log('docData:', docData, 'docError:', docError);
  if (docError || !docData) {
        toast.custom((t) => (
          <CustomToast
            type="error"
            title="Failed to save document"
            onClose={() => toast.dismiss(t)}
            isDarkMode={isDarkMode}
          />
        ), { duration: 5000 });
        throw new Error('Failed to save document');
      }
      const document: any = Array.isArray(docData) ? docData[0] : docData;
      console.log('Document ID to be saved:', document.id);
      if (!document) throw new Error('Document not returned from DB');
      // 4. Save summary to Supabase
      const { error: summaryError } = await createSummary({
        document_id: document.id,
        abstract_summary: data.Abstract || '',
        introduction_summary: data.Introduction || '',
        methodology_summary: data.Methodology || '',
        results_summary: data.Results || '',
        conclusion_summary: data.Conclusion || '',
        keywords: data.Keywords || '',
      }) || {};
      if (summaryError) {
        // eslint-disable-next-line no-console
        console.error('Supabase summary insert error:', summaryError);
        toast.custom((t) => (
          <CustomToast
            type="error"
            title="Failed to save summary"
            onClose={() => toast.dismiss(t)}
            isDarkMode={isDarkMode}
          />
        ), { duration: 5000 });
        return;
      }
      // 5. Refetch upload history from Supabase to ensure UI is in sync
      await fetchHistory();
  setSelectedHistory(document.id);
  setCurrentDocumentId(document.id);
      // Success notification
      toast.custom((t) => (
        <CustomToast
          type="success"
          title="Paper summarized successfully!"
          onClose={() => toast.dismiss(t)}
          isDarkMode={isDarkMode}
        />
      ), { duration: 4000 });
      // After setSelectedHistory(document.id);
    } catch (err: any) {
      toast.custom((t) => (
        <CustomToast
          type="error"
          title="An error occurred"
          onClose={() => toast.dismiss(t)}
          isDarkMode={isDarkMode}
        />
      ), { duration: 5000 });
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

  const handleHistoryClick = (item: any) => {
    setSelectedHistory(item.id);
    setSummaryResult(item.summaryResult);
    setCurrentDocumentId(item.id);
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
        {/* Sidebar - History Panel */}
        <UploadSidebar
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
            {/* Left: Toggle Button in Glassy Circle Container */}
            <div className={`${theme.cardBg} backdrop-blur-xl border ${theme.cardBorder} rounded-full shadow-lg`}>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-3 cursor-pointer rounded-full transition-colors`}
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
            </div>

            {/* Right: Placeholder for future actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Placeholder for future actions */}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto relative z-10">
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
            documentId={currentDocumentId}
            userId={user?.id ?? null}
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
    </>
  );
}
