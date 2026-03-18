// components/sections/method/InnovativeApproachSection.jsx
import { colorVariables } from '../../../lib';
import { methods, methodHighlights } from '../../../lib/dumyData';
import { Zap, Shield, Target, Search, Users, TrendingUp, Clock, FileText, IndianRupee, Award } from 'lucide-react';

// Define fallback icons in case the imported ones are undefined
const fallbackIcons = {
  Zap: Zap,
  Shield: Shield,
  Target: Target,
  Search: Search,
  Users: Users,
  TrendingUp: TrendingUp,
  Clock: Clock,
  FileText: FileText,
  IndianRupee: IndianRupee,
  Award: Award
};

export default function InnovativeApproachSection() {
  // Safely check if data exists
  const safeMethodHighlights = methodHighlights || [];
  const safeMethods = methods || [];

  // If no data, show a message
  if (safeMethodHighlights.length === 0 && safeMethods.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="text-center text-gray-500">No data available</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our <span className={colorVariables.PRIMARY_COLOR}>Innovative Approach</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We've developed a radically different method to serve the MSME sector effectively
        </p>
      </div>

      {/* Highlights Cards */}
      {safeMethodHighlights.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {safeMethodHighlights.map((item, index) => {
            // Get the icon component, use fallback if undefined
            const IconComponent = item.icon || fallbackIcons.Zap;
            
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title || 'Title'}</h3>
                <p className="text-sm text-gray-600">{item.desc || 'Description'}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Method Grid */}
      {safeMethods.length > 0 && (
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h3 className="text-2xl font-bold text-center">
              Key Challenges We've Solved
            </h3>
          </div>
          
          <div className="p-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeMethods.map((item, index) => {
                // Get the icon component, use fallback if undefined
                const IconComponent = item.icon || fallbackIcons[Object.keys(fallbackIcons)[index % 10]];
                
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition duration-300 group"
                  >
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl ${colorVariables.PRIMARY_BG} bg-opacity-10 group-hover:bg-opacity-20 transition flex-shrink-0`}>
                      {IconComponent && <IconComponent className={`${colorVariables.PRIMARY_COLOR}`} size={24} />}
                    </div>

                    {/* Text Content */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {item.title || 'Title'}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.desc || 'Description'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}