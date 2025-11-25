"use client";

import React from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface CustomToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  onClose?: () => void;
  isDarkMode?: boolean;
}

export default function CustomToast({ 
  type, 
  title, 
  description, 
  onClose,
  isDarkMode = true 
}: CustomToastProps) {
  const icons = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
    warning: AlertTriangle,
  };

  const gradients = {
    success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
    error: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
    info: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
    warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)',
  };

  const Icon = icons[type];

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-2xl backdrop-blur-xl border border-white/20 min-w-[320px] max-w-[420px]"
      style={{
        background: isDarkMode 
          ? gradients[type]
          : gradients[type].replace('0.95', '0.9'),
      }}
    >
      {/* Animated background shimmer */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          animation: 'shimmer 3s infinite',
        }}
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="relative p-4 flex items-center gap-3">
        {/* Icon */}
        <div className="shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm leading-tight">
            {title}
          </h4>
          {description && (
            <p className="text-white/90 text-xs leading-relaxed mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center group cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white/40"
          style={{
            animation: 'progress 4s linear forwards',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
