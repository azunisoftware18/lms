// components/common/SectionHeader.jsx
export const SectionHeader = ({ icon: Icon, title, action }) => (
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