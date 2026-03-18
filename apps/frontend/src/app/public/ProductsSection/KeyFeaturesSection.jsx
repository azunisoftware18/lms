// components/sections/KeyFeaturesSection.jsx
import { keyFeaturesData } from "../../../lib/dumyData";

export default function KeyFeaturesSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Key <span className="text-blue-600">Features</span>
        </h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">
          Why choose our personal loan
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {keyFeaturesData.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="p-5 sm:p-6 bg-white border rounded-xl hover:shadow-lg transition">
                <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}