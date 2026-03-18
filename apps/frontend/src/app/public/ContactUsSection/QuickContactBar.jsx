// components/sections/contact/QuickContactBar.jsx
import { Phone, Mail, Clock } from 'lucide-react';
import { colorVariables } from '../../../lib';
import { contactData } from '../../../lib/dumyData';

// Icon mapping
const iconMap = {
  Phone: Phone,
  Mail: Mail,
  Clock: Clock
};

export default function QuickContactBar() {
  return (
    <section className={`${colorVariables.PRIMARY_BG} py-6`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-">
          {contactData.quickContact.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            return (
              <span key={index} className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <IconComponent size={14} className="text-blue-600" />
                </div>
                {item.text}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}