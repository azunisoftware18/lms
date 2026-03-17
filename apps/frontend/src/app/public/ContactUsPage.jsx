// pages/contact-us.jsx
import { colorVariables } from '../../lib/index';
import HeroSection from '../public/ContactUsSection/HeroSection';
import WhyContactSection from '../public/ContactUsSection/WhyContactSection';
import OfficeSection from '../public/ContactUsSection/OfficeSection';
import EnquiryFormSection from '../public/ContactUsSection/EnquiryFormSection';
import SupportDeskSection from '../public/ContactUsSection/SupportDeskSection';
import QuickContactBar from '../public/ContactUsSection/QuickContactBar';

export default function ContactUsPage() {
  return (
    <div
      id="contact"
      className={`font-sans text-gray-800 min-h-screen ${colorVariables.LIGHT_BG}`}>
      <HeroSection />
      <WhyContactSection />
      <OfficeSection />
      <EnquiryFormSection />
      <SupportDeskSection />
      <QuickContactBar />
    </div>
  );
}