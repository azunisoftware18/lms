import { Download, FileText, Bell } from 'lucide-react';

const noticeData = [
  { 
    name: "Notice of AGM FCPL_20.06.2025", 
    downloadLink: "/notices/notice_agm_20062025.pdf",
    type: "AGM"
  },
  { 
    name: "Notice of EOGM FCPL_18.10.2024", 
    downloadLink: "/notices/notice_eogm_18102024.pdf",
    type: "EOGM"
  },
  { 
    name: "Notice of EOGM FCPL_19.09.2024", 
    downloadLink: "/notices/notice_eogm_19092024.pdf",
    type: "EOGM"
  },
  { 
    name: "Notice of AGM FCPL_15.06.2024", 
    downloadLink: "/notices/notice_agm_15062024.pdf",
    type: "AGM"
  },
 
  { 
    name: "Notice of EOGM FCPL_29.02.2024", 
    downloadLink: "/notices/notice_eogm_29022024.pdf",
    type: "EOGM"
  },
  { 
    name: "Notice of AGM FCPL_15.06.2023", 
    downloadLink: "/notices/notice_agm_15062023.pdf",
    type: "AGM"
  },
  { 
    name: "Notice of AGM FCPL_20.05.2022", 
    downloadLink: "/notices/notice_agm_20052022.pdf",
    type: "AGM"
  },
  { 
    name: "Notice of EOGM FCPL_01.04.2022", 
    downloadLink: "/notices/notice_eogm_01042022.pdf",
    type: "EOGM"
  },
];

export default function NoticeOfBallotPage() {
    // Theme colors
    const PRIMARY_COLOR_CLASS = "text-blue-600";
    const PRIMARY_BG_CLASS = "bg-blue-600";
    const LIGHT_BG_CLASS = "bg-gray-50";

    // Function to extract date for better display/sorting
    const extractDate = (name) => {
        // Extracts date like 20.06.2025 from the string
        const match = name.match(/_(\d{2}\.\d{2}\.\d{4})/);
        return match ? match[1] : 'N/A';
    };

    return (
        <div className={`font-sans min-h-screen py-16 px-4 ${LIGHT_BG_CLASS}`}>
            <div className="container mx-auto max-w-5xl">
                
                {/* ===== Header Section ===== */}
                <div className="text-center mb-12">
                    <Bell className={`w-12 h-12 mx-auto mb-3 ${PRIMARY_COLOR_CLASS}`} />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                        Notice of <span className={PRIMARY_COLOR_CLASS}>AGM/EGM/Postal Ballot</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Timely updates and documents related to General Meetings and Postal Ballots.
                    </p>
                </div>

                {/* ===== Notices List Container (Table Style) ===== */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        
                        <div className="min-w-full">
                            {/* Table Header (Blue Theme) */}
                            <div className={`grid grid-cols-4 ${PRIMARY_BG_CLASS} text-white font-bold text-sm md:text-base p-4 uppercase tracking-wider`}>
                                <div className="col-span-2">Notice Title</div>
                                <div className="col-span-1 text-center hidden sm:block">Meeting Date</div>
                                <div className="col-span-2 sm:col-span-1 text-center">Download</div>
                            </div>

                            {/* Table Body */}
                            {noticeData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`grid grid-cols-4 items-center px-4 py-3 border-b border-gray-100 text-gray-800 text-sm md:text-base transition duration-200 hover:bg-blue-50/50 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    
                                    {/* Notice Name */}
                                    <div className="col-span-2 pr-4 font-medium text-gray-900 flex items-start">
                                        <FileText className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${PRIMARY_COLOR_CLASS}`} />
                                        {item.name}
                                    </div>

                                    {/* Meeting Date */}
                                    <div className="col-span-1 text-center hidden sm:block font-semibold text-gray-600">
                                        {extractDate(item.name)}
                                    </div>
                                    
                                    {/* Download Button */}
                                    <div className="col-span-2 sm:col-span-1 flex justify-center">
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

            </div>
        </div>
    );
};
