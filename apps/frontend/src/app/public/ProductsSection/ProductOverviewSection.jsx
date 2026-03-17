import { productOverviewData } from "../../../lib/dumyData";

export default function ProductOverviewSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Product <span className="text-blue-600">Overview</span>
        </h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
          Understanding your needs and providing the right financial solution
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {productOverviewData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className={`p-5 sm:p-6 border rounded-xl text-center bg-white ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 bg-blue-600 p-5 sm:p-6 rounded-xl text-white">
          <p className="text-center text-sm sm:text-base">
            Our Personal Loan is designed to meet your immediate financial needs - whether it's 
            a dream wedding, medical emergency, higher education, or a memorable vacation. 
            Get funds credited to your account within 24 hours of approval.
          </p>
        </div>
      </div>
    </section>
  );
}