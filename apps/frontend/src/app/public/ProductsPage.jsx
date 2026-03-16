import { 
  User, 
  CheckCircle, 
  FileText, 
  Clock, 
  Percent, 
  DollarSign,
  Calendar,
  Shield,
  ArrowRight,
  Home,
  Briefcase,
  CreditCard,
  IndianRupee,
  FileCheck,
  Search,
  ThumbsUp,
  Banknote,
  ClipboardList
} from "lucide-react";
import { colorVariables } from "../../lib";

export default function PersonalLoanPage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* ===== Hero Section ===== */}
      <section className={`${colorVariables.LIGHT_BG} py-16 px-4`}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Personal <span className={colorVariables.PRIMARY_COLOR}>Loan</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Fulfill your dreams with our flexible personal loans. Quick approval, 
                minimal documentation, and attractive interest rates.
              </p>
              <div className="flex gap-4">
                <button className={`${colorVariables.PRIMARY_BUTTON_COLOR} text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2`}>
                  Apply Now <ArrowRight size={18} />
                </button>
                <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
                  Calculate EMI
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Personal Loan"
                className="rounded-xl shadow-2xl max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Product Overview ===== */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Product <span className={colorVariables.PRIMARY_COLOR}>Overview</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Understanding your needs and providing the right financial solution
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl text-center">
              <IndianRupee className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Loan Amount</h3>
              <p className="text-gray-600">₹50,000 to ₹25,00,000</p>
            </div>
            <div className="p-6 border rounded-xl text-center">
              <Percent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Interest Rate</h3>
              <p className="text-gray-600">Starting from 10.99% p.a.</p>
            </div>
            <div className="p-6 border rounded-xl text-center">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Tenure</h3>
              <p className="text-gray-600">12 to 84 months</p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-xl">
            <p className="text-gray-700">
              Our Personal Loan is designed to meet your immediate financial needs - whether it's 
              a dream wedding, medical emergency, higher education, or a memorable vacation. 
              Get funds credited to your account within 24 hours of approval.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Eligibility Criteria ===== */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Eligibility <span className={colorVariables.PRIMARY_COLOR}>Criteria</span>
          </h2>
          <p className="text-center text-gray-600 mb-12">Check if you qualify for a personal loan</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="text-blue-600" /> Salaried Individuals
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Age: 21 to 60 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Minimum monthly income: ₹25,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Minimum 2 years of work experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>At least 1 year with current employer</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="text-blue-600" /> Self-Employed
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Age: 25 to 65 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Minimum annual income: ₹3,00,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Business continuity: 3+ years</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>ITR filed for last 2 years</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Key Features ===== */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Key <span className={colorVariables.PRIMARY_COLOR}>Features</span>
          </h2>
          <p className="text-center text-gray-600 mb-12">Why choose our personal loan</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Quick Approval", desc: "Loan approved within 24 hours" },
              { icon: FileText, title: "Minimal Documentation", desc: "Simple document submission process" },
              { icon: Percent, title: "Competitive Rates", desc: "Attractive interest rates starting 10.99%" },
              { icon: Calendar, title: "Flexible Tenure", desc: "Choose repayment period up to 7 years" },
              { icon: Shield, title: "No Collateral", desc: "Unsecured loan, no security required" },
              { icon: IndianRupee, title: "High Loan Amount", desc: "Get up to ₹25 Lakhs" }
            ].map((feature, index) => (
              <div key={index} className="p-6 border rounded-xl hover:shadow-lg transition">
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Documents Required ===== */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Documents <span className={colorVariables.PRIMARY_COLOR}>Required</span>
          </h2>
          <p className="text-center text-gray-600 mb-12">Simple documentation for quick processing</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Identity Proof (Any One)</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"> Aadhaar Card</li>
                <li className="flex items-center gap-2"> PAN Card</li>
                <li className="flex items-center gap-2"> Voter ID</li>
                <li className="flex items-center gap-2"> Passport</li>
                <li className="flex items-center gap-2"> Driving License</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Address Proof (Any One)</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"> Aadhaar Card</li>
                <li className="flex items-center gap-2"> Passport</li>
                <li className="flex items-center gap-2"> Utility Bills (Electricity/Water)</li>
                <li className="flex items-center gap-2"> Rental Agreement</li>
                <li className="flex items-center gap-2"> Bank Statement with address</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Income Proof (Salaried)</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"> Last 3 months salary slips</li>
                <li className="flex items-center gap-2"> Last 6 months bank statements</li>
                <li className="flex items-center gap-2"> Form 16 for last 2 years</li>
                <li className="flex items-center gap-2"> Employment ID card</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Income Proof (Self-Employed)</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"> Last 2 years ITR with computation</li>
                <li className="flex items-center gap-2"> Last 6 months bank statements</li>
                <li className="flex items-center gap-2"> Business registration proof</li>
                <li className="flex items-center gap-2"> GST registration (if applicable)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Loan Process - 5 Steps ===== */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple <span className={colorVariables.PRIMARY_COLOR}>Loan Process</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Get your personal loan in 5 simple steps. Fast, transparent, and hassle-free.
          </p>

          <div className="relative">
            {/* Timeline connector line - hidden on mobile */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-blue-200 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {/* Step 1: Submit Loan Application */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                  <ClipboardList className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 mb-1">Submit Application</h3>
                  <p className="text-sm text-gray-600">
                    Fill our simple online application form with your basic details
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    ⏱️ 5-10 minutes
                  </div>
                </div>
              </div>

              {/* Step 2: Document Verification */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                  <FileCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 mb-1">Document Verification</h3>
                  <p className="text-sm text-gray-600">
                    Upload required documents for quick verification
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    ⏱️ 24-48 hours
                  </div>
                </div>
              </div>

              {/* Step 3: Credit Assessment */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                  <Search className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 mb-1">Credit Assessment</h3>
                  <p className="text-sm text-gray-600">
                    We evaluate your creditworthiness and repayment capacity
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    ⏱️ 24-48 hours
                  </div>
                </div>
              </div>

              {/* Step 4: Loan Approval */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                  <ThumbsUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 mb-1">Loan Approval</h3>
                  <p className="text-sm text-gray-600">
                    Receive loan approval with final terms and conditions
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    ⏱️ Instant
                  </div>
                </div>
              </div>

              {/* Step 5: Loan Disbursement */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                  <span className="text-white font-bold text-xl">5</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md w-full border-2 border-green-200">
                  <Banknote className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 mb-1">Loan Disbursement</h3>
                  <p className="text-sm text-gray-600">
                    Funds credited directly to your bank account
                  </p>
                  <div className="mt-2 text-xs text-green-600 font-semibold">
                    ⏱️ Within 24 hours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Timeline Summary */}
          <div className="mt-12 bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Total Processing Time: <span className="text-blue-600">3-5 Working Days</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-500" /> Paperless Process
              </span>
              <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-500" /> Track Application Online
              </span>
              <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-500" /> Dedicated Relationship Manager
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Apply Now Section ===== */}
      <section className={`${colorVariables.BORDER_COLOR} py-16 px-4 text-white`}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Ready to Apply?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Get your personal loan approved within 24 hours. Apply now and fulfill your dreams!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Apply for Personal Loan
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold  text-blue-600 transition">
              Talk to Advisor
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
            <span className="flex items-center gap-1"> No Hidden Charges</span>
            <span className="flex items-center gap-1"> Quick Approval</span>
            <span className="flex items-center gap-1"> Minimal Documentation</span>
            <span className="flex items-center gap-1"> 100% Digital Process</span>
          </div>
        </div>
      </section>
    </div>
  );
}