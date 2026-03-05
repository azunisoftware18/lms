import { DollarSign, Shield, } from "lucide-react";
import FinovaLogo from "../../assets/finova_logo.avif"; 

export default function OurInvestorsPage() {
  const PRIMARY_COLOR = "text-blue-600";
  const LIGHT_BG = "bg-gray-50";

  const investorsData = [
    {
      name: "Peak XV Partners",
      logoSrc: FinovaLogo,
      description:
        "Peak XV Partners (formerly Sequoia Capital India) is a leading venture capital firm supporting various sectors across Southeast Asia and India. They have over 50 years of operations in the region.",
      tag: "Venture Capital",
    },
    {
      name: "Faering Capital",
      logoSrc: FinovaLogo,
      description:
        "Faering Capital is a leading mid-market private equity firm with an entrepreneurial ethos. The firm was founded by industry veterans and focuses on a proprietary, sector-focused investment approach.",
      tag: "Private Equity",
    },
    {
      name: "Norwest Venture Partners",
      logoSrc: FinovaLogo,
      description:
        "Norwest Venture Partners is a multi-stage investment firm managing more than $15.5 Billion in capital with a focus across consumer, enterprise, and healthcare sectors globally.",
      tag: "Multi-Stage Fund",
    },
    {
      name: "Maj Invest",
      logoSrc: FinovaLogo,
      description:
        "Maj Invest is a Danish asset management company with about EUR 13 billion under management, providing services to asset management and private equity funds with headquarters in Copenhagen, Denmark.",
      tag: "Asset Management",
    },
    {
      name: "Sofina Ventures",
      logoSrc: FinovaLogo,
      description:
        "Sofina is a global investment company listed on Euronext Brussels. Sofina’s mission is to partner with leading entrepreneurs and families, driving sustainable growth through conviction and long-term support.",
      tag: "Global Investor",
    },
    {
      name: "Avaatar Ventures",
      logoSrc: FinovaLogo,
      description:
        "Avaatar is a growth-stage, tech-focused investment fund partnering with brilliant founder-led businesses looking to disrupt markets globally. They focus on businesses leveraging deep technology and innovation.",
      tag: "Growth Stage Fund",
    },
    {
      name: "Madison India Capital",
      logoSrc: FinovaLogo,
      description:
        "Madison India Capital is a leading private equity firm focused on the Indian market. They focus on effective capital partnerships with their portfolio companies and co-investors.",
      tag: "Indian PE",
    },
  ];

  return (
    <div className={`py-16 px-4 ${LIGHT_BG} font-sans`}>
      <div className="max-w-7xl mx-auto">
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
          <DollarSign className={`w-10 h-10 mx-auto mb-3 ${PRIMARY_COLOR}`} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Our Esteemed <span className={PRIMARY_COLOR}>Investors</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are backed by globally recognized private equity and venture capital firms who believe in our mission.
          </p>
        </div>

        {/* ===== Investors Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {investorsData.map((investor, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-24 h-24 p-3 bg-gray-50 rounded-lg border flex items-center justify-center">
                  <img
                    src={investor.logoSrc}
                    alt="Finova Capital Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {investor.name}
                  </h3>

                  <span
                    className={`inline-block mb-3 px-3 py-1 text-xs rounded-full font-semibold ${PRIMARY_COLOR} bg-blue-50`}
                  >
                    <Shield className="w-3 h-3 inline mr-1" /> {investor.tag}
                  </span>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {investor.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
