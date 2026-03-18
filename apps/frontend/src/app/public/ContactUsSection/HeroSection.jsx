import { Headset, ChevronRight } from 'lucide-react';
import { colorVariables } from '../../../lib';
import { contactData } from '../../../lib/dumyData';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="pt-12 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30 -ml-32 -mb-32"></div>
      
      <div className="container mx-auto text-center mb-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight size={14} />
          <span className="text-blue-600 font-medium">Contact Us</span>
        </div>
        
        {/* Main Header Icon */}
        <Headset
          className={`w-16 h-16 mx-auto mb-4 ${colorVariables.PRIMARY_COLOR} animate-bounce`}
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {contactData.hero.title.split(' ')[0]}{' '}
          <span className={colorVariables.PRIMARY_COLOR}>
            {contactData.hero.title.split(' ')[1]}
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {contactData.hero.subtitle}
        </p>
      </div>
    </div>
  );
}