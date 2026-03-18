// components/sections/CoreValuesSection.jsx
import { coreValuesDatas } from "../../../lib/dumyData";

export default function CoreValuesSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Our <span className="text-yellow-300">Core Values</span>
        </h2>
        <p className="text-center text-blue-100 mb-8 sm:mb-12 text-sm sm:text-base">
          The principles that guide our journey
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {coreValuesDatas.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="bg-blue-700 p-5 sm:p-6 rounded-xl backdrop-blur-sm bg-opacity-50">
                <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-xs sm:text-sm text-blue-100">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}