// apps/frontend/src/components/details/QuickInfoCard.jsx
import { BadgeCheck, Clock, Shield } from "lucide-react";
import { Card } from "../common/Card";
import { SectionHeader } from "../common/SectionHeader";
import { RoleBadge } from "../common/RoleBadge";

export const QuickInfoCard = ({ joinedAt, lastLogin, role }) => {
  const infoItems = [
    { label: "Joined", value: joinedAt, icon: BadgeCheck },
    { label: "Last Login", value: lastLogin, icon: Clock },
    { label: "Role", value: <RoleBadge role={role} size="sm" />, icon: Shield },
  ];

  return (
    <Card>
      <SectionHeader icon={Clock} title="Account Info" />
      <div className="px-6 py-4 space-y-4">
        {infoItems.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Icon size={14} className="text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
              <div className="text-xs font-semibold text-slate-700 truncate">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};