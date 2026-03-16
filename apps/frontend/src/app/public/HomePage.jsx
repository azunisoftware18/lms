// Import all section components
import HeroSection from '../../app/public/homeSections/HeroSection';
import CommitmentSection from '../../app/public/homeSections/CommitmentSection';
import VisionSection from '../../app/public/homeSections/VisionSection';
import MissionSection from '../../app/public/homeSections/MissionSection';
import CoreValuesSection from '../../app/public/homeSections/CoreValuesSection';
import WhyChooseUsSection from '../../app/public/homeSections/WhyChooseUsSection';
import PersonalLoanSection from '../../app/public/homeSections/PersonalLoanSection';
import LoanAgainstPropertySection from '../../app/public/homeSections/LoanAgainstPropertySection';
import SecuredBusinessLoanSection from '../../app/public/homeSections/SecuredBusinessLoanSection';
import FairPracticesSection from '../../app/public/homeSections/FairPracticesSection';
import GrievanceSection from '../../app/public/homeSections/GrievanceSection';
import CoreLoanProductsSection from '../../app/public/homeSections/CoreLoanProductsSection';
import CompanyStrengthSection from '../../app/public/homeSections/CompanyStrengthSection';
import LoanProcessSection from '../../app/public/homeSections/LoanProcessSection';
import TestimonialsSection from '../../app/public/homeSections/TestimonialsSection';
import CTASection from '../../app/public/homeSections/CTASection';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <HeroSection />
      <hr className="border-gray-100" />
      
      <CommitmentSection />
      <hr className="border-gray-100" />
      
      <VisionSection />
      <hr className="border-gray-100" />
      
      <MissionSection />
      <hr className="border-gray-100" />
      
      <CoreValuesSection />
      <hr className="border-gray-100" />
      
      <WhyChooseUsSection />
      <hr className="border-gray-100" />
      
      <PersonalLoanSection />
      <hr className="border-gray-100" />
      
      <LoanAgainstPropertySection />
      <hr className="border-gray-100" />
      
      <SecuredBusinessLoanSection />
      <hr className="border-gray-100" />
      
      <FairPracticesSection />
      <hr className="border-gray-100" />
      
      <GrievanceSection />
      <hr className="border-gray-100" />
      
      <CoreLoanProductsSection />
      <hr className="border-gray-100" />
      
      <CompanyStrengthSection />
      <hr className="border-gray-100" />
      
      <LoanProcessSection />
      <hr className="border-gray-100" />
      
      <TestimonialsSection />
      <hr className="border-gray-100" />
      
      <CTASection />
    </div>
  );
}