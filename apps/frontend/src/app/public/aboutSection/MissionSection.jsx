import { Target } from 'lucide-react';
import { missionData } from '../../../lib/dumyData';
import { colorVariables } from '../../../lib';

const MissionSection = () => {
  return (
    <div className="mt-20">
      <h2 className={`text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4`}>
        Our <span className={colorVariables.PRIMARY_COLOR}>Mission</span>
      </h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        {missionData.subtitle}
      </p>

      <div className="bg-green-50 p-8 md:p-10 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">At Mascot Projects Private Limited, our mission is to:</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {missionData.points.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionSection;