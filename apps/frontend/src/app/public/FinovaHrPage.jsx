// HRPage.jsx (Redesigned to match the Blue/Dark Blue FinTech Theme)

import { Briefcase, Heart, TrendingUp, FileText } from "lucide-react";
import { colorVariables } from "../../lib";

export default function FinovaHrPage() {

  return (
    <div className={`font-sans min-h-screen`}>
      
      {/* ===== Header Image and Title (Finova HR) ===== */}
      <section className="relative h-80 overflow-hidden">
        {/* Replace with actual image URL for the group silhouette */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://hr.kenjo.io/hubfs/main-functions-of-a-human-resource-department.jpg')", // Placeholder for uploaded image_ea3c03.jpg
            backgroundPosition: 'center 40%', 
            opacity: 0.95 
          }}
        >
          {/* Subtle Blue Overlay */}
          <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto h-full flex items-end pb-8 pl-4">
          <h1 className="text-5xl font-extrabold text-white bg-blue-800/80 px-4 py-2 rounded-lg shadow-lg">
            Finova <span className="text-yellow-300">HR</span>
          </h1>
        </div>
      </section>

      {/* ===== Main Content and Philosophy ===== */}
      <div className={`py-16 px-4 ${colorVariables.LIGHT_BG}`}>
        <div className="max-w-6xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-gray-100">
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
            <Briefcase className={`w-8 h-8 mr-3 ${colorVariables.PRIMARY_COLOR}`}/> 
            Our People-Centric Philosophy
          </h2>
          
          {/* Text Content */}
          <div className="text-gray-700 space-y-4 leading-relaxed text-lg">
            <p>
              At Finova, our HR team envisions a workplace where every individual is **empowered to excel, grow, and contribute** to the success of the organization. We strive to create an environment that nurtures innovation, embraces diversity, and fosters a sense of belonging.
            </p>
            <p>
              Our vision is to be the **driving force** behind a culture that values and invests in its greatest asset—our people. We aim to lead by example, setting the standard for excellence in HR practices, employee engagement, and talent development.
            </p>
            <p>
              We are dedicated to fostering a workspace where **collaboration, respect, and continuous learning** thrive. Through transparent communication, equitable policies, and a commitment to well-being, we aspire to be the catalyst for individual and organizational success.
            </p>
          </div>
          
          {/* Call to Action */}
          <p className="mt-8 text-xl font-bold text-gray-800">
            Join us on this exciting journey and be a part of the most dynamic team!
            <a href="#" className={`ml-3 text-lg font-bold ${colorVariables.PRIMARY_COLOR} hover:text-blue-700 transition`}>
                <TrendingUp className="w-5 h-5 inline mr-1"/> View Openings
            </a>
          </p>

        </div>
      </div>
      
      {/* ===== HR Vision Section (Highlighted) ===== */}
      <section className={`py-12 px-4 bg-white`}>
        <div className="max-w-6xl mx-auto">
          <div className={`p-8 rounded-xl ${ACCENT_BG} border border-blue-200 text-center shadow-lg`}>
            <Heart className="w-10 h-10 mx-auto text-red-500 mb-3"/>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
              Our <span className={PRIMARY_COLOR}>Vision</span>
            </h3>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-6">
              Build Your Career, Make a Future
            </p>
            
            <p className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
              Our vision at Finova Capital Private Limited is to be a **Great Place to Work**, where the ingrained culture is to drive passion in order to outperform. With the **Trust and Transparency** as the foundation of our People Process, we constantly work towards promoting a **high-performance culture** driven by individual excellence and Team Work. Our processes are geared towards ensuring all-round learning and development of our people.
            </p>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* ===== HR Policy Link ===== */}
      <section className={`py-8 px-4 ${colorVariables.LIGHT_BG}`}>
         <div className="max-w-6xl mx-auto text-center">
            <a 
                href="#" 
                className={`text-lg font-bold ${PRIMARY_COLOR} hover:text-blue-700 transition flex items-center justify-center`}
            >
                <FileText className="w-5 h-5 mr-2"/> Read Our Detailed HR Policy Document
            </a>
         </div>
      </section>
    </div>
  );
}