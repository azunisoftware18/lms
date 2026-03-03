import { Zap, Shield, Repeat, Landmark, Map, CreditCard } from "lucide-react";

export default function OurMethodPage() {
 
  const PRIMARY_COLOR = "text-blue-600";
  const PRIMARY_BG = "bg-blue-600";
  const LIGHT_BG = "bg-gray-50";

  
  const methods = [
    {
      title: "Absence of Credit History",
      icon: CreditCard,
      desc: "Many MSMEs lack a well-established credit history. We recognize this and use alternative methods to assess creditworthiness and provide necessary financial support.",
    },
    {
      title: "Detailed Cash Flow Analysis",
      icon: Zap,
      desc: "Understanding and analyzing the cash flow of an MSME is crucial. We conduct detailed cash flow analysis at the customer's doorstep to gain a comprehensive financial understanding.",
    },
    {
      title: "Seasonality of Every Business",
      icon: Repeat,
      desc: "Seasonal fluctuations in business revenue are accommodated. We structure our offerings to align with seasonal cash flow requirements accordingly.",
    },
    {
      title: "Variety of Collaterals",
      icon: Shield,
      desc: "MSMEs may have unique collaterals that don't fit traditional models. We have a flexible approach that accepts a wide range of assets for securing financing.",
    },
    {
      title: "Poor Banking Practices",
      icon: Landmark,
      desc: "MSMEs often face difficulties due to outdated banking practices and complex procedures. We strive to simplify the process and provide efficient, hassle-free solutions.",
    },
    {
      title: "Properties in Rural Areas",
      icon: Map,
      desc: "Many MSMEs operate in rural areas where documentation differs. Our understanding of rural dynamics helps us navigate these challenges and tailor financial solutions.",
    },
  ];

  return (
    <div className={`py-16 px-6 md:px-10 ${LIGHT_BG} text-gray-800`}>
      <div className="max-w-7xl mx-auto">
        
        {/* ===== Title and Introduction Section ===== */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-extrabold text-gray-900 mb-4`}>
            Our <span className={PRIMARY_COLOR}>Innovative Method</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At Finova, we understand that every industry within the MSME sector has unique needs and challenges. We address this diversity through a customized approach and financial innovation.
          </p>
        </div>

        {/* --- */}

        {/* ===== Key Challenges/Methods Grid ===== */}
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-blue-100">
            <div className="text-center mb-10">
                <p className="text-lg font-semibold text-gray-700">
                    We've identified and developed solutions for the key challenges that <span className={PRIMARY_COLOR}>MSMEs encounter</span>:
                </p>
            </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {methods.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition duration-300">
                
                {/* Icon */}
                <div className={`p-2 rounded-full ${PRIMARY_BG} flex-shrink-0 shadow-md`}>
                    <item.icon className="text-white" size={20} />
                </div>
                
                {/* Text Content */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* --- */}

        {/* ===== Conclusion Text (CTA Style) ===== */}
        <div className="max-w-5xl mx-auto mt-16 p-8 text-center bg-blue-100 rounded-xl shadow-lg border border-blue-300 space-y-4">
          <h4 className="text-2xl font-bold text-gray-900">
            Harnessing Challenges, Driving Growth
          </h4>
          <p className="text-gray-700 leading-relaxed">
            To overcome these market challenges and create value for our clients, we deploy **Financial Innovations** and cutting-edge techniques. Our commitment to continuous innovation allows us to develop **effective strategies** that support the growth and success of MSMEs.
          </p>
          <button className={`mt-4 text-white px-6 py-3 rounded-lg font-semibold transition ${PRIMARY_BG} hover:bg-blue-700 shadow-md`}>
            Explore Our Solutions
          </button>
        </div>
      </div>
    </div>
  );
}