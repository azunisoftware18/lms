import { Scale } from 'lucide-react';

import { fairPracticesData } from '../../../lib/dumyData';

export default function FairPracticesSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fair <span className="text-blue-600">Practices Code</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {fairPracticesData.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <p className="text-gray-700 text-lg mb-8 text-center italic">
              "{fairPracticesData.objective}"
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Key <span className="text-blue-600">Principles</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {fairPracticesData.principles.map((principle, index) => (
                <div key={index} className={`bg-${principle.color}-50 p-6 rounded-xl hover:shadow-md transition`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-${principle.color}-600 rounded-lg flex items-center justify-center`}>
                      <principle.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{principle.title}</h4>
                  </div>
                  <p className="text-gray-700">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>

            {/* FPC Summary */}
            <div className="mt-8 bg-blue-600 text-white p-6 rounded-xl text-center">
              <p className="text-lg font-medium">
                Committed to Fair, Transparent & Responsible Lending Practices
              </p>
              <p className="text-blue-200 mt-2 text-sm">
                In accordance with RBI guidelines for NBFCs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}