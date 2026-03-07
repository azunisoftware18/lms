import { colorVariables } from '../../lib';
import { valuesData } from '../../lib/dumyData';

export default function VisionAndMissionPage() {
	return (
		<div className="font-sans leading-relaxed">
			{/* ===== Our Vision Section (Dark Background - High Contrast) ===== */}
			<section className="bg-gradient-to-r from-blue-100 to-blue-300 py-20 px-6 text-center">
				<div className="max-w-4xl mx-auto text-blue-600">
					<h1 className="text-sm font-semibold uppercase tracking-widest text-black mb-2">
						Investing in a brighter future, with purpose
					</h1>
					<h2 className="text-5xl font-extrabold mb-6">
						Our <span className="text-black">Vision</span>
					</h2>

					<p className="text-lg text-black leading-relaxed mb-8">
						To be a leading financial service provider, admired for high levels
						of customer service and respected for our **ethics, values, and
						corporate governance**. To provide micro, small & medium enterprises
						in India with timely credit and services to support the growth of
						the MSME sector.
					</p>

					<button
						className={`mt-4 text-gray-900 bg-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg`}>
						Our Commitment
					</button>
				</div>
			</section>

			{/* --- */}

			{/* ===== Our Values Section (Interactive Grid) ===== */}
			<section className={`py-16 px-6 ${colorVariables.LIGHT_BG}`}>
				<div className="max-w-7xl mx-auto">
					<h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
						Our{' '}
						<span className={colorVariables.PRIMARY_COLOR}>Core Values</span>
					</h2>
					<p className="text-lg text-gray-600 text-center mb-12">
						Seize the possibilities with every opportunity.
					</p>

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{valuesData.map((item, index) => (
							<div
								key={index}
								className="group relative p-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition duration-500 hover:shadow-2xl hover:-translate-y-2">
								{/* Number and Title */}
								<div className="flex items-center space-x-3 mb-4">
									<div
										className={`text-3xl font-bold ${colorVariables.PRIMARY_COLOR}`}>
										{item.number}
									</div>
									<h3 className="text-xl font-bold text-gray-900">
										{item.title}
									</h3>
								</div>

								{/* Icon for Visual Appeal */}
								<item.icon
									className={`w-10 h-10 mb-4 ${colorVariables.PRIMARY_COLOR} opacity-70 transition duration-300 group-hover:opacity-100`}
								/>

								{/* Description (Slide/Fade Effect) */}
								<p className="text-gray-600 text-sm leading-relaxed transition-all duration-500">
									{item.desc}
								</p>

								{/* Visual Accent on Hover (Slide Effect) */}
								<div
									className={`absolute bottom-0 left-0 w-full h-1 ${colorVariables.ACCENT_COLOR_BG} transition-transform duration-500 transform translate-y-full group-hover:translate-y-0`}></div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
