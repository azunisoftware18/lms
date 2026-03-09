import { useState } from 'react';
import {
	ChevronDown,
	BarChart3,
	TrendingDown,
	Clock,
	ChevronRight,
} from 'lucide-react';
import { colorVariables } from '../../lib';
import { disclosuresData } from '../../lib/dumyData';
const financialYears = Object.keys(disclosuresData);

export default function PublicDisclosureUnderLiquidityRiskPage() {
	const [selectedYear, setSelectedYear] = useState(financialYears[0]);
	const currentDisclosures = disclosuresData[selectedYear] || [];

	return (
		<div
			className={`font-sans min-h-screen py-16 px-4 ${colorVariables.LIGHT_BG}`}>
			<div className="container mx-auto max-w-5xl">
				<div className="text-center mb-12">
					<TrendingDown
						className={`w-12 h-12 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`}
					/>
					<h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
						Public Disclosure under{' '}
						<span className={colorVariables.PRIMARY_COLOR}>Liquidity Risk</span>
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						Quarterly disclosures on Liquidity Risk Management (LRM) framework.
					</p>
				</div>

				<div className="flex justify-end mb-8 max-w-lg mx-auto md:max-w-full">
					<div className="relative w-48">
						<label className="block text-xs font-medium text-gray-700 mb-1">
							Select Financial Year
						</label>
						<select
							value={selectedYear}
							onChange={(e) => setSelectedYear(e.target.value)}
							className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none font-semibold">
							{financialYears.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
						<ChevronDown className="absolute right-3 top-7 h-5 w-5 text-gray-400 pointer-events-none" />
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-lg mx-auto md:max-w-full">
					{currentDisclosures.map((item, index) => (
						<div
							key={index}
							className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition duration-300 hover:shadow-xl hover:border-blue-300">
							<div className="flex items-start mb-4">
								<div className="p-3 bg-blue-50 rounded-lg mr-4">
									<BarChart3
										className={`w-8 h-8 ${colorVariables.PRIMARY_COLOR}`}
									/>
								</div>

								<div>
									<p className="text-sm font-semibold text-gray-600 flex items-center mb-1">
										<Clock className="w-4 h-4 mr-1" /> Quarter Ended
									</p>
									<h3 className="text-lg font-bold text-gray-900">
										Public Disclosure of LRM - {item.quarter}
									</h3>
								</div>
							</div>

							<a
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className={`inline-flex items-center text-sm font-semibold ${colorVariables.PRIMARY_COLOR} hover:text-blue-800 transition mt-2`}>
								View Detail
								<ChevronRight className="w-4 h-4 ml-1" />
							</a>
						</div>
					))}

					{currentDisclosures.length === 0 && (
						<div className="col-span-full p-8 text-center bg-white rounded-xl shadow-lg">
							<p className="text-lg text-gray-600">
								No public disclosures available for the selected financial year
								({selectedYear}).
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
