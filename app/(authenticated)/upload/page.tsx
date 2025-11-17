"use client";

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { getTheme } from '@/lib/theme';
import CustomToast from '@/components/CustomToast';
import UploadContent from './components/UploadContent';
import { supabase } from '@/lib/supabaseClient';
import { getDocumentsByUser, getSummaryByDocumentId, createDocument, createSummary, uploadFileToStorage } from '@/lib/supabaseApi';
import { useHistory } from '../HistoryContext';
import { useTheme } from '../ThemeContext';

export default function UploadPage({ onHistoryRefresh }: { onHistoryRefresh?: () => void }) {
  const { selectedHistoryItem } = useHistory();
  const { isDarkMode } = useTheme();
  const [stage, setStage] = useState('upload');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [summaryResult, setSummaryResult] = useState<any>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [pdfTitle, setPdfTitle] = useState<string>('');
  const [uploadDate, setUploadDate] = useState<string>('');

  // Load selected history item from context
  React.useEffect(() => {
    if (selectedHistoryItem) {
      // Load history item - show results
      setSummaryResult(selectedHistoryItem.summaryResult);
      setCurrentDocumentId(selectedHistoryItem.id);
      setPdfTitle(selectedHistoryItem.title);
      // Format timestamp to show only date
      const date = new Date(selectedHistoryItem.created_at);
      const formattedDate = `Uploaded on ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
      setUploadDate(formattedDate);
      setStage('results');
      setShowChat(false);
    } else if (selectedHistoryItem === null) {
      // New upload clicked - reset to upload view
      setStage('upload');
      setSummaryResult(null);
      setCurrentDocumentId(null);
      setPdfTitle('');
      setUploadDate('');
      setShowChat(false);
      setFile(null);
      setText('');
    }
  }, [selectedHistoryItem]);

  // Fetch user from Supabase auth
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email,
          email: data.user.email,
        });
      }
    };
    fetchUser();
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
    // TOGGLE THIS TO USE MOCK DATA (true = mock, false = real backend)
    const USE_MOCK_DATA = false;
    
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
    
    // Mock data bypass
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      const mockData = {
        Abstract: "This groundbreaking research explores the intersection of quantum computing and machine learning algorithms. We present a novel hybrid approach that combines quantum annealing with classical neural networks to solve complex optimization problems. Our method demonstrates significant improvements in computational efficiency and accuracy compared to traditional approaches.",
        Introduction: "Recent advances in quantum computing have opened new possibilities for solving computationally intensive problems. Machine learning, particularly deep learning, has revolutionized various fields but faces scalability challenges. This paper introduces QuaNN (Quantum-enhanced Neural Networks), a framework that leverages quantum computing principles to enhance neural network training and inference.",
        Methodology: "We developed a hybrid architecture consisting of three main components: (1) a quantum annealing layer for feature extraction, (2) a classical convolutional neural network for pattern recognition, and (3) a quantum-classical interface layer for seamless integration. The quantum layer uses a 128-qubit system to perform parallel feature space exploration. Training was conducted using a custom optimization algorithm that alternates between quantum and classical parameter updates.",
        Results: "Our experiments on three benchmark datasets (MNIST, CIFAR-10, and ImageNet) show that QuaNN achieves 23% faster training times and 15% higher accuracy compared to purely classical approaches. The quantum layer demonstrated particular effectiveness in high-dimensional feature spaces, reducing the required training epochs by 40%. Energy consumption was reduced by 35% during inference, making the approach more sustainable for large-scale deployments.",
        Conclusion: "This work demonstrates the viability of quantum-classical hybrid systems for practical machine learning applications. The QuaNN framework provides a scalable solution that can be adapted to various neural network architectures. Future work will focus on expanding to larger quantum systems and exploring applications in natural language processing and reinforcement learning.",
        Keywords: "quantum computing, machine learning, neural networks, hybrid algorithms, quantum annealing, optimization, deep learning, computational efficiency"
      };
      setSummaryResult(mockData);
      
      // Set PDF title and upload date for mock data
      const mockTitle = file ? file.name : "Mock Research Paper";
      setPdfTitle(mockTitle);
      const currentDate = new Date();
      const formattedDate = `Uploaded on ${currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
      setUploadDate(formattedDate);
      
      setStage('results');
      setIsProcessing(false);
      
      toast.custom((t) => (
        <CustomToast
          type="success"
          title="Mock data loaded successfully!"
          onClose={() => toast.dismiss(t)}
          isDarkMode={isDarkMode}
        />
      ), { duration: 4000 });
      return;
    }
    
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
      
      // Set PDF title and upload date
      setPdfTitle(docTitle);
      const currentDate = new Date();
      const formattedDate = `Uploaded on ${currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
      setUploadDate(formattedDate);
      
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
      // Refresh upload history in sidebar
      if (onHistoryRefresh) onHistoryRefresh();
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

  const theme = getTheme(isDarkMode);

  return (
    <>
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
        file={file}
        text={text}
        onFileChange={handleFileChange}
        onTextChange={handleTextChange}
        summaryResult={summaryResult}
        documentId={currentDocumentId}
        userId={user?.id ?? null}
        pdfTitle={pdfTitle}
        uploadDate={uploadDate}
      />

      {/* Floating Chat Toggle Button - Always show in results stage */}
      {stage === 'results' && (
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full hover:scale-110 transition-all duration-200 flex items-center justify-center z-50 shadow-2xl cursor-pointer"
          title={showChat ? "Close chat" : "Chat with AI"}
          aria-label={showChat ? "Close chat" : "Open chat"}
        >
          {showChat ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      )}
    </>
  );
}
