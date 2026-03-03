// KMP.jsx (Redesigned to match the Blue/Dark Blue FinTech Theme)

import { UserCheck } from "lucide-react";

export default function KMP() {
  // Color variables for consistency
  const PRIMARY_COLOR = "text-blue-600";
  const LIGHT_BG = "bg-gray-50";

  const personnelData = [
    {
      name: "Mr. Ravi Sharma",
      title: "Chief Financial Officer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" // Placeholder URL
    },
    {
      name: "Mr. Jaikishan Premani",
      title: "Company Secretary and Compliance Officer",
      image: "https://plus.unsplash.com/premium_photo-1723770023600-8083358720aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688" // Placeholder URL
    },
    // Add more KMP if needed
  ];

  return (
    <div className={`py-16 px-4 ${LIGHT_BG} font-sans`}>
      <div className="max-w-7xl mx-auto">
        
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
          <UserCheck className={`w-10 h-10 mx-auto mb-3 ${PRIMARY_COLOR}`} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Key Managerial <span className={PRIMARY_COLOR}>Personnel</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our crucial management team ensuring operational excellence and compliance.
          </p>
        </div>

        {/* ===== Personnel Grid (Centered) ===== */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl">
            {personnelData.map((person, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl hover:scale-[1.03] group"
              >
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  {/* Accent on Hover */}
                  <div className={`absolute inset-0 bg-blue-600 opacity-0 transition duration-300 group-hover:opacity-10`}></div>
                </div>

                {/* Details Section */}
                <div className="p-5 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mt-2 mb-1">
                    {person.name}
                  </h3>
                  <p className="text-sm font-semibold text-blue-600 px-3 py-1 rounded-full bg-blue-50 inline-block">
                    {person.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}