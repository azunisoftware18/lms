// components/sections/ApplyNowSection.jsx
import { benefitsDatas } from "../../../lib/dumyData";
import Button from "../../../components/ui/Button";

export default function ApplyNowSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white">Ready to Apply?</h2>
        <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg px-4">
          Get your personal loan approved within 24 hours. Apply now and fulfill your dreams!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Button variant="white" size="lg">
            Apply for Personal Loan
          </Button>
          <Button variant="outline" size="lg">
            Talk to Advisor
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm text-blue-100 px-4">
          {benefitsDatas.map((text, i) => (
            <span key={i} className="flex items-center gap-1">✓ {text}</span>
          ))}
        </div>
        <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-blue-200 px-4">
          <p>Mascot Projects Private Limited - RBI Registered NBFC</p>
          <p className="mt-1">Headquartered in Jaipur | Trusted Financial Partner Since Establishment</p>
        </div>
      </div>
    </section>
  );
}''