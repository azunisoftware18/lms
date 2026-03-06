import { Download, FileText, FolderOpen } from 'lucide-react';
import { colorVariables } from '../../lib';
import { disclosureData } from '../../lib/dumyData';

export default function OtherDisclosuresPage() {
	return (
		<div
			className={`font-sans min-h-screen py-16 px-4 ${colorVariables.LIGHT_BG}`}>
			<div className="container mx-auto max-w-5xl">
				{/* ===== Header Section ===== */}
				<div className="text-center mb-12">
					<FolderOpen
						className={`w-12 h-12 mx-auto mb-3 ${colorVariables.PRIMARY_COLOR}`}
					/>
					<h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
						<span className={colorVariables.PRIMARY_COLOR}>Other</span>{' '}
						Disclosures
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						All statutory and necessary disclosures beyond the periodic reports.
					</p>
				</div>

				{/* ===== Documents List Container (Table Style) ===== */}
				<div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
					<div className="overflow-x-auto">
						<div className="min-w-full">
							{/* Table Header (Blue Theme) */}
							<div
								className={`grid grid-cols-4 ${colorVariables.PRIMARY_BG} text-white font-bold text-sm md:text-base p-4 uppercase tracking-wider`}>
								<div className="col-span-3">Name of Disclosure</div>
								<div className="col-span-1 text-center">Download</div>
							</div>

							{/* Table Body */}
							{disclosureData.map((item, index) => (
								<div
									key={index}
									className={`grid grid-cols-4 items-center px-4 py-3 border-b border-gray-100 text-gray-800 text-sm md:text-base transition duration-200 hover:bg-blue-50/50 ${
										index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
									}`}>
									{/* Disclosure Name */}
									<div className="col-span-3 pr-4 font-medium text-gray-900 flex items-start">
										<FileText
											className={`w-4 h-4 mt-0.5 mr-2 flex-shrink-0 ${colorVariables.PRIMARY_COLOR}`}
										/>
										{item.name}
									</div>

									{/* Download Button */}
									<div className="col-span-1 flex justify-center">
										<a
											href={item.downloadLink}
											target="_blank"
											rel="noopener noreferrer"
											className={`flex items-center gap-1 ${colorVariables.PRIMARY_BG} text-white font-semibold py-2 px-4 rounded-full transition duration-200 hover:bg-blue-700 hover:shadow-md text-sm whitespace-nowrap`}
											title={`Download ${item.name}`}>
											<Download className="w-4 h-4" />
											<span className="hidden sm:inline">DOWNLOAD</span>
										</a>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Note */}
				<div className="mt-8 p-4 text-center rounded-lg border border-blue-200 bg-white">
					<p className="text-sm text-gray-700">
						* Please refer to the respective stock exchange websites for further
						details on these intimations.
					</p>
				</div>
			</div>
		</div>
	);
}
