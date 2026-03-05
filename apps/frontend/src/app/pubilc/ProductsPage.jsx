import { Banknote, Home, User, CheckCircle, ExternalLink } from "lucide-react";
import { colorVariables } from "../../lib";
import { productsData } from "../../lib/dumyData";

export default function ProductsPage() {

  return (
    <div className="bg-white text-gray-800 font-sans leading-relaxed">
      {/* ===== Hero Section ===== */}
      <section className={`${colorVariables.LIGHT_BG} py-12 text-center`}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Our <span className={colorVariables.PRIMARY_COLOR}>Products</span> and Services
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-base px-4">
          Finova is committed to providing tailored financial solutions for
          micro, small, and medium enterprises (MSMEs) and individuals to
          maximize growth and fulfill personal needs.
        </p>
      </section>

      

      {/* ===== Product Sections (Dynamically Mapped) ===== */}
      <section className="container mx-auto px-4 py-16 space-y-20">
        {productsData.map((product, index) => (
          <div
            key={index}
            className={`grid md:grid-cols-2 gap-12 items-center ${
              index % 2 !== 0 ? "md:grid-cols-2 md:grid-flow-col-dense" : ""
            }`}
          >
            {/* Details Column */}
            <div className={`${index % 2 !== 0 ? "md:col-start-2" : ""}`}>
              <product.icon className={`w-8 h-8 mb-2 ${colorVariables.PRIMARY_COLOR}`} />
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {product.title}
              </h2>

              {/* Key Details List */}
              <ul className="space-y-4 text-gray-700 text-base border-l-4 border-blue-200 pl-4">
                {product.details.map((detail, i) => (
                  <li key={i} className="flex items-start">
                    <span className="font-semibold text-gray-900 w-36 flex-shrink-0">
                      {detail.label}:
                    </span>
                    <span className="text-gray-600">{detail.value}</span>
                  </li>
                ))}
              </ul>

              {/* Interest Rate & Processing Fee Links */}
              <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-white shadow-sm">
                <p className="text-sm text-gray-600 mb-3">
                  {product.note}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className={`flex items-center text-sm font-medium ${colorVariables.PRIMARY_COLOR} hover:underline`}>
                    Rate of Interest Matrix <ExternalLink size={16} className="ml-1" />
                  </a>
                  <a href="#" className={`flex items-center text-sm font-medium ${colorVariables.PRIMARY_COLOR} hover:underline`}>
                    Processing Fee Matrix <ExternalLink size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className={`flex justify-center ${index % 2 !== 0 ? "md:col-start-1" : ""}`}>
              <img
                src={product.image}
                alt={product.title}
                className="rounded-xl shadow-2xl w-full max-w-md object-cover transform hover:scale-[1.02] transition duration-500"
              />
            </div>
          </div>
        ))}
      </section>

      {/* --- */}

      {/* ===== Requirements Section (Blue background for emphasis) ===== */}
      <section className={`${colorVariables.PRIMARY_BG} py-16 px-4 text-white`}>
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">
            Key Prerequisites
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            We have the following general requirements to qualify for a loan:
          </p>
          <ul className="space-y-4 text-white text-base">
            <li>
              <CheckCircle size={20} className="inline-block mr-3 text-yellow-300" />
              <strong className="font-semibold">Business Continuity:</strong> A minimum of **3 years** in the same line of business is required.
            </li>
            <li>
              <CheckCircle size={20} className="inline-block mr-3 text-yellow-300" />
              <strong className="font-semibold">Residence and Office Stability:</strong> Maintained stability in residence and office for at least **3 years**.
            </li>
            <li>
              <CheckCircle size={20} className="inline-block mr-3 text-yellow-300" />
              <strong className="font-semibold">Financial Documentation:</strong> Our dedicated team will assist you in exploring a variety of loan options to match your profile and requirements.
            </li>
          </ul>
          <button className="mt-10 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg">
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
};
