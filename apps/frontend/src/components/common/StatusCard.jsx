import React from "react";

const StatusCard = ({ title, value, icon: Icon, colorClass, bgClass, subtext, lastUpdated }) => {
  const formattedDate = lastUpdated ? new Date(lastUpdated).toLocaleString() : null;
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <p className="text-gray-500 text-sm font-medium">{title}</p>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-lg ${bgClass}`}>
          <Icon size={20} className={colorClass} />
        </div>
      </div>
      {formattedDate && <p className="text-xs text-gray-400 mt-4">Last updated: {formattedDate}</p>}
    </div>
  );
};

export default StatusCard;
