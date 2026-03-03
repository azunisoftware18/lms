// JointheFinovaFaimily.jsx (Designed for Careers/Openings Page)

import { Briefcase, MapPin, Zap, ChevronRight } from 'lucide-react';

export default function JointheFinovaFaimilyPage() {
    // Color variables for consistency
    const PRIMARY_COLOR = "text-blue-600";
    const LIGHT_BG = "bg-gray-50";

    // Dummy Data for Job Openings
    const jobOpenings = [
        { 
            title: "Senior Credit Manager", 
            location: "Jaipur, Rajasthan",
            link: "#",
            department: "Credit & Risk"
        },
        { 
            title: "Software Developer (Frontend)", 
            location: "Gurugram, Haryana",
            link: "#",
            department: "Technology"
        },
        { 
            title: "Relationship Manager", 
            location: "Multiple Locations (PAN India)",
            link: "#",
            department: "Sales"
        },
        { 
            title: "Compliance Officer", 
            location: "Jaipur, Rajasthan",
            link: "#",
            department: "Legal & Compliance"
        },
    ];

    return (
        <div className={`py-16 px-4 ${LIGHT_BG} font-sans min-h-screen`}>
            <div className="max-w-7xl mx-auto">
                
                {/* ===== Header Section ===== */}
                <div className="text-center mb-12">
                    <Briefcase className={`w-10 h-10 mx-auto mb-3 ${PRIMARY_COLOR}`} />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                        Join the Finova <span className={PRIMARY_COLOR}>Family</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Build your career with a leading FinTech company. Explore exciting opportunities below.
                    </p>
                </div>

                {/* ===== Job Openings List ===== */}
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                    
                    <div className="p-5 bg-blue-50 border-b border-blue-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                           <Zap className={`w-5 h-5 mr-2 ${PRIMARY_COLOR}`} /> Current Openings ({jobOpenings.length})
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {jobOpenings.map((job, index) => (
                            <a
                                key={index}
                                href={job.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-5 transition duration-200 hover:bg-blue-50/50"
                            >
                                <div className="flex justify-between items-center flex-wrap">
                                    <div className="mb-2 md:mb-0">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {job.title}
                                        </h3>
                                        <p className={`text-sm font-medium ${PRIMARY_COLOR} flex items-center mt-1`}>
                                            <MapPin className="w-4 h-4 mr-1"/> {job.location}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full hidden sm:block">
                                            {job.department}
                                        </span>
                                        <button 
                                            className={`inline-flex items-center text-sm font-semibold text-white px-4 py-2 rounded-lg ${PRIMARY_COLOR} bg-blue-600 hover:bg-blue-700 transition`}
                                        >
                                            Apply Now
                                            <ChevronRight className="w-4 h-4 ml-1"/>
                                        </button>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ===== Culture Link/CTA ===== */}
                <div className="text-center mt-12">
                    <p className="text-lg text-gray-700">
                        Want to know more about our workplace and values? 
                        <a href="#" className={`ml-2 font-bold ${PRIMARY_COLOR} hover:text-blue-700 transition`}>
                           Explore Finova Culture
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}