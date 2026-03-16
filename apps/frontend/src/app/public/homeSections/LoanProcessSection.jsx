import { ArrowRight, FileText, CheckCircle, ThumbsUp, DollarSign } from 'lucide-react';
import { loanProcessSteps } from '../../../lib/dumyData';

export default function LoanProcessSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4">
          Simple <span className="text-blue-600">Loan Application</span> Process
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Get your loan approved in just 4 simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loanProcessSteps.map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              {index < 3 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}