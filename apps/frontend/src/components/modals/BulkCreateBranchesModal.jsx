import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import BulkCreateBranchesForm from "../forms/BulkCreateBranchesForm";

export default function BulkCreateBranchesModal({
  isOpen,
  onClose,
  branches,
  onSave,
}) {
  const previousFocusRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      previousFocusRef.current = document.activeElement;
      // Move focus to close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "unset";
      // Restore focus to previous element when modal closes
      previousFocusRef.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl transition-all duration-300 transform"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full z-20 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="overflow-visible">
            <BulkCreateBranchesForm
              branches={branches}
              onSave={onSave}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
