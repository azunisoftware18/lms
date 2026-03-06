import { dumyImg } from "../../lib/dumyData";

export default function OpportunityPage() {
  return (
    <div className="pt-24 pb-16 bg-white">
      {/* Title Section */}
      <section className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
          Opportunity
        </h1>
        <div id="opportunity" className="w-20 h-[3px] bg-blue-600 mb-3"></div>
        <p className="text-gray-600 mb-10">
          Seize the possibilities with every opportunity
        </p>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Image */}
          <div className="flex justify-center">
            <img
              src={dumyImg.OPPORTUNITY}
              alt="Opportunity"
              className="rounded-lg shadow-md max-w-full"
            />
          </div>


          {/* Right Text */}
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              Micro, small, and medium enterprises (MSMEs) play a significant
              role in India’s economy. They contribute nearly 8% of the
              country’s GDP, account for 45% of the manufacturing output, and
              contribute 40% of the exports. Furthermore, they provide the
              largest share of employment after agriculture. MSMEs serve as the
              nurseries for entrepreneurship and innovation in the nation.
            </p>

            <p>
              One of the major advantages of the MSME sector is its employment
              potential at a low capital cost. It is estimated that this sector
              employs around 6 crore individuals across 2.6 crore enterprises.
              The labor intensity in the MSME sector is approximately four times
              higher than that of large enterprises. This emphasizes the crucial
              role played by MSMEs in creating job opportunities and driving
              economic growth.
            </p>

            <p>
              However, there is an unmet finance gap of Rs 3 trillion,
              primarily affecting over 55 million micro enterprises. This
              presents a significant opportunity for growth and development. The
              future of India depends on the productivity and success of its
              massive youth population, many of whom work in the MSME sector.
              Despite the immense potential, banks and NBFCs have been hesitant
              to tap into this opportunity due to the sector’s informal and
              undocumented income structure.
            </p>

            <p>
              This underserved customer segment, often referred to as the
              “missing middle,” poses unique challenges for traditional lending
              institutions. Assessing the income of this unorganized sector is a
              daunting task. Recognizing this opportunity, our team, led by
              seasoned professionals from the finance industry, has developed an
              innovative and radically different approach. We employ a detailed
              cash flow analysis conducted at the customer’s doorstep, allowing
              us to accurately assess their financial situation and provide
              tailored solutions.
            </p>

            <p>
              By bridging the finance gap and catering to the needs of the MSME
              sector, we can unlock the true potential of these enterprises,
              propel their growth, and contribute to the overall development of
              the economy. This is a significant opportunity to make a
              meaningful impact and drive positive change in the lives of
              entrepreneurs and workers in the MSME sector.
            </p>
          </div>


          
        </div>
      </section>
    </div>
  );
}
