import { Globe, Clock, Zap } from 'lucide-react';
import { colorVariables } from '../../lib';
import { newsData } from '../../lib/dumyData';

export default function NewsAndMediaPage() {
	return (
		<div
			id="news-and-media"
			className={`py-16 px-4 ${colorVariables.LIGHT_BG} font-sans min-h-screen`}>
			<div className="max-w-7xl mx-auto">
				{/* ===== Header Section ===== */}
				<div className="text-center mb-12">
					<Globe
						className={`w-10 h-10 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`}
					/>
					<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
						News & <span className={colorVariables.PRIMARY_COLOR}>Media</span>
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						Stay updated with our latest announcements, partnerships, and
						achievements.
					</p>
				</div>

				{/* ===== News Articles Grid ===== */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					{newsData.map((article, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-200 transition duration-300 hover:shadow-2xl hover:-translate-y-1">
							<div className="flex flex-col h-full">
								{/* Tag & Date */}
								<div className="flex justify-between items-center mb-4">
									<span
										className={`px-3 py-1 text-xs font-bold rounded-full text-white ${colorVariables.PRIMARY_BG}`}>
										{article.tag}
									</span>
									<p className="text-sm text-gray-500 flex items-center">
										<Clock className="w-4 h-4 mr-1" /> {article.date}
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
										<img
											src={article.sourceLogo}
											alt={article.source}
											className="w-full h-full object-contain p-2"
										/>
									</div>
									<div>
										<p className="text-sm font-semibold text-gray-800">
											Source: {article.source}
										</p>
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
										className={`text-sm font-bold flex items-center ${colorVariables.PRIMARY_COLOR} hover:text-blue-700 transition`}>
										Read Full Article
										<Zap className="w-4 h-4 ml-2" />
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
