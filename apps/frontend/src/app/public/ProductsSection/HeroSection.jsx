import { ArrowRight } from "lucide-react";
import { colorVariables } from "../../../lib/index";
import Button from "../../../components/ui/Button";

export default function HeroSection() {
  return (
    <section className={`${colorVariables.LIGHT_BG} py-12 sm:py-16 px-4 sm:px-6 lg:px-8`}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Mascot Projects Private Limited
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              Personal <span className={colorVariables.PRIMARY_COLOR}>Loan</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-6 max-w-2xl mx-auto lg:mx-0">
              Fulfill your dreams with our flexible personal loans. Quick approval, 
              minimal documentation, and attractive interest rates. As an RBI-registered 
              NBFC, we ensure transparent and responsible lending.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button variant="primary" size="md" icon={<ArrowRight size={16} />} iconPosition="right">
                Apply Now
              </Button>
              <Button variant="secondary" size="md">
                Calculate EMI
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center mt-6 lg:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Personal Loan"
              className="rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}