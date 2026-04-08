import React from "react";

const StatusCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  subtext,
  lastUpdated,
  percent,
}) => {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleString()
    : null;
  return (
    <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-auto md:h-36 flex flex-col justify-between gap-1.5">
      <div>
        <p className="text-gray-500 text-xs md:text-sm font-medium truncate">
          {title}
        </p>

        <div className="mt-2 md:mt-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
              {value}
            </h3>
            {typeof percent === "number" && (
              <p className="text-[11px] md:text-xs text-gray-400 mt-1">
                {percent}% of total
              </p>
            )}
            {subtext && (
              <p className="text-[11px] md:text-xs text-gray-400 mt-1 truncate">
                {subtext}
              </p>
            )}
          </div>
          <div className={`p-1.5 md:p-2 rounded-lg shrink-0 ${bgClass}`}>
            <Icon size={18} className={colorClass} />
          </div>
        </div>
      </div>
      {formattedDate && (
        <p className="text-xs text-gray-400 mt-1 hidden sm:block">
          Last updated: {formattedDate}
        </p>
      )}
    </div>
  );
};

export default StatusCard;
