import { Shield, Download, FileText } from 'lucide-react';

const sarfaesiData = [
  { 
    name: "Information on secured assets possessed under the SARFAESI Act, 2002 - September, 2025", 
    downloadLink: "/downloads/sarfaesi_sept_2025.pdf" 
  },
  { 
    name: "Information on secured assets possessed under the SARFAESI Act, 2002 - March, 2025", 
    downloadLink: "/downloads/sarfaesi_march_2025.pdf" 
  },
  { 
    name: "Information on secured assets possessed under the SARFAESI Act, 2002 - September, 2024", 
    downloadLink: "/downloads/sarfaesi_sept_2024.pdf" 
  },
];

export default function SarfaesiPage() {
  // Theme colors
  const PRIMARY_COLOR_CLASS = "text-blue-600";
  const PRIMARY_BG_CLASS = "bg-blue-600";
  const LIGHT_BG_CLASS = "bg-gray-50";

  return (
    <div className={`font-sans min-h-screen py-16 px-4 ${LIGHT_BG_CLASS}`}>
      <div className="container mx-auto max-w-5xl">
        
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
            <Shield className={`w-12 h-12 mx-auto mb-3 ${PRIMARY_COLOR_CLASS}`} />
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Secured Asset Details under <span className={PRIMARY_COLOR_CLASS}>SARFAESI Act, 2002</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Public disclosure of secured assets possessed by the company.
            </p>
        </div>

        {/* ===== Table Container (Modern Blue Theme) ===== */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            
            <div className="min-w-full">
                {/* Table Header (Blue Theme) */}
                <div className={`grid grid-cols-5 ${PRIMARY_BG_CLASS} text-white font-bold text-sm md:text-base p-4 uppercase tracking-wider`}>
                    <div className="col-span-3">Name of Document</div>
                    <div className="col-span-1 hidden md:block text-center">Type</div>
                    <div className="col-span-2 md:col-span-1 text-center">Action</div>
                </div>

                {/* Table Body */}
                {sarfaesiData.map((item, index) => (
                    <div
                        key={index}
                        // Odd/Even row styling
                        className={`grid grid-cols-5 items-center px-4 py-4 border-b border-gray-100 text-gray-800 text-sm md:text-base transition duration-200 hover:bg-blue-50/50 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                    >
                        
                        {/* Name (Document Title) */}
                        <div className="col-span-3 pr-4 font-medium text-gray-900 flex items-start">
                            <FileText className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${PRIMARY_COLOR_CLASS}`} />
                            {item.name}
                        </div>
                        
                        {/* Type (Hidden on mobile) */}
                        <div className="col-span-1 hidden md:block text-center text-gray-600">
                           PDF Document
                        </div>

                        {/* Download Button */}
                        <div className="col-span-2 md:col-span-1 flex justify-center">
                            <a 
                                href={item.downloadLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={`flex items-center gap-1 ${PRIMARY_BG_CLASS} text-white font-semibold py-2 px-4 rounded-full transition duration-200 hover:bg-blue-700 hover:shadow-md text-sm whitespace-nowrap`}
                            >
                                {/* Lucide Download Icon */}
                                <Download className="w-4 h-4" />
                                
                                DOWNLOAD
                            </a>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
