export default function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-16 bg-slate-200 rounded-lg"></div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-40 bg-slate-200 rounded-lg"></div>
        <div className="h-40 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );
}