// components/sections/method/HeroSection.jsx
import { Link } from 'react-router-dom';
import { colorVariables } from '../../../lib';
import { companyInfo, methodStats } from '../../../lib/dumyData';
import { TrendingUp, Users, BarChart } from 'lucide-react'; // Import fallback icons

// Fallback icon mapping in case icons are undefined
const fallbackIcons = {
  TrendingUp: TrendingUp,
  Users: Users,
  BarChart: BarChart
};

export default function HeroSection() {
  // Ensure methodStats exists and has data
  const safeMethodStats = methodStats || [];
  
  return (
    <section className="relative py-16 px-6 md:px-10 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -ml-48 -mb-48"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">Our Method</span>
        </div>

        {/* Company Badge */}
        <div className="text-center mb-8">
          <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {companyInfo?.name || 'Mascot Projects'} - {companyInfo?.type || 'RBI Registered NBFC'}
          </span>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Our{' '}
            <span className={colorVariables.PRIMARY_COLOR}>
              Innovative Method
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At {companyInfo?.shortName || 'Mascotfin'}, we understand that every industry within the MSME sector
            has unique needs and challenges. We address this diversity through a
            customized approach and financial innovation.
          </p>
        </div>

        {/* Stats Section */}
        {safeMethodStats.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12">
            {safeMethodStats.map((stat, index) => {
              // Check if icon exists, otherwise use fallback
              const IconComponent = stat.icon || fallbackIcons[Object.keys(fallbackIcons)[index % 3]];
              const colorClass = stat.color ? `text-${stat.color}-600` : 'text-blue-600';
              
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                  {IconComponent && <IconComponent className={`w-8 h-8 mx-auto mb-3 ${colorClass}`} />}
                  <div className={`text-2xl md:text-3xl font-bold ${colorClass} mb-2`}>
                    {stat.value || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label || ''}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">No stats available</div>
        )}
      </div>
    </section>
  );
}