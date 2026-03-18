// components/sections/method/WhyItMattersSection.jsx
import { economicImpactData, employmentData } from '../../../lib/dumyData';

export default function WhyItMattersSection() {
  const EconomicIcon = economicImpactData.icon;
  const EmploymentIcon = employmentData.icon;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Economic Impact */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <EconomicIcon className="w-6 h-6 text-blue-600" />
            {economicImpactData.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {economicImpactData.description}
          </p>
          <ul className="space-y-2">
            {economicImpactData.points.map((point, index) => {
              const PointIcon = point.icon;
              return (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <PointIcon className="w-4 h-4 text-green-500" />
                  <span>{point.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Employment Generation */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <EmploymentIcon className="w-6 h-6 text-blue-600" />
            {employmentData.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {employmentData.description}
          </p>
          <ul className="space-y-2">
            {employmentData.points.map((point, index) => {
              const PointIcon = point.icon;
              return (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <PointIcon className="w-4 h-4 text-green-500" />
                  <span>{point.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}