import { keyPillars } from '../../../lib/dumyData';
import { colorVariables } from '../../../lib';

const KeyPillarsSection = () => {
  return (
    <div className="mt-20 pt-8 border-t border-gray-200">
      <h3 className="text-center text-2xl font-bold text-gray-900 mb-8">
        Our Core Strengths
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        {keyPillars.map((pillar, i) => {
          const IconComponent = pillar.icon;
          return (
            <div
              key={i}
              className="p-6 border rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <IconComponent
                className={`w-8 h-8 mb-3 ${colorVariables.PRIMARY_COLOR}`}
              />
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {pillar.title}
              </h4>
              <p className="text-gray-600 text-sm">{pillar.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyPillarsSection;