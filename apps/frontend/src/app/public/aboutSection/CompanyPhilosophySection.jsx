import React from 'react';
import { philosophyData } from '../../../lib/dumyData';
import { colorVariables } from '../../../lib';

const CompanyPhilosophySection = () => {
  return (
    <div className="mt-20">
      <h2 className={`text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4`}>
        Our <span className={colorVariables.PRIMARY_COLOR}>Company Philosophy</span>
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        The principles that guide our approach to financial services
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {philosophyData.map((item, index) => {
          const IconComponent = item.icon;
          const bgColor = `bg-${item.color}-50`;
          const textColor = `text-${item.color}-600`;
          
          return (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-xl shadow-lg border-l-4 hover:shadow-xl transition`}
              style={{ borderLeftColor: `var(--${item.color}-500)` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <IconComponent className={`w-6 h-6 ${textColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              </div>
              <p className="text-gray-600">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl text-center">
        <p className="text-gray-700 text-lg italic">
          "At Mascot Projects, our philosophy is simple: combine financial expertise with human understanding 
          to create lending solutions that truly work for our customers."
        </p>
      </div>
    </div>
  );
};

export default CompanyPhilosophySection;