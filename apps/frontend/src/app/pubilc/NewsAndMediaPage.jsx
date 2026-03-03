import { Globe, Clock, Zap } from "lucide-react";

export default function NewsAndMediaPage() {
  // Color variables for consistency
  const PRIMARY_COLOR = "text-blue-600";
  const PRIMARY_BG = "bg-blue-600";
  const LIGHT_BG = "bg-gray-50";

  const newsData = [
    {
      title: "Finova Capital joins hands with Jaipur-based Rajasthan Royals as official partner for IPL 2025",
      date: "16 Apr, 2025",
      source: "Times of India",
      sourceLogo: "https://plus.unsplash.com/premium_photo-1692776205655-a10831536e0a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=731", // Replace with actual TOI logo image path
      summary: "Finova Capital is proud to announce its partnership with Jaipur-based Rajasthan Royals as an official partner for the ongoing IPL 2025 season. This collaboration marks a significant milestone as it seeks to leverage the widespread reach and influence of Rajasthan Royals to drive deeper engagement with communities across India.",
      readMoreLink: "#",
      tag: "Partnership",
    },
    {
      title: "Finova Capital secures Rs 1,135 crore from Avaatar Venture Partners, Sofina, Madison India others",
      date: "29 Oct, 2024",
      source: "Economic Times",
      sourceLogo: "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", // Replace with actual ET logo image path
      summary: "Finova Capital has secured $135 million (about Rs 1,135 crore) in a fresh funding round led by Avaatar Venture Partners, Sofina and Madison India Capital. The transaction marks the business-to-business focused growth-stage fund Avaatar Venture Partners’ first investment in the financial services sector in India.",
      readMoreLink: "#",
      tag: "Funding",
    },
  ];

  return (
    <div id="news-and-media" className={`py-16 px-4 ${LIGHT_BG} font-sans min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
          <Globe className={`w-10 h-10 mx-auto mb-3 ${PRIMARY_COLOR}`} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            News & <span className={PRIMARY_COLOR}>Media</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest announcements, partnerships, and achievements.
          </p>
        </div>

        {/* ===== News Articles Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {newsData.map((article, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-200 transition duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex flex-col h-full">
                
                {/* Tag & Date */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${PRIMARY_BG}`}>
                    {article.tag}
                  </span>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1"/> {article.date}
                  </p>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-snug">
                  {article.title}
                </h3>
                
                {/* Source/Logo and Summary */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    {/* Placeholder for source logo */}
                    <img src={article.sourceLogo} alt={article.source} className="w-full h-full object-contain p-2" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Source: {article.source}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {article.summary.substring(0, 150)}...
                    </p>
                  </div>
                </div>
                
                {/* Read More Button */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <a
                      href={article.readMoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-bold flex items-center ${PRIMARY_COLOR} hover:text-blue-700 transition`}
                    >
                      Read Full Article
                      <Zap className="w-4 h-4 ml-2"/>
                    </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}