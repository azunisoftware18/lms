// components/sections/opportunity/MainContentSection.jsx
import { dumyImg, opportunityData } from "../../../lib/dumyData";
import { TrendingUp, Building2, Users, Target, IndianRupee } from "lucide-react";

export default function MainContentSection() {
  // Map icon names to components
  const iconMap = {
    Building2: Building2,
    Users: Users,
    Target: Target,
    IndianRupee: IndianRupee
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Image with Highlights */}
          <div className="space-y-6">
            <div className="relative">
              <img
                src={dumyImg.LAP}
                alt="MSME Opportunity"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl hidden lg:block">
                <TrendingUp className="w-12 h-12 mb-2" />
                <p className="text-2xl font-bold">₹3 Trillion</p>
                <p className="text-sm">Unmet Finance Gap</p>
              </div>
            </div>

            {/* Highlights Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {opportunityData.highlights.map((highlight, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm text-gray-700">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            {opportunityData.content.map((item, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {item.text}
              </p>
            ))}

            {/* Key Points Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
              {opportunityData.keyPoints.map((point, index) => {
                const IconComponent = iconMap[point.icon];
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`bg-${point.color}-100 p-2 rounded-lg`}>
                      <IconComponent className={`w-5 h-5 text-${point.color}-600`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{point.value}</p>
                      <p className="text-xs text-gray-600">{point.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}