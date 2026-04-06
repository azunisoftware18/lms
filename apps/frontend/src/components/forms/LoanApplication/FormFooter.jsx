import React from "react";
import { ChevronLeft, ChevronRight, Save, Trash2, X } from "lucide-react";
import Button from "../../ui/Button";

export default function FormFooter({
  currentStep,
  currentIdx,
  steps,
  onPrev,
  onClose,
  onSaveDraft,
  onClearDraft,
  onNext,
}) {
  if (currentStep === "review") {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200">
      <Button
        type="button"
        onClick={onPrev}
        disabled={currentIdx === 0}
        className={`bg-white! text-slate-600! border border-slate-200 hover:bg-slate-50! shadow-none! ${currentIdx === 0 ? "opacity-40! cursor-not-allowed!" : ""}`}
      >
        <ChevronLeft size={15} /> Previous
      </Button>
      <button
        onClick={onClose}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
      >
        <X size={16} />
        Close
      </button>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onSaveDraft}
          className="bg-amber-50! text-amber-700! border border-amber-200 hover:bg-amber-100! shadow-none! text-sm!"
        >
          <Save size={14} /> Save Draft
        </Button>
        <Button
          type="button"
          onClick={onClearDraft}
          className="bg-red-50! text-red-700! border border-red-200 hover:bg-red-100! shadow-none! text-sm!"
        >
          <Trash2 size={14} /> Clear Draft
        </Button>
        <Button type="button" onClick={onNext} className="text-sm!">
          {currentIdx === steps.length - 2 ? "Review & Submit" : "Next"}{" "}
          <ChevronRight size={15} />
        </Button>
      </div>
    </div>
  );
}
