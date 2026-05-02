// apps/frontend/src/components/forms/ProfileForm.jsx
import { Edit3, Save, X, User, AtSign, Mail, Phone, Shield, AlertCircle } from "lucide-react";
import { Card } from "../common/Card";
import { SectionHeader } from "../common/SectionHeader";
import { EditableField } from "../ui/EditableField";
import { RoleBadge } from "../common/RoleBadge";

export const ProfileForm = ({ user, draft, editing, errors, onEdit, onCancel, onSave, onFieldChange }) => {
  return (
    <Card>
      <SectionHeader
        icon={Edit3}
        title="Profile Details"
        action={
          editing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <X size={13} /> Cancel
              </button>
              <button
                onClick={onSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
              >
                <Save size={13} /> Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition"
            >
              <Edit3 size={13} /> Edit
            </button>
          )
        }
      />

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <EditableField
            label="Full Name" icon={User} value={editing ? draft.fullName : user.fullName}
            editing={editing} onChange={onFieldChange("fullName")} error={errors.fullName}
          />
          <EditableField
            label="Username" icon={AtSign} value={editing ? draft.userName : user.userName}
            editing={editing} onChange={onFieldChange("userName")} error={errors.userName}
          />
          <EditableField
            label="Email Address" icon={Mail} value={editing ? draft.email : user.email}
            editing={editing} onChange={onFieldChange("email")} error={errors.email}
            containerClassName="sm:col-span-2"
          />
          <EditableField
            label="Contact Number" icon={Phone} value={editing ? draft.contactNumber : user.contactNumber}
            editing={editing} onChange={onFieldChange("contactNumber")} error={errors.contactNumber}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <Shield size={15} className="text-slate-400 shrink-0" />
              <RoleBadge role={user.role} />
              <span className="text-[10px] text-slate-400 ml-auto">Assigned by admin</span>
            </div>
          </div>
        </div>

        {editing && (
          <p className="mt-4 text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertCircle size={11} />
            Changes won't be applied until you click Save Changes.
          </p>
        )}
      </div>
    </Card>
  );
};