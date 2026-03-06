import { FileText, ChevronRight, BookOpen } from 'lucide-react';
import { colorVariables } from '../../lib';
import { DisclosureData } from '../../lib/dumyData';



export default function UnderRegulationPage() {
    
    return (
        <div className={`font-sans min-h-screen py-16 px-4 ${colorVariables.LIGHT_BG}`}>
            <div className="container mx-auto max-w-4xl">
                
                {/* ===== Header Section ===== */}
                <div className="text-center mb-12">
                    <BookOpen className={`w-12 h-12 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`} />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                        Disclosures under <span className={colorVariables.PRIMARY_COLOR}>Regulation 62 of LODR</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Mandatory disclosures related to Non-Convertible Securities, as per SEBI regulations.
                    </p>
                </div>

                {/* ===== Disclosure List Container (Table Style) ===== */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        
                        <div className="min-w-full">
                            {/* Table Header (Blue Theme) */}
                            <div className={`grid grid-cols-4 ${colorVariables.PRIMARY_BG} text-white font-bold text-sm md:text-base p-4 uppercase tracking-wider`}>
                                <div className="text-center w-1/12 hidden sm:block">Sr. No.</div>
                                <div className="col-span-3">Disclosure Details</div>
                                <div className="col-span-1 text-center">Action</div>
                            </div>

                            {/* Table Body */}
                            {DisclosureData.map((item, index) => (
                                <a 
                                    key={index}
                                    href={item.link} 
                                    className={`grid grid-cols-4 items-center px-4 py-4 border-b border-gray-100 text-gray-800 text-sm md:text-base transition duration-200 hover:bg-blue-50/50 hover:shadow-inner ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    
                                    {/* Sr. No. */}
                                    <div className="text-center font-semibold w-1/12 hidden sm:block">
                                        {item.srNo}
                                    </div>

                                    {/* Disclosure Detail */}
                                    <div className="col-span-3 pr-4 font-medium text-gray-900 flex items-start">
                                        <FileText className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${colorVariables.PRIMARY_COLOR} hidden sm:block`} />
                                        <span className="font-bold mr-2 sm:hidden">{item.srNo}.</span> {item.detail}
                                    </div>
                                    
                                    {/* Click Here Button/Link */}
                                    <div className="col-span-1 flex justify-center">
                                        <span 
                                            className={`inline-flex items-center gap-1 font-semibold ${colorVariables.PRIMARY_COLOR} hover:text-blue-800 transition text-sm`}
                                        >
                                            Click here
                                            <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Regulation Note */}
                <div className="mt-8 p-4 text-center rounded-lg border border-blue-200 bg-white">
                    <p className="text-sm text-gray-700">
                        * All disclosures are provided in compliance with the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.
                    </p>
                </div>

            </div>
        </div>
    );
};
