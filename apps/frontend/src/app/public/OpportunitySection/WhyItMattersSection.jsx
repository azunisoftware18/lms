// components/sections/opportunity/WhyItMattersSection.jsx
import { TrendingUp, Users, Award } from "lucide-react";
import { opportunityData } from "../../../lib/dumyData";

export default function WhyItMattersSection() {
  // Map icon names to components
  const iconMap = {
    TrendingUp: TrendingUp,
    Users: Users,
    Award: Award
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Why This <span className="text-blue-600">Matters</span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Understanding the impact of MSMEs on India's economic growth
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {opportunityData.whyItMatters.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}