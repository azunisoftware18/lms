import { Shield, Download, FileText } from 'lucide-react';
import { colorVariables } from '../../lib';
import { sarfaesiData } from '../../lib/dumyData';

export default function SarfaesiPage() {
  
  return (
    <div className={`font-sans min-h-screen py-16 px-4 ${colorVariables.LIGHT_BG}`}>
      <div className="container mx-auto max-w-5xl">
        
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
            <Shield className={`w-12 h-12 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`} />
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Secured Asset Details under <span className={colorVariables.PRIMARY_COLOR}>SARFAESI Act, 2002</span>
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
                <div className={`grid grid-cols-5 ${colorVariables.PRIMARY_BG} text-white font-bold text-sm md:text-base p-4 uppercase tracking-wider`}>
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
                            <FileText className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${colorVariables.PRIMARY_COLOR}`} />
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
                                className={`flex items-center gap-1 ${colorVariables.PRIMARY_BG} text-white font-semibold py-2 px-4 rounded-full transition duration-200 hover:bg-blue-700 hover:shadow-md text-sm whitespace-nowrap`}
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
