import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const LeadFormModal = ({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div className={`
        bg-white rounded-2xl shadow-2xl w-full ${maxWidth} relative 
        overflow-hidden flex flex-col max-h-[95vh] border border-slate-200 
        animate-in zoom-in-95 duration-200 z-10
      `}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-500 hover:text-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default LeadFormModal;