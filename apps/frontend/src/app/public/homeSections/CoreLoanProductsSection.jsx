import { coreLoanProducts } from '../../../lib/dumyData';

export default function CoreLoanProductsSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Core <span className="text-blue-600">Loan Products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our range of financial products designed to meet your specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {coreLoanProducts.map((loan, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className={`w-12 h-12 bg-${loan.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                <loan.icon className={`w-6 h-6 text-${loan.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{loan.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{loan.desc}</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600"> <span className="font-semibold">Amount:</span> {loan.amount}</p>
                <p className="text-sm text-gray-600"> <span className="font-semibold">Rate:</span> {loan.rate}</p>
                <p className="text-sm text-gray-600"> <span className="font-semibold">Tenure:</span> {loan.tenure}</p>
              </div>
              <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}