import { coreValuesData } from '../../../lib/dumyData';
import { colorVariables } from '../../../lib';

const colorMap = {
  blue: 'border-blue-500 bg-blue-100 text-blue-600',
  green: 'border-green-500 bg-green-100 text-green-600',
  purple: 'border-purple-500 bg-purple-100 text-purple-600',
  yellow: 'border-yellow-500 bg-yellow-100 text-yellow-600',
  orange: 'border-orange-500 bg-orange-100 text-orange-600'
};

const CoreValuesSection = () => {
  return (
    <div className="mt-20">
      <h2 className={`text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4`}>
        Our <span className={colorVariables.PRIMARY_COLOR}>Core Values</span>
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        The principles that guide everything we do at Mascot Projects
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coreValuesData.map((value, index) => {
          const IconComponent = value.icon;
          const bgColor = `bg-${value.color}-100`;
          const textColor = `text-${value.color}-600`;
          
          return (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition border-t-4 ${
                index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
              style={{ borderTopColor: `var(--${value.color}-500)` }}
            >
              <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
                <IconComponent className={`w-7 h-7 ${textColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-gray-700 font-medium">
          <span className="font-bold text-blue-600">
            {coreValuesData.map(v => v.title).join(' • ')}
          </span> — 
          These values define who we are and how we serve our customers.
        </p>
      </div>
    </div>
  );
};

export default CoreValuesSection;