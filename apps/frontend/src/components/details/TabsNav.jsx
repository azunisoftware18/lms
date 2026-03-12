export default function TabsNav({ tabs, active, setActive }) {
  return (
    <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 pb-3 text-sm font-semibold transition-all relative whitespace-nowrap
              ${isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            {tab}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.4)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}