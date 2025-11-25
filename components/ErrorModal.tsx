import React from 'react';
import { XCircle, X } from 'lucide-react';

interface ErrorModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  show,
  message,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1d29] rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200"
        style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">
              Unable to create account
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-white/70 leading-relaxed">
        {message}
        </p>
        
        
        
        
      </div>
    </div>
  );
};

export default ErrorModal;
