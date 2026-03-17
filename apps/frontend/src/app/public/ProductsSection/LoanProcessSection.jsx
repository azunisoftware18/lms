// components/sections/LoanProcessSection.jsx
import { CheckCircle } from "lucide-react";
import { loanProcessData, processHighlightsData } from "../../../lib/dumyData";

export default function LoanProcessSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Simple <span className="text-blue-600">Loan Process</span>
        </h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Get your personal loan in 5 simple steps. Fast, transparent, and hassle-free.
        </p>

        <div className="relative">
          {/* Timeline connector line - hidden on mobile and tablet */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-blue-200 z-0"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 relative z-10">
            {loanProcessData.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${step.bg} rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg border-4 border-white`}>
                    <span className="text-white font-bold text-base sm:text-lg lg:text-xl">{step.num}</span>
                  </div>
                  <div className={`bg-white p-3 sm:p-4 rounded-lg shadow-md w-full ${step.num === 5 ? 'border-2 border-green-200' : ''}`}>
                    <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${step.num === 5 ? 'text-green-600' : 'text-blue-600'} mx-auto mb-2`} />
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-600 hidden sm:block">{step.desc}</p>
                    <div className={`mt-1 sm:mt-2 text-xs font-semibold ${step.num === 5 ? 'text-green-600' : 'text-gray-500'}`}>
                      ⏱️ {step.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 sm:mt-12 bg-blue-50 p-4 sm:p-6 rounded-xl">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
            Total Processing Time: <span className="text-blue-600">3-5 Working Days</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            {processHighlightsData.map((text, i) => (
              <span key={i} className="flex items-center gap-1 bg-white px-2 sm:px-3 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}