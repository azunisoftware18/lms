// pages/our-method.jsx
import { colorVariables } from '../../lib';
import HeroSection from '../public/OurMethodSection/HeroSection';
import ChallengeSection from '../public/OurMethodSection/ChallengeSection';
import InnovativeApproachSection from '../public/OurMethodSection/InnovativeApproachSection';
import HowItWorksSection from '../public/OurMethodSection/HowItWorksSection';
import WhyItMattersSection from '../public/OurMethodSection/WhyItMattersSection';
import CTASection from '../public/OurMethodSection/CTASection';

export default function OurMethodPage() {
  return (
    <div className={`font-sans text-gray-800 min-h-screen ${colorVariables.LIGHT_BG} overflow-x-hidden`}>
      <HeroSection />
      <ChallengeSection />
      <InnovativeApproachSection />
      <HowItWorksSection />
      <WhyItMattersSection />
      <CTASection />
    </div>
  );
}