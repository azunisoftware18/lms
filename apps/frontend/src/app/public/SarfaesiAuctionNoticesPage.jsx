import { Hammer, Download, FileText, Eye } from "lucide-react";
import { colorVariables } from "../../lib";
import { noticesData } from "../../lib/dumyData";

export default function SarfaesiAuctionNoticesPage() {

  return (
    <div className={`py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 ${colorVariables.LIGHT_BG} font-sans min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        
        {/* ===== Header Section ===== */}
        <div className="text-center lg:text-left mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-6">
            <div className="flex-shrink-0">
              <Hammer className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto lg:mx-0 mb-3 lg:mb-0 ${colorVariables.PRIMARY_COLOR}`} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-2 lg:mb-3">
                SARFAESI <span className={colorVariables.PRIMARY_COLOR}>Auction Notices</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 leading-relaxed">
                Find the latest auction notices under the SARFAESI Act for transparent asset recovery.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Mobile Cards View ===== */}
        <div className="lg:hidden space-y-4 sm:space-y-6">
          {noticesData.map((notice, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <span className="text-blue-600 text-xs sm:text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                      {notice.name}
                    </h3>
                    <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {notice.size}
                      </span>
                      <span>{notice.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <a
                  href={notice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <a
                  href={notice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  <Eye className="w-4 h-4" />
                  View
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Tablet & Desktop Table View ===== */}
        <div className="hidden lg:block bg-white rounded-xl xl:rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider w-16 xl:w-20">
                    S.No.
                  </th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Notice Details
                  </th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-center text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider w-32 xl:w-40">
                    File Size
                  </th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-center text-xs xl:text-sm font-bold text-gray-700 uppercase tracking-wider w-40 xl:w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {noticesData.map((notice, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-all duration-200 group">
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-4">
                      <div>
                        <h3 className="text-sm xl:text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                          {notice.name}
                        </h3>
                        <p className="text-xs xl:text-sm text-gray-500 flex items-center">
                          <FileText className="w-3 h-3 xl:w-4 xl:h-4 mr-1" />
                          Published on {notice.date}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs xl:text-sm font-medium bg-gray-100 text-gray-800">
                        {notice.size}
                      </span>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2 xl:gap-3">
                        <a
                          href={notice.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 xl:gap-2 text-white text-xs xl:text-sm px-3 xl:px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                        >
                          <Download className="w-3 h-3 xl:w-4 xl:h-4" />
                          Download
                        </a>
                        <a
                          href={notice.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 xl:gap-2 text-gray-700 text-xs xl:text-sm px-3 xl:px-4 py-2 rounded-lg font-semibold transition-all duration-300 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        >
                          <Eye className="w-3 h-3 xl:w-4 xl:h-4" />
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== Additional Information Section ===== */}
        <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Legal Compliance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All notices published in compliance with SARFAESI Act 2002 regulations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Easy Access</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Download or view notices directly in your browser
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Transparent Process</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ensuring fair and transparent asset recovery procedures
              </p>
            </div>
          </div>
        </div>

        {/* ===== Pagination for Future Use ===== */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            Showing <span className="font-semibold">1-{noticesData.length}</span> of{" "}
            <span className="font-semibold">{noticesData.length}</span> notices
          </p>
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}