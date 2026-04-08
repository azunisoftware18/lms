import React from "react";

const StatusCard = ({
  title,
  value,
  
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
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-36 flex flex-col justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            {typeof percent === "number" && (
              <p className="text-xs text-gray-400 mt-1">{percent}% of total</p>
            )}
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
          </div>
          <div className={`p-2 rounded-lg ${bgClass}`}>
            <Icon size={20} className={colorClass} />
          </div>
        </div>
      </div>
      {formattedDate && (
        <p className="text-xs text-gray-400 mt-2">
          Last updated: {formattedDate}
        </p>
      )}
    </div>
  );
};

export default StatusCard;
