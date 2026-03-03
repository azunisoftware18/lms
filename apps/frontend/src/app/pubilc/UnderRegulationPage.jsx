import { FileText, ChevronRight, BookOpen } from 'lucide-react';

const disclosureData = [
  { srNo: 1, detail: "Details of Business", link: "/investor-relations/business-details" },
  { srNo: 2, detail: "Details of composition of Board of Directors", link: "/investor-relations/board-composition" },
  { srNo: 3, detail: "Details of Contact Person for Investor grievances", link: "/investor-relations/grievance-contact" },
  { srNo: 4, detail: "Email Address for grievance redressal and other relevant details", link: "/investor-relations/email-redressal" },
  { srNo: 5, detail: "Notice of Meeting of Board of Directors where financial results shall be discussed", link: "/investor-relations/board-meeting-notice" },
  { srNo: 6, detail: "The information, report, notices, call letters, circulars, proceedings, etc concerning non-convertible Securities", link: "/investor-relations/ncs-documents" },
  { srNo: 7, detail: "Financial results", link: "/investor-relations/financial-results" },
  { srNo: 8, detail: "Annual Report", link: "/investor-relations/annual-report" },
  { srNo: 9, detail: "Name and Contact Details of Debenture Trustees", link: "/investor-relations/debenture-trustees" },
  { srNo: 10, detail: "Compliance Reports", link: "/investor-relations/compliance-reports" },
  { srNo: 11, detail: "Credit Ratings", link: "/investor-relations/credit-ratings" },
  { srNo: 12, detail: "Annual Return", link: "/investor-relations/annual-return" },
];

export default function UnderRegulationPage() {
    // Theme colors
    const PRIMARY_COLOR_CLASS = "text-blue-600";
    const PRIMARY_BG_CLASS = "bg-blue-600";
    const LIGHT_BG_CLASS = "bg-gray-50";

    return (
        <div className={`font-sans min-h-screen py-16 px-4 ${LIGHT_BG_CLASS}`}>
            <div className="container mx-auto max-w-4xl">
                
                {/* ===== Header Section ===== */}
                <div className="text-center mb-12">
                    <BookOpen className={`w-12 h-12 mx-auto mb-3 ${PRIMARY_COLOR_CLASS}`} />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                        Disclosures under <span className={PRIMARY_COLOR_CLASS}>Regulation 62 of LODR</span>
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
                            <div className={`grid grid-cols-4 ${PRIMARY_BG_CLASS} text-white font-bold text-sm md:text-base p-4 uppercase tracking-wider`}>
                                <div className="text-center w-1/12 hidden sm:block">Sr. No.</div>
                                <div className="col-span-3">Disclosure Details</div>
                                <div className="col-span-1 text-center">Action</div>
                            </div>

                            {/* Table Body */}
                            {disclosureData.map((item, index) => (
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
                                        <FileText className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${PRIMARY_COLOR_CLASS} hidden sm:block`} />
                                        <span className="font-bold mr-2 sm:hidden">{item.srNo}.</span> {item.detail}
                                    </div>
                                    
                                    {/* Click Here Button/Link */}
                                    <div className="col-span-1 flex justify-center">
                                        <span 
                                            className={`inline-flex items-center gap-1 font-semibold ${PRIMARY_COLOR_CLASS} hover:text-blue-800 transition text-sm`}
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
