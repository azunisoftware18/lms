import React from 'react';
import { X } from 'lucide-react';
import LoginForm from '../forms/LoginForm';

const LoginFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-auto"
        onClick={handleContentClick}
      >
        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <LoginForm />

        </div>
      </div>
    </div>
  );
};

export default LoginFormModal;