// pages/personal-loan.jsx

import HeroSection from "../public/ProductsSection/HeroSection";
import WhyChooseSection from "../public/ProductsSection/WhyChooseSection";
import ProductOverviewSection from "../public/ProductsSection/ProductOverviewSection";
import EligibilitySection from "../public/ProductsSection/EligibilitySection";
import KeyFeaturesSection from "../public/ProductsSection/KeyFeaturesSection";
import DocumentsSection from "../public/ProductsSection/DocumentsSection";
import CoreValuesSection from "../public/ProductsSection/CoreValuesSection";
import MissionSection from "../public/ProductsSection/MissionSection";
import LoanProcessSection from "../public/ProductsSection/LoanProcessSection";
import ApplyNowSection from "../public/ProductsSection/ApplyNowSection";


export default function PersonalLoanPage() {
  return (
    <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
      <HeroSection />
      <WhyChooseSection/>
      <ProductOverviewSection />
      <EligibilitySection />
      <KeyFeaturesSection />
      <DocumentsSection />
      <CoreValuesSection />
      <MissionSection />
      <LoanProcessSection />
      <ApplyNowSection />
    </div>
  );
}