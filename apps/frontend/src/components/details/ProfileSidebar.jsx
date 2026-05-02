// components/details/ProfileSidebar.jsx
import { Card } from "../common/Card";
import { Avatar } from "../ui/Avatar";
import { RoleBadge } from "../common/RoleBadge";
import { ActiveStatusToggle } from "../common/ActiveStatusToggle";
import { QuickInfoCard } from "./QuickInfoCard";

export const ProfileSidebar = ({ user, onToggleStatus, onAvatarChange }) => {
  return (
    <div className="flex flex-col gap-5">
      <Card className="p-6 flex flex-col items-center text-center">
        <Avatar fullName={user.fullName} onAvatarChange={onAvatarChange} />
        <h2 className="text-base font-black text-slate-800 mb-1">{user.fullName}</h2>
        <p className="text-xs text-slate-500 mb-3">@{user.userName}</p>
        <RoleBadge role={user.role} size="md" className="mb-4" />
        <ActiveStatusToggle isActive={user.isActive} onToggle={onToggleStatus} />
      </Card>
      
      <QuickInfoCard 
        joinedAt={user.joinedAt}
        lastLogin={user.lastLogin}
        role={user.role}
      />
    </div>
  );
};