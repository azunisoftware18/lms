import { DollarSign, Shield } from 'lucide-react';
import { colorVariables } from '../../lib';
import { investorsData } from '../../lib/dumyData';

export default function OurInvestorsPage() {
	return (
		<div className={`py-16 px-4 ${colorVariables.LIGHT_BG} font-sans`}>
			<div className="max-w-7xl mx-auto">
				{/* ===== Header Section ===== */}
				<div className="text-center mb-12">
					<DollarSign
						className={`w-10 h-10 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`}
					/>
					<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
						Our Esteemed{' '}
						<span className={colorVariables.PRIMARY_COLOR}>Investors</span>
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						We are backed by globally recognized private equity and venture
						capital firms who believe in our mission.
					</p>
				</div>

				{/* ===== Investors Grid ===== */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{investorsData.map((investor, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-2xl hover:-translate-y-1 group">
							<div className="flex items-start space-x-6">
								<div className="flex-shrink-0 w-24 h-24 p-3 bg-gray-50 rounded-lg border flex items-center justify-center">
									<img
										src={investor.logoSrc}
										alt="Finova Capital Logo"
										className="max-w-full max-h-full object-contain"
									/>
								</div>

								<div className="flex-grow">
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										{investor.name}
									</h3>

									<span
										className={`inline-block mb-3 px-3 py-1 text-xs rounded-full font-semibold ${colorVariables.PRIMARY_COLOR} bg-blue-50`}>
										<Shield className="w-3 h-3 inline mr-1" /> {investor.tag}
									</span>

									<p className="text-gray-600 text-sm leading-relaxed">
										{investor.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
