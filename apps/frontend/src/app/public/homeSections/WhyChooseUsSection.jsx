import { whyChooseUsData } from '../../../lib/dumyData';
import { colorClassMap } from '../../../lib/index';



export default function WhyChooseUsSection() {
  // Use the local colorClassMap directly instead of relying on imports
  const colors = colorClassMap;
  
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">Mascot Projects</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mascot Projects Private Limited stands as a dependable financial partner for customers
            seeking simple, transparent, and reliable lending solutions. Our approach combines financial
            expertise with a strong commitment to customer satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {whyChooseUsData && whyChooseUsData.length > 0 ? (
            whyChooseUsData.map((item, index) => {
              // Safe access with multiple fallbacks
              const colorKey = item?.color || 'blue';
              const colorClass = colors[colorKey] || colors.blue;
              
              // Debug log
              console.log(`Item ${index}:`, { colorKey, colorClass, item });
              
              return (
                <div 
                  key={index} 
                  className={`${colorClass.bg} p-6 rounded-xl hover:shadow-lg transition-all duration-300 group`}
                >
                  <div className={`w-14 h-14 ${colorClass.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon && <item.icon className="w-7 h-7 text-white" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title || 'Title'}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description || 'Description'}</p>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>

        {/* Summary Banner */}
        <div className="mt-12 bg-linear-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl text-center max-w-4xl mx-auto shadow-lg">
          <p className="text-xl font-medium tracking-wide">
            RBI Registered • Customer-Centric • Quick Processing • Transparent • Flexible • Compliant
          </p>
        </div>
      </div>
    </section>
  );
}