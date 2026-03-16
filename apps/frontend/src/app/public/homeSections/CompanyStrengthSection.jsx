import { CheckCircle, Award } from 'lucide-react';
import { companyStrengthData } from '../../../lib/dumyData';

export default function CompanyStrengthSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-10">
          Our <span className="text-blue-600">Company Strength</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {companyStrengthData.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Accreditations</h3>
            <ul className="space-y-2">
              {companyStrengthData.accreditations.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Awards & Recognition</h3>
            <ul className="space-y-2">
              {companyStrengthData.awards.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}