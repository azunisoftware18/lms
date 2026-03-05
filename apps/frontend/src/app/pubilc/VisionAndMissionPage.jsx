import { Zap, Handshake, Users, Award, ShieldCheck, Gem, Leaf, Lightbulb } from "lucide-react";

export default function VisionAndMissionPage() {
 
  const PRIMARY_COLOR = "text-blue-600";
  const ACCENT_COLOR_BG = "bg-blue-600";
  const LIGHT_BG = "bg-gray-50";
  const DARK_BG = "bg-[#0b173e]"; 

  const valuesData = [
    { number: "01", title: "Service", icon: Zap, desc: "We are committed to reaching out to unserved segments and ensuring timely credit when our customers need it most." },
    { number: "02", title: "Trust", icon: Handshake, desc: "We believe that transparency, integrity, and ethical conduct are the foundation of good business and internal excellence." },
    { number: "03", title: "Social", icon: Users, desc: "We uplift unorganized entities, helping them maintain and scale their operations to reach the next level of business." },
    { number: "04", title: "Innovation", icon: Lightbulb, desc: "We are flexible and always explore new methods to tailor-made solutions to meet every customer's unique requirements." },
    { number: "05", title: "Responsibility", icon: ShieldCheck, desc: "We act responsibly towards our investors, customers, and employees, diligently working to ensure our fiduciary success." },
    { number: "06", title: "Leadership", icon: Award, desc: "We foster an environment that encourages bold, creative leadership to attract, retain, and nurture the best talent for tomorrow's challenges." },
    { number: "07", title: "Mutual Respect", icon: Gem, desc: "We build a positive organizational culture by conducting every interaction with respect, consideration, and fairness for all stakeholders." },
    { number: "08", title: "Community", icon: Leaf, desc: "We are invested in contributing positively to the society we operate in, improving our surroundings and providing better opportunities for future generations." },
  ];

  return (
    <div className="font-sans leading-relaxed">
      
      {/* ===== Our Vision Section (Dark Background - High Contrast) ===== */}
      <section className=" bg-gradient-to-r from-blue-100 to-blue-300 py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto text-blue-600">
          <h1 className="text-sm font-semibold uppercase tracking-widest text-black mb-2">Investing in a brighter future, with purpose</h1>
          <h2 className="text-5xl font-extrabold mb-6">
            Our <span className="text-black">Vision</span>
          </h2>

          <p className="text-lg text-black leading-relaxed mb-8">
            To be a leading financial service provider, admired for high levels of customer service and respected for our **ethics, values, and corporate governance**. To provide micro, small & medium enterprises in India with timely credit and services to support the growth of the MSME sector.
          </p>

          <button className={`mt-4 text-gray-900 bg-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg`}>
            Our Commitment
          </button>
        </div>
      </section>

      {/* --- */}

      {/* ===== Our Values Section (Interactive Grid) ===== */}
      <section className={`py-16 px-6 ${LIGHT_BG}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
            Our <span className={PRIMARY_COLOR}>Core Values</span>
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Seize the possibilities with every opportunity.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuesData.map((item, index) => (
              <div
                key={index}
                className="group relative p-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Number and Title */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`text-3xl font-bold ${PRIMARY_COLOR}`}>{item.number}</div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                </div>

                {/* Icon for Visual Appeal */}
                <item.icon className={`w-10 h-10 mb-4 ${PRIMARY_COLOR} opacity-70 transition duration-300 group-hover:opacity-100`} />

                {/* Description (Slide/Fade Effect) */}
                <p className="text-gray-600 text-sm leading-relaxed transition-all duration-500">
                  {item.desc}
                </p>
                
                {/* Visual Accent on Hover (Slide Effect) */}
                <div className={`absolute bottom-0 left-0 w-full h-1 ${ACCENT_COLOR_BG} transition-transform duration-500 transform translate-y-full group-hover:translate-y-0`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}