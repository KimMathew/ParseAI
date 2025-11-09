"use client";

import React from 'react';
import { MessageSquare, X } from 'lucide-react';


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
};


import { useEffect, useRef, useState } from 'react';

export default function ChatSidebar({
  isDarkMode,
  theme,
  onClose,
  documentId,
  userId,
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
    fetch(`http://127.0.0.1:8000/chat/${documentId}`)
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
        question: input,
        answer: '',
      },
    ]);
    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, document_id: documentId, question: input }),
      });
      const data = await res.json();
      if (!res.ok || !data.answer) throw new Error(data.error || 'No answer');
      // Replace temp message with real one
      setMessages(prev => prev.map(m =>
        m.id === tempId ? { ...m, answer: data.answer } : m
      ));
      setInput('');
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
    <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96 h-[calc(100vh-2rem)] sm:h-[600px] max-h-[600px] sm:max-h-[600px] z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-2xl shadow-2xl border ${theme.cardBorder} h-full flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="bg-linear-to-r from-[#6366F1] to-[#8B5CF6] p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">AI Assistant</h4>
              <p className="text-xs text-white/80">Ask about your paper</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Close chat"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-slate-100'} rounded-lg p-3 border ${theme.cardBorder}`}>
            <p className={`text-xs sm:text-sm ${theme.textSecondary}`}>
              👋 Hi! I've analyzed your paper. Ask me anything about the methodology, results, or any specific section.
            </p>
          </div>
          {messages.map((msg, idx) => (
            <div key={msg.id} className={`rounded-lg p-3 border ${theme.cardBorder} ${msg.user_id === userId ? (isDarkMode ? 'bg-[#6366F1]/20' : 'bg-[#6366F1]/10') : (isDarkMode ? 'bg-white/10' : 'bg-slate-100')}`}>
              <div className="mb-1">
                <span className={`font-semibold text-xs ${theme.text}`}>{msg.user_id === userId ? 'You' : 'AI'}</span>
                <span className="ml-2 text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`text-xs sm:text-sm ${theme.text}`}>{msg.question}</div>
              {msg.answer && (
                <div className={`mt-2 text-xs sm:text-sm ${theme.textSecondary} border-t pt-2 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  {msg.answer}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-3 sm:p-4 border-t ${theme.cardBorder} bg-linear-to-t ${isDarkMode ? 'from-[#1F2937]/50' : 'from-slate-50/50'}`}>
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
