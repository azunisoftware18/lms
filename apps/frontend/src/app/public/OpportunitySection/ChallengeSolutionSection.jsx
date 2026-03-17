// components/sections/opportunity/ChallengeSolutionSection.jsx
import { opportunityData } from "../../../lib/dumyData";

export default function ChallengeSolutionSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Challenge Card */}
          <div className="bg-red-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-red-700 mb-4">The Challenge</h3>
            <ul className="space-y-4">
              {opportunityData.challengePoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">•</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-green-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-green-700 mb-4">Our Solution</h3>
            <ul className="space-y-4">
              {opportunityData.solutionPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}