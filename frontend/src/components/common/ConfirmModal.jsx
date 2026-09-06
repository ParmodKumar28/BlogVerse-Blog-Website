import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-md w-full p-6 space-y-4">
        
        {/* Warning Icon & Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 font-serif-editorial">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-50 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;
