import { User, Briefcase, CheckCircle } from "lucide-react";
import { eligibilityData } from "../../../lib/dumyData";

export default function EligibilitySection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Eligibility <span className="text-blue-600">Criteria</span>
        </h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">
          Check if you qualify for a personal loan
        </p>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-gray-50 p-5 sm:p-6 rounded-xl shadow-md">
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <User className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" /> Salaried Individuals
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {eligibilityData.salaried.map((text, index) => (
                <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-5 sm:p-6 rounded-xl shadow-md">
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" /> Self-Employed
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {eligibilityData.selfEmployed.map((text, index) => (
                <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}