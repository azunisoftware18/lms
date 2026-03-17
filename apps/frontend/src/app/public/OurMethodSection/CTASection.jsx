// components/sections/method/CTASection.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { companyInfo } from '../../../lib/dumyData';

export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white text-center">
        <h4 className="text-3xl md:text-4xl font-bold mb-4">
          Harnessing Challenges, Driving Growth
        </h4>
        <p className="text-blue-100 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
          To overcome these market challenges and create value for our clients, we deploy 
          <span className="font-bold text-white"> Financial Innovations </span> 
          and cutting-edge techniques. Our commitment to continuous innovation allows us to 
          develop <span className="font-bold text-white">effective strategies</span> that support 
          the growth and success of MSMEs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="white" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
            Explore Our Solutions
          </Button>
          <Link to="/contact-us">
            <Button variant="outline" size="lg">
              Talk to Our Experts
            </Button>
          </Link>
        </div>

        {/* Company Info */}
        <div className="mt-8 pt-8 border-t border-blue-400">
          <p className="text-sm text-blue-200">
            {companyInfo.name} - {companyInfo.type} | Headquartered in {companyInfo.headquarters}
          </p>
          <p className="text-xs text-blue-300 mt-2">
            {companyInfo.mission}
          </p>
        </div>
      </div>
    </section>
  );
}