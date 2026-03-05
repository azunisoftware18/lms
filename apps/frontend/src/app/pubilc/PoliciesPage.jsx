import { useState } from 'react';
import {
	FileText,
	Download,
	ChevronRight,
	BookOpen,
	Shield,
	HelpCircle,
} from 'lucide-react';

import { colorVariables } from '../../lib';
import { PolicyData } from '../../lib/dumyData';

export default function PoliciesPage() {
	const [activeTab, setActiveTab] = useState('Loan Terms & Charges');

	const getTabIcon = (tabName) => {
		switch (tabName) {
			case 'Fair Practices & Grievance':
				return <HelpCircle className="w-5 h-5 mr-2" />;
			case 'Loan Terms & Charges':
				return <BookOpen className="w-5 h-5 mr-2" />;
			case 'Regulatory & Compliance':
				return <Shield className="w-5 h-5 mr-2" />;
			case 'Privacy & Others':
				return <FileText className="w-5 h-5 mr-2" />;
			default:
				return <FileText className="w-5 h-5 mr-2" />;
		}
	};

	return (
		<div className={`py-16 px-4 ${colorVariables.LIGHT_BG} font-sans`}>
			<div className="max-w-6xl mx-auto">
				{/* ===== Header and Introduction ===== */}
				<div className="text-center mb-12">
					<FileText
						className={`w-10 h-10 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`}
					/>
					<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
						Policies and{' '}
						<span className={colorVariables.PRIMARY_COLOR}>Downloads</span>
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						Find all essential regulatory documents, policies, and schedules of
						charges in one place.
					</p>
				</div>

				{/* ===== Tab Navigation (Filter) ===== */}
				<div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
					{Object.keys(PolicyData).map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`flex items-center px-4 py-3 text-sm font-semibold transition-all duration-300 ease-in-out border-b-2 
                ${
									activeTab === tab
										? `${colorVariables.PRIMARY_COLOR} border-blue-600`
										: 'text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-300'
								}`}>
							{getTabIcon(tab)}
							{tab}
						</button>
					))}
				</div>

				{/* ===== Policy List (Content) ===== */}
				<div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
					<div className="p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
							<ChevronRight
								className={`w-6 h-6 mr-2 ${colorVariables.PRIMARY_COLOR}`}
							/>
							{activeTab} Documents
						</h2>
						<p className="text-gray-500 mb-6 text-sm">
							Click the 'Download PDF' button to view and save the full
							document.
						</p>

						<ul className="divide-y divide-gray-100">
							{PolicyData[activeTab].map((policy, index) => (
								<li
									key={index}
									className="flex justify-between items-center py-4 px-2 hover:bg-blue-50 transition duration-300">
									{/* Document Name */}
									<span className="text-gray-800 font-medium md:text-base text-sm">
										{policy.name}
									</span>

									{/* Download Button */}
									<a
										href={policy.link}
										target="_blank"
										rel="noopener noreferrer"
										className={`flex items-center text-white text-xs px-4 py-2 rounded-full font-semibold transition-all duration-300 ${colorVariables.PRIMARY_BG} hover:bg-blue-700 shadow-md`}>
										<Download className="w-4 h-4 mr-2" />
										Download PDF
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
