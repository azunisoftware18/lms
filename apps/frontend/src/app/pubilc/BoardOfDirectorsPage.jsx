import { Award } from 'lucide-react';
import { colorVariables, getTypeColor } from '../../lib';
import { directorsData } from '../../lib/dumyData';

export default function BoardOfDirectorsPage() {
	return (
		<div
			id="board-of-directors"
			className={`py-16 px-4 ${colorVariables.LIGHT_BG} font-sans`}>
			<div className="max-w-7xl mx-auto">
				{/* ===== Header Section ===== */}
				<div className="text-center mb-12">
					<Award
						className={`w-10 h-10 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`}
					/>
					<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
						Our{' '}
						<span className={colorVariables.PRIMARY_COLOR}>
							Board of Directors
						</span>
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						The visionary leaders guiding Finova's mission and growth.
					</p>
				</div>

				{/* ===== Directors Grid ===== */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
					{directorsData.map((director, index) => (
						<div
							key={index}
							className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl hover:scale-[1.02] group">
							{/* Image Section */}
							<div className="relative aspect-square overflow-hidden">
								<img
									src={director.image}
									alt={director.name}
									className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
								/>
								{/* Overlay/Accent */}
								<div
									className={`absolute inset-0 bg-blue-600 opacity-0 transition duration-300 group-hover:opacity-10`}></div>
							</div>

							{/* Details Section */}
							<div className="p-4 text-center">
								<h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">
									{director.name}
								</h3>
								<p className="text-sm font-semibold text-gray-700">
									{director.title}
								</p>

								{/* Director Type Badge */}
								<span
									className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-bold uppercase ${getTypeColor(director.type)}`}>
									{director.type}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
