import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const StatusModal = ({ isOpen, type = 'success', title, message, onClose }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 z-10">
        
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="rounded-full bg-green-50 p-3 ring-8 ring-green-50/50">
              <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5} />
            </div>
          ) : (
            <div className="rounded-full bg-red-50 p-3 ring-8 ring-red-50/50">
              <XCircle className="w-16 h-16 text-red-500" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Text Content */}
        <h2 className={`text-2xl font-black mb-4 tracking-tight uppercase ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {title || (isSuccess ? 'SUCCESS' : 'ERROR!')}
        </h2>
        
        <div className="space-y-2 mb-8 px-2">
          <p className="text-gray-800 font-bold leading-tight">
            Thank you for your request.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            {message || (isSuccess 
              ? "We are working hard to find the best service and deals for you." 
              : "We are unable to continue the process. Please try again.")}
          </p>
          {isSuccess && (
            <p className="text-gray-400 text-xs italic mt-2">
               Shortly you will find a confirmation in your email
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${
            isSuccess 
              ? 'bg-green-500 hover:bg-green-600 shadow-green-200' 
              : 'bg-red-500 hover:bg-red-600 shadow-red-200'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StatusModal;