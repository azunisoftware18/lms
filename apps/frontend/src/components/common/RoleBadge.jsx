// components/common/RoleBadge.jsx
export const ROLE_META = {
  ADMIN:    { label: "Admin",    cls: "bg-violet-50 text-violet-700 ring-violet-200",  dot: "bg-violet-500"  },
  EMPLOYEE: { label: "Employee", cls: "bg-blue-50   text-blue-700   ring-blue-200",    dot: "bg-blue-500"    },
  PARTNER:  { label: "Partner",  cls: "bg-amber-50  text-amber-700  ring-amber-200",   dot: "bg-amber-500"   },
};

export const RoleBadge = ({ role, size = "md", className = "" }) => {
  const meta = ROLE_META[role] ?? ROLE_META.EMPLOYEE;
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm"
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ${meta.cls} ${sizeClasses[size]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
};