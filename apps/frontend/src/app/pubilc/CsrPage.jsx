import { useState } from 'react';
import {
	Heart,
	Users,
	FileText,
	ChevronDown,
	CheckCircle,
	Download,
} from 'lucide-react';
import { colorVariables } from '../../lib';
import { committeeMembers, projectsData } from '../../lib/dumyData';
import { Link } from 'react-router-dom';

export default function CsrPage() {
	// State for mobile accordion
	const [openSection, setOpenSection] = useState(null);

	const toggleSection = (section) => {
		setOpenSection(openSection === section ? null : section);
	};

	return (
		<div
			className={`py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 ${colorVariables.LIGHT_BG} font-sans min-h-screen`}>
			{/* ===== Header Image and Title ===== */}
			<section className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden mb-8 sm:mb-10 lg:mb-12 rounded-xl sm:rounded-2xl mx-auto max-w-7xl">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage:
							"url('https://media.istockphoto.com/id/1483600134/photo/happy-rural-indian-family-sitting-together-outside-their-cottage-in-a-village-holding-a-piggy.jpg?s=2048x2048&w=is&k=20&c=b2hzb-IGurVhBjNwjIkbTgR8kxKgwd4jrYA3w4TrR-k=')",
					}}>
					<div className="absolute inset-0 bg-blue-900 opacity-60"></div>
				</div>
				<div className="relative z-10 h-full flex items-center justify-center sm:justify-start px-4 sm:px-8 lg:px-12">
					<div className="text-center sm:text-left max-w-2xl">
						<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
							<Heart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 inline mr-2 sm:mr-3 text-red-400 mb-1 sm:mb-0" />
							Corporate Social Responsibility
						</h1>
						<p className="text-sm sm:text-base md:text-lg text-blue-100 opacity-90 hidden sm:block">
							Building a better future through sustainable initiatives and
							community development
						</p>
					</div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto">
				{/* ===== About CSR Section (Text) ===== */}
				<section className="mb-8 sm:mb-10 lg:mb-12 px-2 sm:px-0">
					<h2
						className={`text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-4 border-b-2 sm:border-b-4 border-blue-600 inline-block pb-1 sm:pb-2`}>
						Our Commitment
					</h2>
					<div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg">
						<p className="text-gray-700 leading-relaxed">
							The Company has adopted Corporate Social Responsibility (CSR)
							Policy, in accordance with the provisions of Section 135 of the
							Companies Act, 2013 (the Act). The Company prioritizes CSR
							initiatives in areas that provide significant positive impact to
							society at large.
						</p>
						<p className="text-gray-700 leading-relaxed">
							We are committed to ensuring sustained excellence to setup and
							encourage healthcare and wellness, resource, human and
							socio-development and leverage the capabilities of youth, women
							and vulnerable sections of society. The policy guides the
							Company's philosophy for giving back to society as a corporate
							citizen.
						</p>
					</div>
				</section>

				{/* Mobile Accordion Navigation */}
				<div className="lg:hidden mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
					<button
						onClick={() => toggleSection('committee')}
						className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
						<span className="flex items-center">
							<Users className="w-5 h-5 mr-2 text-blue-600" />
							CSR Committee
						</span>
						<ChevronDown
							className={`w-4 h-4 text-gray-500 transition-transform ${
								openSection === 'committee' ? 'rotate-180' : ''
							}`}
						/>
					</button>

					<button
						onClick={() => toggleSection('projects')}
						className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 border-t border-gray-200 hover:bg-gray-50 transition-colors">
						<span className="flex items-center">
							<FileText className="w-5 h-5 mr-2 text-blue-600" />
							Approved Projects
						</span>
						<ChevronDown
							className={`w-4 h-4 text-gray-500 transition-transform ${
								openSection === 'projects' ? 'rotate-180' : ''
							}`}
						/>
					</button>
				</div>

				{/* ===== Main Content Grid ===== */}
				<div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
					{/* ===== CSR Committee ===== */}
					<div
						className={`lg:col-span-2 bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 ${
							openSection === 'committee' || !openSection
								? 'block'
								: 'hidden lg:block'
						}`}>
						<div className="flex items-center justify-between mb-4 sm:mb-6">
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
								<Users
									className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 ${PRIMARY_COLOR}`}
								/>
								CSR Committee
							</h3>
							{/* Mobile download button */}
							<button className="lg:hidden bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
								<Download className="w-4 h-4" />
							</button>
						</div>

						<p className="text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">
							In accordance with the provisions of Section 135 of the Companies
							Act, 2013, the Company has a CSR Committee.
						</p>

						{/* Committee Table */}
						<div className="overflow-x-auto rounded-lg border border-gray-200">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-blue-50">
									<tr>
										<th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-12 sm:w-16">
											S.No.
										</th>
										<th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
											Name of Member
										</th>
										<th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden sm:table-cell">
											Designation
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{committeeMembers.map((member, mIndex) => (
										<tr
											key={mIndex}
											className="hover:bg-gray-50 transition-colors">
											<td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
												{mIndex + 1}
											</td>
											<td className="px-3 sm:px-4 lg:px-6 py-3">
												<div className="text-sm font-medium text-gray-900">
													{member.name}
												</div>
												<div className="text-xs text-gray-500 sm:hidden mt-1">
													{member.designation}
												</div>
											</td>
											<td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
												{member.designation}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Desktop Policy Link */}
						<Link
							to="#"
							className={`mt-6 text-sm font-semibold ${PRIMARY_COLOR} hover:text-blue-700 transition flex items-center hidden lg:flex`}>
							View CSR Policy Document
							<ChevronDown className="w-4 h-4 ml-1 transform -rotate-90" />
						</Link>

						{/* Mobile Policy Link */}
						<Link
							to="#"
							className={`mt-6 w-full text-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center lg:hidden`}>
							<Download className="w-4 h-4 mr-2" />
							Download CSR Policy
						</Link>
					</div>

					{/* ===== Approved Projects List ===== */}
					<div
						className={`bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 ${
							openSection === 'projects' || !openSection
								? 'block'
								: 'hidden lg:block'
						}`}>
						<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
							<FileText
								className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 ${PRIMARY_COLOR}`}
							/>
							Approved Projects
						</h3>

						<div className="space-y-2 sm:space-y-3">
							{projectsData.map((project, index) => (
								<Link
									key={index}
									to={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between p-3 sm:p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition duration-200 group">
									<span className="flex items-center text-gray-800 font-medium text-sm sm:text-base">
										<CheckCircle
											className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 ${PRIMARY_COLOR} flex-shrink-0`}
										/>
										<span className="truncate">
											CSR Projects {project.year}
										</span>
									</span>
									<ChevronDown
										className={`w-4 h-4 text-gray-500 transform -rotate-90 flex-shrink-0 group-hover:text-blue-600`}
									/>
								</Link>
							))}
						</div>

						{/* Additional Info for Desktop */}
						<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 hidden lg:block">
							<p className="text-sm text-blue-800 text-center">
								All projects are approved by the CSR Committee and monitored
								regularly for impact assessment.
							</p>
						</div>
					</div>
				</div>

				{/* ===== Additional Information Section ===== */}
				<section className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
					<h2
						className={`text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-900 mb-4 sm:mb-6 border-b-2 border-blue-600 inline-block pb-1 sm:pb-2`}>
						Our CSR Focus Areas
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						{[
							{
								title: 'Healthcare',
								description: 'Medical camps and health awareness programs',
							},
							{
								title: 'Education',
								description: 'Scholarships and educational infrastructure',
							},
							{
								title: 'Skill Development',
								description: 'Vocational training for youth and women',
							},
							{
								title: 'Environment',
								description: 'Afforestation and sustainability initiatives',
							},
						].map((area, index) => (
							<div
								key={index}
								className="text-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
								<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
									<CheckCircle className="w-4 h-4 text-white" />
								</div>
								<h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">
									{area.title}
								</h4>
								<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
									{area.description}
								</p>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
