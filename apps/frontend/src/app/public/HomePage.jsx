import { Shield } from 'lucide-react';

import Products from './ProductsPage';
import { colorVariables } from '../../lib';
import { dumyImg, features, HowItWorksSteps } from '../../lib/dumyData';
import AboutUsPage from './AboutUsPage';

export default function HomePage() {
	return (
		<div className="bg-white text-gray-800 font-sans">
			{/* ===== Hero Section ===== */}
			<section
				id="home"
				className="relative pt-16 md:pt-20 pb-12 md:pb-20 overflow-hidden bg-linear-to-r from-blue-50 to-blue-200">
				<div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between">
					<div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
						<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
							Finance that{' '}
							<em className="italic font-serif font-light">works</em>{' '}
							<br className="hidden sm:block" />
							as hard as you do
						</h1>
						<p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
							Take control of your money with powerful tools and smart insights.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
							<button
								className={`text-white px-6 py-3 rounded-full font-semibold transition ${colorVariables.SECONDARY_COLOR} text-sm sm:text-base`}>
								Get Started
							</button>
							<button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-full font-semibold transition hover:bg-blue-100 text-sm sm:text-base">
								Explore Features
							</button>
						</div>
					</div>

					<div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
						<img
							src={dumyImg.HOMEIMG2}
							alt=""
							className="w-full max-w-xs sm:max-w-sm h-auto rounded-2xl shadow-2xl transition duration-500 hover:scale-[1.02]"
							loading="eager"
						/>
					</div>
				</div>
			</section>

			<hr className="border-gray-100" />

			{/* ===== Features Section ===== */}
			<section className="container mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
				<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4">
					Powerful features for <br className="hidden sm:block" />
					<span className={colorVariables.PRIMARY_COLOR}>
						smarter financial decisions
					</span>
				</h2>
				<p className="text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
					Everything you need to manage your money in one place.
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
					{features.map((feature, i) => (
						<div
							key={i}
							className="p-4 sm:p-6 bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
							<feature.icon
								className={`w-8 h-8 mx-auto mb-3 sm:mb-4 ${colorVariables.PRIMARY_COLOR}`}
							/>
							<h3 className="text-lg font-bold text-gray-900 mb-2">
								{feature.title}
							</h3>
							<p className="text-sm text-gray-500 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</section>

			<hr className="border-gray-100" />

			{/* ===== How It Works Section ===== */}
			<section className="bg-white py-12 md:py-16 px-4 sm:px-6">
				<div className="container mx-auto">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12 px-4">
						How it works in <br className="hidden sm:block" />
						<span className={colorVariables.PRIMARY_COLOR}>
							three simple steps
						</span>
					</h2>
					<div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
						<div className="lg:w-1/2 space-y-6 sm:space-y-8 order-2 lg:order-1">
							{HowItWorksSteps.map((step, i) => (
								<div
									key={i}
									className="flex items-start space-x-4 max-w-md mx-auto lg:mx-0">
									<div
										className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-sm ${colorVariables.SECONDARY_COLOR}`}>
										{i + 1}
									</div>
									<div className="flex-1">
										<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
											{step.title}
										</h3>
										<p className="text-gray-600 text-sm sm:text-base">
											{step.details}
										</p>
									</div>
								</div>
							))}
						</div>

						<div className="lg:w-1/2 flex justify-center order-1 lg:order-2 mb-8 lg:mb-0">
							<img
								src={dumyImg.HOMEIMG2}
								alt="Two physical financial cards for security visual"
								className="w-full max-w-xs sm:max-w-sm h-auto rounded-xl shadow-2xl"
								loading="lazy"
							/>
						</div>
					</div>
				</div>
			</section>

			<hr className="border-gray-100" />

			{/* ===== Security Section ===== */}
			<section className="bg-gray-50 py-12 md:py-16 px-4 sm:px-6">
				<div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
					<div className="lg:w-1/2 text-center lg:text-left">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4">
							<span className={colorVariables.PRIMARY_COLOR}>
								Bank-Level security
							</span>{' '}
							<br className="hidden sm:block" />
							for your peace of mind
						</h2>
						<p className="text-gray-600 leading-relaxed mb-6 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
							We use 256-bit encryption and industry-leading security protocols
							to ensure your data is safe and protected. Your peace of mind is
							our top priority.
						</p>
						<button
							className={`px-6 py-3 rounded-lg font-semibold transition ${colorVariables.SECONDARY_COLOR} text-white text-sm sm:text-base`}>
							Learn More
						</button>
					</div>

					<div className="lg:w-1/2 flex justify-center relative">
						<Shield className="w-24 h-24 sm:w-32 sm:h-32 text-blue-500 relative z-10" />
						<div className="absolute w-32 h-32 sm:w-40 sm:h-40 bg-blue-200 rounded-full opacity-30 blur-xl"></div>
					</div>
				</div>
			</section>

			<hr className="border-gray-100" />

			<Products />

			<AboutUsPage />

			{/* ===== Testimonials Section ===== */}
			<section className="py-12 md:py-16 px-4 sm:px-6">
				<div className="container mx-auto">
					<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 text-center px-4">
						Money talk, from{' '}
						<span className={colorVariables.PRIMARY_COLOR}>real people</span>
					</h2>
					<div className="flex justify-center">
						<div className="bg-white border-l-4 border-blue-500 p-4 sm:p-6 shadow-md max-w-md sm:max-w-xl w-full">
							<p className="italic text-gray-700 mb-4 text-sm sm:text-base">
								"I used to ignore anything about my money, but now I actually
								enjoy checking my Finova account. The insights are so helpful!"
							</p>
							<div className="flex items-center">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full mr-3"></div>
								<div>
									<p className="font-semibold text-gray-900 text-sm sm:text-base">
										Sarah K.
									</p>
									<p className="text-xs sm:text-sm text-gray-500">
										Graphic Designer
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<hr className="border-gray-100" />

			{/* ===== CTA Footer Section ===== */}
			<section
				className={`py-12 md:py-16 px-4 sm:px-6 ${colorVariables.BACKGROUND_DARK} text-center`}>
				<div className="container mx-auto">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 px-4">
						Start your financial journey{' '}
						<span className="text-yellow-400">today</span>
					</h2>
					<p className="text-blue-200 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
						Join thousands of users who have already taken control of their
						financial future.
					</p>
					<button className="text-gray-900 bg-white px-6 sm:px-8 py-3 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition">
						Get Started Now
					</button>
				</div>
			</section>
		</div>
	);
}