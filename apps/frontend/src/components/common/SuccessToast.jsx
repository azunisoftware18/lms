// apps/frontend/src/components/common/SuccessToast.jsx
import { CheckCircle } from "lucide-react";

export const SuccessToast = ({ message, show, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
      <CheckCircle size={17} className="shrink-0" />
      {message}
    </div>
  );
};