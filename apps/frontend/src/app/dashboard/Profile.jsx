// apps/frontend/src/app/profile/page.jsx
"use client";

import { useState } from "react";
import { UserCog } from "lucide-react";

// Import all components with correct paths from src/components/
import { Card } from "../../components/common/Card";
import { SectionHeader } from "../../components/common/SectionHeader";
import { SuccessToast } from "../../components/common/SuccessToast";
import { RoleBadge } from "../../components/common/RoleBadge";
import { ActiveStatusToggle } from "../../components/common/ActiveStatusToggle";
import { Avatar } from "../../components/ui/Avatar";
import { EditableField } from "../../components/ui/EditableField";
import { PasswordField } from "../../components/ui/PasswordField";
import { ProfileForm } from "../../components/forms/ProfileForm";
import { ChangePasswordForm } from "../../components/forms/ChangePasswordForm";
import { ProfileSidebar } from "../../components/details/ProfileSidebar";
import { QuickInfoCard } from "../../components/details/QuickInfoCard";
import { PasswordValidationRules } from "../../components/details/PasswordValidationRules";
import { DangerZone } from "../../components/details/DangerZone";

// ─── Mock current user ─────────────────────────────────────────────────────
const MOCK_USER = {
  fullName:      "Aditya Sharma",
  email:         "aditya.sharma@loansphere.in",
  userName:      "aditya_sharma",
  contactNumber: "+91 98765 43210",
  role:          "ADMIN",
  isActive:      true,
  joinedAt:      "12 Jan 2024",
  lastLogin:     "Today, 10:42 AM",
  avatar:        null,
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — Profile Page
// ═══════════════════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const [user, setUser] = useState(MOCK_USER);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...MOCK_USER });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Password section
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaved, setPwSaved] = useState(false);

  // ── Draft helpers ─────────────────────────────────────────────────────────
  const handleFieldChange = (key) => (e) => setDraft((p) => ({ ...p, [key]: e.target.value }));
  const handlePasswordFieldChange = (key) => (e) => setPwForm((p) => ({ ...p, [key]: e.target.value }));

  // ── Validation functions ──────────────────────────────────────────────────
  const validateProfile = () => {
    const e = {};
    if (draft.fullName.trim().length < 1) e.fullName = "Full name is required.";
    if (!/\S+@\S+\.\S+/.test(draft.email)) e.email = "Valid email is required.";
    if (draft.userName.trim().length < 1) e.userName = "Username is required.";
    if (draft.contactNumber.trim().length < 1) e.contactNumber = "Contact number is required.";
    return e;
  };

  const validatePassword = () => {
    const e = {};
    if (!pwForm.current) e.current = "Current password is required.";
    if (pwForm.next.length < 8) e.next = "Must be at least 8 characters.";
    if (pwForm.next.length > 128) e.next = "Must not exceed 128 characters.";
    if (pwForm.next !== pwForm.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveProfile = () => {
    const e = validateProfile();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setUser({ ...draft });
    setEditing(false);
    setErrors({});
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancelEdit = () => {
    setDraft({ ...user });
    setErrors({});
    setEditing(false);
  };

  const handleSavePassword = () => {
    const e = validatePassword();
    if (Object.keys(e).length) {
      setPwErrors(e);
      return;
    }
    setPwForm({ current: "", next: "", confirm: "" });
    setPwErrors({});
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  };

  const handleToggleStatus = () => {
    setUser((p) => ({ ...p, isActive: !p.isActive }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Avatar file:", file);
      // Add your avatar upload logic here
    }
  };

  const handleDeactivate = () => {
    console.log("Deactivate account");
    // Add your deactivation logic here
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <UserCog size={18} className="text-blue-600" />
            <h1 className="text-xl font-black text-slate-800 tracking-tight">My Profile</h1>
          </div>
          <p className="text-sm text-slate-500">Manage your account details and security settings.</p>
        </div>

        {/* Success toasts */}
        <SuccessToast message="Profile updated successfully!" show={saved} />
        <SuccessToast message="Password changed successfully!" show={pwSaved} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT COLUMN */}
          <ProfileSidebar 
            user={user}
            onToggleStatus={handleToggleStatus}
            onAvatarChange={handleAvatarChange}
          />

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <ProfileForm
              user={user}
              draft={draft}
              editing={editing}
              errors={errors}
              onEdit={() => {
                setDraft({ ...user });
                setEditing(true);
              }}
              onCancel={handleCancelEdit}
              onSave={handleSaveProfile}
              onFieldChange={handleFieldChange}
            />

            <ChangePasswordForm
              form={pwForm}
              errors={pwErrors}
              onFieldChange={handlePasswordFieldChange}
              onSave={handleSavePassword}
            />

            <DangerZone onDeactivate={handleDeactivate} />
          </div>
        </div>
      </main>
    </div>
  );
}