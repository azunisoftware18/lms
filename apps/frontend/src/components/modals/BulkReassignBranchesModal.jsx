import { useEffect } from "react";
import { X } from "lucide-react";
import BulkReassignBranchesForm from "../forms/BulkReassignBranchesForm";

export default function BulkReassignBranchesModal({
  isOpen,
  onClose,
  branches,
  onSave,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl transition-all duration-300 transform"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full z-20 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="overflow-visible">
            <BulkReassignBranchesForm
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
