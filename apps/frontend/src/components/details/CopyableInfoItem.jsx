import { Copy } from "lucide-react";

export default function CopyableInfoItem({ label, value, icon: Icon }) {
  const copy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase">{label}</span>

      <div className="flex items-center gap-2 text-slate-800 font-medium">
        {Icon && <Icon size={16} className="text-slate-400" />}
        {value}

        <button
          onClick={copy}
          className="text-slate-400 hover:text-slate-700"
        >
          <Copy size={14} />
        </button>
      </div>
    </div>
  );
}