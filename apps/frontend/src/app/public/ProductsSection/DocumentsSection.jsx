// components/sections/DocumentsSection.jsx
import { documentsData } from "../../../lib/dumyData";

export default function DocumentsSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Documents <span className="text-blue-600">Required</span>
        </h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">
          Simple documentation for quick processing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {documentsData.map((section, idx) => (
            <div key={idx} className="bg-gray-50 p-5 sm:p-6 rounded-xl">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-600">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="text-green-500">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}