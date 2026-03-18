// components/sections/contact/WhyContactSection.jsx
import { Clock, Shield, Users } from 'lucide-react';
import { contactData } from '../../../lib/dumyData';

// Icon mapping
const iconMap = {
  Clock: Clock,
  Shield: Shield,
  Users: Users
};

export default function WhyContactSection() {
  return (
    <section className="container mx-auto px-6 pb-12">
      <div className="grid md:grid-cols-3 gap-6">
        {contactData.whyContact.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 text-center"
            >
              <div className={`w-16 h-16 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className={`w-8 h-8 text-${item.color}-600`} />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}