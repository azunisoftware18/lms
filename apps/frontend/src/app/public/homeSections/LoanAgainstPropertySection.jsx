import { Star, Heart, CheckCircle, IndianRupee, Percent, Calendar, Home, Building } from 'lucide-react';
import { loanProductsData } from '../../../lib/dumyData';
import Button from '../../../components/ui/Button';
import LeadFormModal from '../../../components/modals/LeadFormModal';
import { useState } from 'react';

export default function LoanAgainstPropertySection() {
  const data = loanProductsData.lap;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="py-16 md:py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className={`w-20 h-20 bg-${data.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <data.icon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loan Against <span className={`text-${data.color}-600`}>Property</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {data.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Key Features */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className={`w-6 h-6 text-${data.color}-600`} />
                Key Features
              </h3>
              <ul className="space-y-4">
                {data.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 text-${data.color}-500 flex-shrink-0 mt-0.5`} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Choose */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building className={`w-6 h-6 text-${data.color}-600`} />
                Property-Backed Lending
              </h3>
              <p className="text-gray-700 mb-4">
                {data.whyChoose}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className={`text-center p-3 bg-${data.color}-50 rounded-lg`}>
                  <IndianRupee className={`w-6 h-6 text-${data.color}-600 mx-auto mb-1`} />
                  <span className="text-sm font-medium">{data.details.amount}</span>
                </div>
                <div className={`text-center p-3 bg-${data.color}-50 rounded-lg`}>
                  <Percent className={`w-6 h-6 text-${data.color}-600 mx-auto mb-1`} />
                  <span className="text-sm font-medium">{data.details.rate}</span>
                </div>
                <div className={`text-center p-3 bg-${data.color}-50 rounded-lg`}>
                  <Calendar className={`w-6 h-6 text-${data.color}-600 mx-auto mb-1`} />
                  <span className="text-sm font-medium">{data.details.tenure}</span>
                </div>
                <div className={`text-center p-3 bg-${data.color}-50 rounded-lg`}>
                  <Home className={`w-6 h-6 text-${data.color}-600 mx-auto mb-1`} />
                  <span className="text-sm font-medium">{data.details.value}</span>
                </div>
              </div>
              
              {/* Replaced button with Button component */}
              <Button
                onClick={handleApplyClick}
                variant="primary"
                size="lg"
                className={`w-full mt-6 bg-${data.color}-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition`}
              >
                Apply for Loan Against Property
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productType="lap"
        productName={data.title}
      />
    </>
  );
}