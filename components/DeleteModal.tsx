import React from 'react';
import { Trash, Loader2 } from 'lucide-react';

interface DeleteModalProps {
  show: boolean;
  isDarkMode: boolean;
  theme: any;
  pdfTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
  sidebarOpen?: boolean;
  isDeleting?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  show,
  isDarkMode,
  theme,
  pdfTitle,
  onCancel,
  onConfirm,
  sidebarOpen = true,
  isDeleting = false,
}) => {
  if (!show) return null;
  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      style={{
        left: window.innerWidth >= 1024 ? (sidebarOpen ? '320px' : '80px') : '0',
      }}
    >
      <div 
        className={`${theme.cardBg} rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200`}
        style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-red-500/20 to-red-600/10 flex items-center justify-center ring-4 ring-red-500/10">
            <Trash className="w-9 h-9 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className={`text-2xl font-bold ${theme.text}`}>
              Delete Document?
            </h3>
            <p className={`text-sm ${theme.textSecondary} leading-relaxed max-w-sm`}>
              This will permanently delete <span className="font-semibold text-red-400">"{pdfTitle || 'this document'}"</span>, including its summary and chat history.
            </p>
            <p className={`text-xs ${theme.textMuted} italic`}>
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'} ${theme.text} border ${theme.cardBorder} ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold bg-linear-to-r from-red-500 to-red-600 text-white transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 ${isDeleting ? 'opacity-90 cursor-not-allowed' : 'hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] cursor-pointer'}`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
