"use client";

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getApiUrl } from '@/lib/apiConfig';

// Typing indicator component
const TypingIndicator = ({ isDarkMode, theme }: { isDarkMode: boolean; theme: any }) => (
  <div className="flex items-start gap-2">
    <div className="w-8 h-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center flex-shrink-0">
      <MessageSquare className="w-4 h-4 text-white" />
    </div>
    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-slate-100'} rounded-2xl rounded-tl-none p-3`}>
      <div className="flex gap-1 items-center h-5">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

// Format message text with markdown-like formatting
const FormattedMessage = ({ text, className }: { text: string; className: string }) => {
  // Split by double newlines for paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  const formatText = (str: string) => {
    // Replace **text** with bold
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      // Replace single newlines with <br />
      return part.split('\n').map((line, i, arr) => (
        <React.Fragment key={`${index}-${i}`}>
          {line}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  const formatParagraph = (paragraph: string) => {
    // Check if paragraph contains bullet points
    const lines = paragraph.split('\n');
    const isBulletList = lines.some(line => line.trim().match(/^\*\s+/));
    
    if (isBulletList) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {lines.map((line, i) => {
            const bulletMatch = line.trim().match(/^\*\s+(.+)$/);
            if (bulletMatch) {
              return <li key={i}>{formatText(bulletMatch[1])}</li>;
            }
            return line.trim() ? <div key={i}>{formatText(line)}</div> : null;
          })}
        </ul>
      );
    }
    
    return <>{formatText(paragraph)}</>;
  };

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <div key={index} className={index > 0 ? 'mt-3' : ''}>
          {formatParagraph(paragraph)}
        </div>
      ))}
    </div>
  );
};


type ChatMessage = {
  id: string;
  created_at: string;
  user_id: string;
  document_id: string;
  question: string;
  answer: string;
};

type ChatSidebarProps = {
  isDarkMode: boolean;
  theme: any;
  onClose: () => void;
  documentId: string | number | null;
  userId: string | null;
  uploadDate?: string;
};


import { useEffect, useRef, useState } from 'react';

export default function ChatSidebar({
  isDarkMode,
  theme,
  onClose,
  documentId,
  userId,
  uploadDate,
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history when documentId changes
  useEffect(() => {
    if (!documentId) return;
    setMessages([]);
    setError(null);
    fetch(getApiUrl(`chat/${documentId}`))
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data.chats) ? data.chats : []);
      })
      .catch(() => setError('Failed to load chat history.'));
  }, [documentId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !documentId || !userId) return;
    
    const questionToSend = input.trim();
    // Clear input immediately for better UX
    setInput('');
    setLoading(true);
    setError(null);
    
    // Optimistically add user question
    const tempId = 'temp-' + Date.now();
    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        created_at: new Date().toISOString(),
        user_id: userId,
        document_id: String(documentId),
        question: questionToSend,
        answer: '',
      },
    ]);
    try {
      const res = await fetch(getApiUrl('chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, document_id: documentId, question: questionToSend }),
      });
      const data = await res.json();
      if (!res.ok || !data.answer) throw new Error(data.error || 'No answer');
      // Replace temp message with real one
      setMessages(prev => prev.map(m =>
        m.id === tempId ? { ...m, answer: data.answer } : m
      ));
    } catch (e: any) {
      setError(e.message || 'Failed to send message.');
      // Remove temp message
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed inset-x-4 bottom-20 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-96 h-[calc(100vh-7rem)] sm:h-[500px] max-h-[500px] sm:max-h-[500px] z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="bg-linear-to-r from-[#6366F1] to-[#8B5CF6] p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base">AI Assistant</h4>
            <p className="text-xs text-white/80">Ask about your paper</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {/* Welcome Message */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-slate-100'} rounded-2xl rounded-tl-none p-3 max-w-[80%]`}>
              <p className={`text-xs sm:text-sm ${theme.text}`}>
                👋 Hi! I've analyzed your paper. Ask me anything about the methodology, results, or any specific section.
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          {messages.map((msg) => (
            <React.Fragment key={msg.id}>
              {/* User Message */}
              <div className="flex items-start gap-2 justify-end">
                <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-xs sm:text-sm text-white">{msg.question}</p>
                </div>
              </div>

              {/* AI Response or Loading Indicator */}
              {msg.answer ? (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-slate-100'} rounded-2xl rounded-tl-none p-3 max-w-[80%]`}>
                    <FormattedMessage text={msg.answer} className={`text-xs sm:text-sm ${theme.text}`} />
                  </div>
                </div>
              ) : (
                <TypingIndicator isDarkMode={isDarkMode} theme={theme} />
              )}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-3 sm:p-4 border-t ${theme.cardBorder} ${isDarkMode ? 'bg-gray-750' : 'bg-slate-50'}`}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 ${theme.inputBg} border ${theme.inputBorder} rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-xs sm:text-sm ${theme.inputText} ${theme.inputPlaceholder}`}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:scale-105 transition-all font-medium text-xs sm:text-sm disabled:opacity-60"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
          {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}
