export default function InfoCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon size={18} className="text-blue-600" />}
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        </div>
      )}

      {children}
    </div>
  );
}