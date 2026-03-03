import { Download, FileText, ScrollText } from 'lucide-react';

const policyData = [
  { name: "Corporate Social Responsibility Policy", downloadLink: "/downloads/csr_policy.pdf" },
  { name: "Co-Lending Policy", downloadLink: "/downloads/colending_policy.pdf" },
  { name: "Prevention of Sexual Harassment of Women at Workplace", downloadLink: "/downloads/posh_policy.pdf" },
  { name: "Nomination, Remuneration and Compensation Policy", downloadLink: "/downloads/nomination_policy.pdf" },
  { name: "Archival Policy", downloadLink: "/downloads/archival_policy.pdf" },
  { name: "Terms and Conditions of appointment of Independent Director", downloadLink: "/downloads/terms_independent_director.pdf" },
  { name: "Policy on Appointment of Statutory Auditor", downloadLink: "/downloads/statutory_auditor_policy.pdf" },
  { name: "Policy on Appointment and Fit & Proper Criteria for Directors", downloadLink: "/downloads/fit_proper_criteria.pdf" },
  { name: "Fair Practice Code_English", downloadLink: "/downloads/fpc_english.pdf" }, 
  { name: "Grievance Redressal Mechanism_English", downloadLink: "/downloads/grievance_english.pdf" }, 
  { name: "Data Privacy Policy", downloadLink: "/downloads/data_privacy_policy.pdf" }, 
  { name: "Vigil Mechanism/Whistle Blower Policy", downloadLink: "/downloads/vigil_mechanism.pdf" }, 
];

export default function PoliciesAndCodesPage() {
    // Theme colors
    const PRIMARY_COLOR_CLASS = "text-blue-600";
    const PRIMARY_BG_CLASS = "bg-blue-600";
    const LIGHT_BG_CLASS = "bg-gray-50";

    return (
        <div className={`font-sans min-h-screen py-16 px-4 ${LIGHT_BG_CLASS}`}>
            <div className="container mx-auto max-w-4xl">
                
                {/* ===== Header Section ===== */}
                <div className="text-center mb-12">
                    <ScrollText className={`w-12 h-12 mx-auto mb-3 ${PRIMARY_COLOR_CLASS}`} />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                        Policies & <span className={PRIMARY_COLOR_CLASS}>Codes</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        View and download important policies, codes, and disclosures of the company.
                    </p>
                </div>

                {/* ===== Documents List Container (Table Style) ===== */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        
                        <div className="min-w-full">
                            {/* Table Header (Blue Theme) */}
                            <div className={`grid grid-cols-4 ${PRIMARY_BG_CLASS} text-white font-bold text-sm md:text-base p-4 uppercase tracking-wider`}>
                                <div className="col-span-3">Policy Name</div>
                                <div className="col-span-1 text-center">Download</div>
                            </div>

                            {/* Table Body */}
                            {policyData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`grid grid-cols-4 items-center px-4 py-3 border-b border-gray-100 text-gray-800 text-sm md:text-base transition duration-200 hover:bg-blue-50/50 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    
                                    {/* Policy Name */}
                                    <div className="col-span-3 pr-4 font-medium text-gray-900 flex items-start">
                                        <FileText className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${PRIMARY_COLOR_CLASS}`} />
                                        {item.name}
                                    </div>
                                    
                                    {/* Download Button */}
                                    <div className="col-span-1 flex justify-center">
                                        <a 
                                            href={item.downloadLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className={`flex items-center gap-1 ${PRIMARY_BG_CLASS} text-white font-semibold py-2 px-4 rounded-full transition duration-200 hover:bg-blue-700 hover:shadow-md text-sm whitespace-nowrap`}
                                            title={`Download ${item.name}`}
                                        >
                                            <Download className="w-4 h-4" />
                                            <span className="hidden sm:inline">DOWNLOAD</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Note about other policies (from image_e85e6e.png) */}
                <div className="mt-8 p-4 text-center rounded-lg border border-gray-300 bg-white">
                    <p className="text-sm text-gray-600">
                        * Other important documents like **Fair Practice Code, Schedule of Charges, and Grievance Redressal Mechanisms** are also available for download.
                    </p>
                </div>

            </div>
        </div>
    );
};
