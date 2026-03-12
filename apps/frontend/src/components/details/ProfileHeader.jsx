export default function ProfileHeader({ name, subtitle, image, onImageClick }) {
  const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex items-center gap-5 p-2 mb-8">
      <div className="relative group">
        {image ? (
          <img
            src={image}
            alt={name}
            onClick={onImageClick}
            className="h-20 w-20 rounded-2xl border-2 border-white shadow-md object-cover cursor-pointer ring-4 ring-slate-50 transition-transform active:scale-95"
          />
        ) : (
          <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {initials || <User size={32} />}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-4 border-white rounded-full"></div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 leading-none">{name}</h1>
        <p className="text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}