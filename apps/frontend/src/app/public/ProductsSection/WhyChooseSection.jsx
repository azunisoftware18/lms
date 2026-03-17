// components/sections/WhyChooseSection.jsx
import { whyChooseData } from "../../../lib/dumyData";

export default function WhyChooseSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Why Choose <span className="text-blue-600">Mascot Projects</span>
        </h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Your trusted financial partner for transparent and reliable lending solutions
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {whyChooseData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="p-5 sm:p-6 text-center border rounded-xl hover:shadow-lg transition">
                <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="font-bold text-base sm:text-lg mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Company Description */}
        <div className="mt-8 sm:mt-12 bg-blue-50 p-5 sm:p-8 rounded-xl">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Mascot Projects Private Limited is a trusted RBI-registered Non-Banking Financial Company (NBFC) 
            headquartered in Jaipur, committed to providing accessible and responsible financial solutions to 
            individuals, entrepreneurs, and businesses. With a strong focus on customer convenience and transparent 
            lending practices, we help customers unlock financial opportunities and achieve their personal and 
            business goals.
          </p>
        </div>
      </div>
    </section>
  );
}