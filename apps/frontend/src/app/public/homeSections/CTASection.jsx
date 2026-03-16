export default function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-blue-600">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to Fulfill Your Dreams?
        </h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
          Apply for a loan today and get approval within 24 hours. 
          Our experts are here to help you every step of the way.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg">
            Apply for Loan Now
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition">
            Talk to Loan Expert
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center text-white text-sm">
          <span className="flex items-center gap-1"> No Hidden Charges</span>
          <span className="flex items-center gap-1"> Quick Approval</span>
          <span className="flex items-center gap-1"> Minimal Documentation</span>
        </div>
      </div>
    </section>
  );
}