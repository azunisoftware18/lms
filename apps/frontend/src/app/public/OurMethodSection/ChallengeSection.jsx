// components/sections/method/ChallengeSection.jsx
import { CheckCircle } from 'lucide-react';
import { colorVariables } from '../../../lib';
import { challengeData } from '../../../lib/dumyData';

export default function ChallengeSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bridging the <span className="text-yellow-300">Finance Gap</span>
            </h2>
            <p className="text-blue-100 text-lg mb-6">
              India's MSME sector faces a significant challenge with an unmet finance gap of ₹3 trillion, 
              affecting over 55 million micro enterprises. Traditional lenders struggle to assess the 
              informal and undocumented income structures prevalent in this sector.
            </p>
            <div className="flex flex-wrap gap-4">
              {challengeData.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">{stat.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">The "Missing Middle"</h3>
            <ul className="space-y-3">
              {challengeData.missingMiddlePoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-yellow-300 font-bold">•</span>
                  <span className="text-blue-100">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}