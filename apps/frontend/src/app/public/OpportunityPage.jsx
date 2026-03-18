// pages/opportunity.jsx
import HeroSection from "../public/OpportunitySection/HeroSection";
import MainContentSection from "../public/OpportunitySection/MainContentSection";
import WhyItMattersSection from "../public/OpportunitySection/WhyItMattersSection";
import ChallengeSolutionSection from "../public/OpportunitySection/ChallengeSolutionSection";
import CTASection from "../public/OpportunitySection/CTASection";

export default function OpportunityPage() {
  return (
    <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
      <HeroSection />
      <MainContentSection />
      <WhyItMattersSection />
      <ChallengeSolutionSection />
      <CTASection />
    </div>
  );
}