// components/sections/MissionSection.jsx
import { Target, CheckCircle } from "lucide-react";
import { missionPoints } from "../../../lib/dumyData";

export default function MissionSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          Our <span className="text-blue-600">Mission</span>
        </h2>
        <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg">
          <Target className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4 sm:mb-6" />
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-6 px-2">
            At Mascot Projects Private Limited, our mission is to deliver reliable, transparent, and 
            customer-centric financial solutions that support the evolving needs of individuals and businesses.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 text-left px-2">
            <ul className="space-y-2">
              {missionPoints.left.map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {missionPoints.right.map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}