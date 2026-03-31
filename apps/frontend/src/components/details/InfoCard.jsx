export default function InfoCard({
  label,
  value,
  fallback,
  icon,
  fullWidth,
}) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl shadow-sm p-4 ${
        fullWidth ? "col-span-full" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-slate-500">{label}</p>
      </div>

      <p className="text-sm font-medium text-slate-800">
        {value || fallback || "—"}
      </p>
    </div>
  );
}