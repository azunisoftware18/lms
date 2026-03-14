import { useState, useRef } from "react";
import {
  User, Mail, Lock, Phone, AtSign, Shield, Camera,
  CheckCircle, AlertCircle, Eye, EyeOff, Edit3,
  Save, X, BadgeCheck, Clock, Key, UserCog,
  Building2, ChevronRight, LogOut, Bell, Fingerprint,
  RefreshCw, ToggleLeft, ToggleRight,
} from "lucide-react";

// ─── Mock current user (matches your createUserSchema shape) ─────────────────
const MOCK_USER = {
  fullName:      "Aditya Sharma",
  email:         "aditya.sharma@loansphere.in",
  userName:      "aditya_sharma",
  contactNumber: "+91 98765 43210",
  role:          "ADMIN",
  isActive:      true,
  joinedAt:      "12 Jan 2024",
  lastLogin:     "Today, 10:42 AM",
  avatar:        null, // no image — initials fallback
};

const ROLE_META = {
  ADMIN:    { label: "Admin",    cls: "bg-violet-50 text-violet-700 ring-violet-200",  dot: "bg-violet-500"  },
  EMPLOYEE: { label: "Employee", cls: "bg-blue-50   text-blue-700   ring-blue-200",    dot: "bg-blue-500"    },
  PARTNER:  { label: "Partner",  cls: "bg-amber-50  text-amber-700  ring-amber-200",   dot: "bg-amber-500"   },
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const initials = (name) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-blue-50 rounded-lg">
        <Icon size={15} className="text-blue-600" />
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </div>
    {action}
  </div>
);

// ─── Field with inline edit ───────────────────────────────────────────────────
function EditableField({ label, value, icon: Icon, type = "text", editing, onChange, error, hint, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${editing ? "text-blue-500" : "text-slate-400"}`}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={!editing || disabled}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all outline-none
            ${Icon ? "pl-10" : "pl-4"}
            ${!editing || disabled
              ? "bg-slate-50 border-slate-200 text-slate-700 cursor-default"
              : error
              ? "bg-white border-red-400 focus:ring-4 focus:ring-red-100 text-slate-900"
              : "bg-white border-blue-400 focus:ring-4 focus:ring-blue-500/10 text-slate-900"
            }`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}

// ─── Password field ───────────────────────────────────────────────────────────
function PasswordField({ label, value, onChange, error, hint }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
          <Lock size={16} />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Enter new password"
          className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm outline-none transition-all
            ${error
              ? "border-red-400 focus:ring-4 focus:ring-red-100"
              : "border-blue-400 bg-white focus:ring-4 focus:ring-blue-500/10"
            } text-slate-900`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN — Profile
// ══════════════════════════════════════════════════════════════════════════════
export default function Profile() {
  const [user, setUser]       = useState(MOCK_USER);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({ ...MOCK_USER });
  const [errors, setErrors]   = useState({});
  const [saved, setSaved]     = useState(false);

  // Password section
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaved, setPwSaved] = useState(false);

  const avatarRef = useRef(null);

  // ── Draft helpers ─────────────────────────────────────────────────────────
  const set = (key) => (e) => setDraft((p) => ({ ...p, [key]: e.target.value }));
  const setPw = (key) => (e) => setPwForm((p) => ({ ...p, [key]: e.target.value }));

  // ── Validate against your updateUserSchema rules ──────────────────────────
  const validateProfile = () => {
    const e = {};
    if (draft.fullName.trim().length < 1) e.fullName = "Full name is required.";
    if (!/\S+@\S+\.\S+/.test(draft.email)) e.email = "Valid email is required.";
    if (draft.userName.trim().length < 1)  e.userName = "Username is required.";
    if (draft.contactNumber.trim().length < 1) e.contactNumber = "Contact number is required.";
    return e;
  };

  const validatePassword = () => {
    const e = {};
    if (!pwForm.current)              e.current = "Current password is required.";
    if (pwForm.next.length < 8)       e.next    = "Must be at least 8 characters.";
    if (pwForm.next.length > 128)     e.next    = "Must not exceed 128 characters.";
    if (pwForm.next !== pwForm.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSaveProfile = () => {
    const e = validateProfile();
    if (Object.keys(e).length) { setErrors(e); return; }
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
    if (Object.keys(e).length) { setPwErrors(e); return; }
    setPwForm({ current: "", next: "", confirm: "" });
    setPwErrors({});
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  };

  const roleMeta = ROLE_META[user.role] ?? ROLE_META.EMPLOYEE;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── Page heading ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <UserCog size={18} className="text-blue-600" />
            <h1 className="text-xl font-black text-slate-800 tracking-tight">My Profile</h1>
          </div>
          <p className="text-sm text-slate-500">Manage your account details and security settings.</p>
        </div>

        {/* ── Success toasts ────────────────────────────────────────────────── */}
        {saved && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
            <CheckCircle size={17} className="shrink-0" />
            Profile updated successfully!
          </div>
        )}
        {pwSaved && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
            <CheckCircle size={17} className="shrink-0" />
            Password changed successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ════════════════════════════════════════════════════════════════
              LEFT COLUMN  — Avatar card + quick info
          ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* Avatar card */}
            <Card className="p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200 select-none">
                  {initials(user.fullName)}
                </div>
                {/* Upload overlay */}
                <button
                  onClick={() => avatarRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
                  title="Change avatar"
                >
                  <Camera size={14} />
                </button>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" />
              </div>

              {/* Name + role */}
              <h2 className="text-base font-black text-slate-800 mb-1">{user.fullName}</h2>
              <p className="text-xs text-slate-500 mb-3">@{user.userName}</p>

              {/* Role badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${roleMeta.cls} mb-4`}>
                <span className={`w-1.5 h-1.5 rounded-full ${roleMeta.dot}`} />
                {roleMeta.label}
              </span>

              {/* Active status toggle */}
              <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                  <span className="text-xs font-semibold text-slate-700">
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  onClick={() => setUser((p) => ({ ...p, isActive: !p.isActive }))}
                  className={`transition-colors ${user.isActive ? "text-emerald-500 hover:text-emerald-700" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {user.isActive
                    ? <ToggleRight size={26} strokeWidth={1.8} />
                    : <ToggleLeft  size={26} strokeWidth={1.8} />
                  }
                </button>
              </div>
            </Card>

            {/* Quick info card */}
            <Card>
              <SectionHeader icon={Clock} title="Account Info" />
              <div className="px-6 py-4 space-y-4">
                {[
                  { label: "Joined",     value: user.joinedAt,  icon: BadgeCheck },
                  { label: "Last Login", value: user.lastLogin, icon: Clock      },
                  { label: "Role",       value: roleMeta.label, icon: Shield     },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                      <p className="text-xs font-semibold text-slate-700 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT COLUMN — Edit profile + Change password
          ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* ── Edit Profile card ───────────────────────────────────────── */}
            <Card>
              <SectionHeader
                icon={Edit3}
                title="Profile Details"
                action={
                  editing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                      >
                        <X size={13} /> Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
                      >
                        <Save size={13} /> Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setDraft({ ...user }); setEditing(true); }}
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
                    editing={editing} onChange={set("fullName")} error={errors.fullName}
                  />
                  <EditableField
                    label="Username" icon={AtSign} value={editing ? draft.userName : user.userName}
                    editing={editing} onChange={set("userName")} error={errors.userName}
                  />
                  <EditableField
                    label="Email Address" icon={Mail} value={editing ? draft.email : user.email}
                    editing={editing} onChange={set("email")} error={errors.email}
                    containerClassName="sm:col-span-2"
                  />
                  <EditableField
                    label="Contact Number" icon={Phone} value={editing ? draft.contactNumber : user.contactNumber}
                    editing={editing} onChange={set("contactNumber")} error={errors.contactNumber}
                  />
                  {/* Role — display only, not editable by user */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</label>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <Shield size={15} className="text-slate-400 shrink-0" />
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${roleMeta.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${roleMeta.dot}`} />
                        {roleMeta.label}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto">Assigned by admin</span>
                    </div>
                  </div>
                </div>

                {/* Unsaved changes hint */}
                {editing && (
                  <p className="mt-4 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <AlertCircle size={11} />
                    Changes won't be applied until you click Save Changes.
                  </p>
                )}
              </div>
            </Card>

            {/* ── Change Password card ─────────────────────────────────────── */}
            <Card>
              <SectionHeader icon={Key} title="Change Password" />
              <div className="px-6 py-5 space-y-4">
                {/* Validation rules banner */}
                <div className="flex flex-wrap gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {[
                    { label: "Min 8 chars",   ok: pwForm.next.length >= 8   },
                    { label: "Max 128 chars",  ok: pwForm.next.length <= 128 && pwForm.next.length > 0 },
                    { label: "Passwords match", ok: pwForm.next === pwForm.confirm && pwForm.next.length > 0 },
                  ].map(({ label, ok }) => (
                    <div key={label} className={`flex items-center gap-1.5 text-[11px] font-semibold ${ok ? "text-emerald-600" : "text-slate-400"}`}>
                      {ok
                        ? <CheckCircle size={12} className="text-emerald-500" />
                        : <div className="w-3 h-3 rounded-full border-2 border-slate-300" />
                      }
                      {label}
                    </div>
                  ))}
                </div>

                <PasswordField
                  label="Current Password"
                  value={pwForm.current}
                  onChange={setPw("current")}
                  error={pwErrors.current}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordField
                    label="New Password"
                    value={pwForm.next}
                    onChange={setPw("next")}
                    error={pwErrors.next}
                    hint="8–128 characters"
                  />
                  <PasswordField
                    label="Confirm New Password"
                    value={pwForm.confirm}
                    onChange={setPw("confirm")}
                    error={pwErrors.confirm}
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSavePassword}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-200 transition-all active:scale-95"
                  >
                    <Fingerprint size={15} /> Update Password
                  </button>
                </div>
              </div>
            </Card>

            {/* ── Danger zone ──────────────────────────────────────────────── */}
            <Card className="border-red-100">
              <SectionHeader icon={AlertCircle} title="Danger Zone" />
              <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Deactivate Account</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Disabling your account will revoke all active sessions and access.
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all shrink-0">
                  <LogOut size={14} /> Deactivate
                </button>
              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}