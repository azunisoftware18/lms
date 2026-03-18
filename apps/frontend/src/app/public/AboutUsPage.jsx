import VisionSection from './aboutSection/VisionSection';
import CompanyOverviewSection from './aboutSection/CompanyOverviewSection';
import MissionSection from './aboutSection/MissionSection';
import CoreValuesSection from './aboutSection/CoreValuesSection';
import CompanyPhilosophySection from '../public/aboutSection/CompanyPhilosophySection';
import ComplianceSection from './aboutSection/ComplianceSection';
import KeyPillarsSection from './aboutSection/KeyPillarsSection';
import ChairmanMessageSection from './aboutSection/ChairmanMessageSection';

export default function AboutUsPage() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 py-16">
      <CompanyOverviewSection />
      <VisionSection />
      <MissionSection />
      <CoreValuesSection />
      <ChairmanMessageSection />
      <CompanyPhilosophySection />
      <ComplianceSection />
      <KeyPillarsSection />
    </section>
  );
}