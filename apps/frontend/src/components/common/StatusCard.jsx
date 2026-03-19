import React from "react";

const StatusCard = ({ title, value, icon: Icon, colorClass, bgClass }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <p className="text-gray-500 text-sm font-medium">{title}</p>

      <div className="mt-2 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <div className={`p-2 rounded-lg ${bgClass}`}>
          <Icon size={20} className={colorClass} />
        </div>
      </div>
      {/* <p className="text-xs text-gray-400 mt-4">Last updated today</p> */}
    </div>
  );
};

export default StatusCard;
