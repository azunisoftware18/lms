// components/sections/opportunity/HeroSection.jsx
import { opportunityData } from "../../../lib/dumyData";
import { colorVariables } from "../../../lib";

export default function HeroSection() {
  return (
    <section className={`${colorVariables.LIGHT_BG} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Mascot Projects Private Limited
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-4 mb-4">
            {opportunityData.title}
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {opportunityData.subtitle}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {opportunityData.stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
              <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}