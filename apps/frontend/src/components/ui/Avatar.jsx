// components/ui/Avatar.jsx
import { useRef } from "react";
import { Camera } from "lucide-react";

export const Avatar = ({ fullName, onAvatarChange }) => {
  const avatarRef = useRef(null);
  const initials = (name) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="relative mb-4">
      <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200 select-none">
        {initials(fullName)}
      </div>
      <button
        onClick={() => avatarRef.current?.click()}
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
        title="Change avatar"
      >
        <Camera size={14} />
      </button>
      <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
    </div>
  );
};