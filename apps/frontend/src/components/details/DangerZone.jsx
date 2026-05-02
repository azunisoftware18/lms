// apps/frontend/src/components/details/DangerZone.jsx
import { AlertCircle, LogOut } from "lucide-react";
import { Card } from "../common/Card";
import { SectionHeader } from "../common/SectionHeader";

export const DangerZone = ({ onDeactivate }) => {
  return (
    <Card className="border-red-100">
      <SectionHeader icon={AlertCircle} title="Danger Zone" />
      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">Deactivate Account</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Disabling your account will revoke all active sessions and access.
          </p>
        </div>
        <button 
          onClick={onDeactivate}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all shrink-0"
        >
          <LogOut size={14} /> Deactivate
        </button>
      </div>
    </Card>
  );
};