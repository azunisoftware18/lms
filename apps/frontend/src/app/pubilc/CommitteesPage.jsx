import { useState } from "react";
import {
  ChevronDown, 
  Users,
} from "lucide-react";
import { colorVariables } from "../../lib";
import { committeesData } from "../../lib/dumyData";


export default function CommitteesPage() {
  // Data extracted from the image, structured for the accordion
  

  const [activeIndex, setActiveIndex] = useState(0); // Set the first committee as open by default

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`py-16 px-4 ${colorVariables.LIGHT_BG} font-sans min-h-screen`}>
      <div className="max-w-6xl mx-auto">
        
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
          <Users className={`w-10 h-10 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Committees of the <span className={colorVariables.PRIMARY_COLOR}>Board</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Governing bodies ensuring robust corporate governance and specialized oversight.
          </p>
        </div>

        {/* ===== Accordion Section ===== */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          {committeesData.map((committee, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              
              {/* Accordion Header */}
              <button
                className={`flex justify-between items-center w-full p-5 text-left transition duration-300 
                ${activeIndex === index ? `${colorVariables.LIGHT_BG} text-blue-800` : 'hover:bg-gray-50 text-gray-900'}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex items-center">
                  <committee.icon className={`w-6 h-6 mr-3 ${activeIndex === index ? colorVariables.PRIMARY_COLOR : 'text-gray-500'}`} />
                  <span className="text-xl font-bold">{committee.name}</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-300 ${activeIndex === index ? 'transform rotate-180 text-blue-600' : 'text-gray-500'}`} 
                />
              </button>

              {/* Accordion Content */}
              {activeIndex === index && (
                <div className="p-5 pt-0 bg-white">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">S.No.</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Name of Member</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Designation</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {committee.members.map((member, mIndex) => (
                          <tr key={mIndex} className="hover:bg-blue-50/50 transition">
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500">{mIndex + 1}</td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{member.designation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}