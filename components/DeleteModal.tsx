import React from 'react';
import { Trash } from 'lucide-react';

interface DeleteModalProps {
  show: boolean;
  isDarkMode: boolean;
  theme: any;
  pdfTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  show,
  isDarkMode,
  theme,
  pdfTitle,
  onCancel,
  onConfirm,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`${theme.cardBg} ${isDarkMode ? 'backdrop-blur-xl' : ''} rounded-xl p-6 max-w-md w-full border animate-in zoom-in-95 duration-200`}
        style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <Trash className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme.text} mb-2`}>
              Delete Document?
            </h3>
            <p className={`text-sm ${theme.textSecondary} text-justify leading-relaxed`}>
              This will permanently delete "<span className="font-semibold">{pdfTitle || 'this document'}</span>", including its summary and chat history. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme.hoverBg} ${theme.text} cursor-pointer`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
