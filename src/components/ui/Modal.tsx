import { useEffect, useId, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-sage-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white dark:bg-sage-900 rounded-2xl shadow-2xl shadow-sage-950/40 dark:shadow-sage-950/80 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-sage-700/50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-sage-800">
          <div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-sage-400 to-sage-500 rounded-full mb-2" />
            <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-sage-50">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-sage-200 hover:bg-gray-100 dark:hover:bg-sage-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
export default Modal;
