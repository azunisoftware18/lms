import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-visible animate-in zoom-in-95 duration-200 border border-slate-100">
        

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
