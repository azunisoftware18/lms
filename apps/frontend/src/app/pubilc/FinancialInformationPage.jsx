// FinancialInfo.jsx (Redesigned to match the Blue/Dark Blue FinTech Theme with Year Selector)

import { useState } from 'react';
import { BarChart3, ChevronDown, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { colorVariables } from '../../lib';
import { financialData } from '../../lib/dumyData';

export default function FinancialInformationPage() {
	const availableYears = Object.keys(financialData);
	const [selectedYear, setSelectedYear] = useState(availableYears[0]);

	const handleYearChange = (event) => {
		setSelectedYear(event.target.value);
	};

	const currentReports = financialData[selectedYear] || [];

	return (
		<div
			className={`py-16 px-4 ${colorVariables.LIGHT_BG} font-sans min-h-screen`}>
			<div className="max-w-6xl mx-auto">
				{/* ===== Header Section ===== */}
				<div className="text-center md:text-left mb-12">
					<BarChart3
						className={`w-10 h-10 md:mx-0 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`}
					/>
					<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
						Financial{' '}
						<span className={colorVariables.PRIMARY_COLOR}>Information</span>
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl md:mx-0 mx-auto">
						Access our quarterly and annual financial results and reports.
					</p>
				</div>

				{/* --- */}

				<div className="flex flex-col md:flex-row gap-8 items-start">
					{/* ===== Year Selector (Dropdown) ===== */}
					<div className="w-full md:w-64 flex-shrink-0">
						<label
							htmlFor="year-select"
							className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
							<Calendar className="w-4 h-4 mr-1" /> Select Financial Year
						</label>
						<div className="relative">
							<select
								id="year-select"
								value={selectedYear}
								onChange={handleYearChange}
								className="block w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm transition">
								{availableYears.map((year) => (
									<option key={year} value={year}>
										{year}
									</option>
								))}
							</select>
							<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
						</div>
					</div>

					{/* ===== Financial Results Grid ===== */}
					<div className="flex-grow w-full">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">
							Reports for {selectedYear}
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{currentReports.map((report, index) => (
								<div
									key={index}
									className={`bg-white p-6 rounded-xl shadow-lg border-t-4 ${report.isLatest ? 'border-blue-600 shadow-xl' : 'border-gray-100'} 
                  transition duration-300 hover:shadow-2xl hover:-translate-y-1`}>
									<BarChart3
										className={`w-8 h-8 mb-3 ${colorVariables.PRIMARY_COLOR}`}
									/>

									<h3 className="text-lg font-bold text-gray-900 mb-1">
										{report.quarter} Financial Results
									</h3>

									<p className="text-sm text-gray-500 mb-4">
										Period {report.period}
									</p>

									<Link
										to={report.link}
										target="_blank"
										rel="noopener noreferrer"
										className={`font-semibold text-sm ${colorVariables.PRIMARY_COLOR} hover:text-blue-700 transition flex items-center`}>
										View Detail
										<ChevronDown className="w-4 h-4 ml-1 transform -rotate-90" />
									</Link>

									{report.isLatest && (
										<span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
											Latest
										</span>
									)}
								</div>
							))}

							{currentReports.length === 0 && (
								<p className="text-gray-500 col-span-full">
									No financial reports available for the selected year.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
