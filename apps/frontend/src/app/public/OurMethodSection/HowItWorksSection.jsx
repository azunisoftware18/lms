// components/sections/method/HowItWorksSection.jsx
import { colorVariables } from '../../../lib';
import { methodSteps } from '../../../lib/dumyData';

export default function HowItWorksSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          How Our <span className={colorVariables.PRIMARY_COLOR}>Method Works</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {methodSteps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                {step.number}
              </div>
              <h3 className="font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}