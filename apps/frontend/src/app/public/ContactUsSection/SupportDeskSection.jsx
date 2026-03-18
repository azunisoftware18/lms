// components/sections/contact/SupportDeskSection.jsx
import { Mail, Phone, Clock } from 'lucide-react';
import { colorVariables } from '../../../lib';
import { contactData } from '../../../lib/dumyData';
import { Link } from 'react-router-dom';

// Icon mapping
const iconMap = {
  Mail: Mail,
  Phone: Phone,
  Clock: Clock
};

export default function SupportDeskSection() {
  return (
    <section className="bg-white py-16 px-6 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Support <span className={colorVariables.PRIMARY_COLOR}>Desk</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated support team is ready to assist you with any queries
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {contactData.supportDesk.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity`}></div>
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-${item.color}-200 transition-colors`}>
                    <IconComponent size={32} className={`text-${item.color}-600`} />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h4>
                  <p className={`text-${item.color}-600 font-medium text-lg mb-3`}>{item.value}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                  {item.link ? (
                    <Link to={item.link} className={`mt-4 inline-block text-sm text-${item.color}-600 hover:text-${item.color}-700 font-medium`}>
                      {item.linkText}
                    </Link>
                  ) : (
                    <div className="mt-4 inline-block text-sm text-purple-600 font-medium">
                      {item.extra}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}