import {
	Zap,
	UserCheck,
	Briefcase,
	Shield,
	Heart,
	DollarSign,
	TrendingUp,
	FileCheck,
	Map,
	Repeat,
	Landmark,
	Handshake,
	Users,
	Award,
	ShieldCheck,
	Gem,
	Leaf,
	Lightbulb,
	CreditCard,
	Banknote,
	Home,
	User,
} from 'lucide-react';
// import FinovaLogo from '../../assets/finova_logo.avif';

export const keyPillars = [
	{
		icon: Briefcase,
		title: 'MSME Focus',
		description:
			'Empowering micro, small, and medium enterprises to drive economic growth.',
	},
	{
		icon: UserCheck,
		title: 'Customer-Centric',
		description:
			'Driven by integrity and transparency to build long-lasting client relationships.',
	},
	{
		icon: Users,
		title: 'Expert Backing',
		description:
			'Supported by renowned investors like Peak XV Partners and Norwest Venture Partners.',
	},
];

export const dumyImg = {
	ABOUT_US:
		'https://plus.unsplash.com/premium_photo-1675055730240-96a4ed84e482?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627',

	LEADERSHIP:
		'https://images.unsplash.com/photo-1652565436975-5ac0c22fb3ee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',

	OPPORTUNITY:
		'https://www.shutterstock.com/shutterstock/photos/2622897831/display_1500/stock-photo-senior-indian-couple-with-young-daughter-discussing-financial-paperwork-with-male-advisor-or-bank-2622897831.jpg',
};

// Dummy Data for Annual Reports and Returns (categorized by year)
export const annualData = {
	'2023-2024': [
		{ type: 'Annual Report', year: '2023-24', link: '#', isLatest: true },
		{ type: 'Annual Return', year: '2023-24', link: '#' },
	],
	'2022-2023': [
		{ type: 'Annual Report', year: '2022-23', link: '#' },
		{ type: 'Annual Return', year: '2022-23', link: '#' },
	],
	'2021-2022': [
		{ type: 'Annual Report', year: '2021-22', link: '#' },
		{ type: 'Annual Return', year: '2021-22', link: '#' },
	],
};

export const directorsData = [
	{
		name: 'Mr. Mohit Sahney',
		title: 'Managing Director & Chief Executive Officer',
		type: 'Executive',
		image:
			'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', // Placeholder URL
	},
	{
		name: 'Mrs. Sunita Sahney',
		title: 'Executive Director',
		type: 'Executive',
		image:
			'https://plus.unsplash.com/premium_photo-1670071482460-5c08776521fe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', // Placeholder URL
	},
	{
		name: 'Mr. Arjun Dan Ratnoo',
		title: 'Independent Director',
		type: 'Independent',
		image:
			'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1176', // Placeholder URL
	},
	{
		name: 'Mr. Sathyan David',
		title: 'Independent Director',
		type: 'Independent',
		image:
			'https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170', // Placeholder URL
	},
	{
		name: 'Mr. GV Ravishankar',
		title: 'Nominee Director',
		type: 'Nominee',
		image:
			'https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', // Placeholder URL
	},
	{
		name: 'Mr. Aditya Deepak Parekh',
		title: 'Nominee Director',
		type: 'Nominee',
		image:
			'https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', // Placeholder URL
	},
	{
		name: 'Mr. Ishaan Mittal',
		title: 'Nominee Director',
		type: 'Nominee',
		image:
			'https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', // Placeholder URL
	},
];

export const committeesData = [
	{
		name: 'Audit Committee',
		icon: DollarSign,
		members: [
			{ name: 'Mr. Arjun Dan Ratnoo', designation: 'Chairman' },
			{ name: 'Mr. Lamyan Ercost', designation: 'Member' },
			{ name: 'Mr. Ishaan Mittal', designation: 'Member' },
		],
	},
	{
		name: 'Nomination and Remuneration Committee',
		icon: Briefcase,
		members: [
			{ name: 'Mr. Arjun Dan Ratnoo', designation: 'Chairman' },
			{ name: 'Mr. Sathyan David', designation: 'Member' },
			{ name: 'Mr. Aditya Deepak Parekh', designation: 'Member' },
		],
	},
	{
		name: 'Corporate Social Responsibility Committee',
		icon: Users,
		members: [
			{ name: 'Mr. Mohit Sahney', designation: 'Chairman' },
			{ name: 'Mrs. Sunita Sahney', designation: 'Member' },
			{ name: 'Mr. Arjun Dan Ratnoo', designation: 'Member' },
		],
	},
	{
		name: 'Risk Management Committee',
		icon: Shield,
		members: [
			{ name: 'Mr. Arjun Dan Ratnoo', designation: 'Chairman' },
			{ name: 'Mr. Ishaan Mittal', designation: 'Member' },
			{ name: 'Mrs. Sunita Sahney', designation: 'Member' },
			{ name: 'Mr. Ravi Sharma', designation: 'Member' },
		],
	},
	{
		name: 'Asset Liability Management Committee',
		icon: DollarSign,
		members: [
			{ name: 'Mr. Mohit Sahney', designation: 'Chairman' },
			{ name: 'Mrs. Sunita Sahney', designation: 'Member' },
			{ name: 'Mr. Ravi Sharma', designation: 'Member' },
			{ name: 'Mr. Rakesh Talu', designation: 'Member' },
		],
	},
	{
		name: 'IT Strategy Committee',
		icon: Zap,
		members: [
			{ name: 'Mr. Arjun Dan Ratnoo', designation: 'Chairman' },
			{ name: 'Mr. Mohit Sahney', designation: 'Member' },
			{ name: 'Mrs. Sunita Sahney', designation: 'Member' },
			{ name: 'Mr. Arpit Gupta', designation: 'Member' },
		],
	},
	{
		name: 'Consumer Protection Committee',
		icon: FileCheck,
		members: [
			{ name: 'Mr. Arpit Gupta', designation: 'Chairperson' },
			{ name: 'Mr. Pooja Godara', designation: 'Member' },
			{ name: 'Mr. Vipul Santo', designation: 'Member' },
		],
	},
];

// Data for CSR Approved Projects
export const projectsData = [
	{ year: '2023-24', link: '#' },
	{ year: '2022-23', link: '#' },
	{ year: '2021-22', link: '#' },
	{ year: '2020-21', link: '#' },
	{ year: '2019-20', link: '#' },
	{ year: '2018-19', link: '#' },
];

// Data for CSR Committee
export const committeeMembers = [
	{ name: 'Mr. Mohit Sahney', designation: 'Chairman' },
	{ name: 'Mrs. Sunita Sahney', designation: 'Member' },
	{ name: 'Mr. Arjun Dan Ratnoo', designation: 'Member' },
];

export const benefitsData = [
	{
		title: 'Health & Wellness Coverage',
		icon: Heart,
		description:
			'Comprehensive medical insurance for employees and their families, ensuring peace of mind and access to quality healthcare.',
	},
	{
		title: 'Financial Security (PF & Gratuity)',
		icon: DollarSign,
		description:
			'Robust retirement and savings plans, including Provident Fund (PF) and Gratuity benefits, to secure your financial future.',
	},
	{
		title: 'Professional Development',
		icon: TrendingUp,
		description:
			'Access to ongoing training, skill development programs, and certifications to help you advance your career and grow professionally.',
	},
	{
		title: 'Work-Life Balance',
		icon: Briefcase,
		description:
			'Generous paid time off, flexible work arrangements where applicable, and support for maintaining a healthy balance between work and personal life.',
	},
	{
		title: 'Recognition & Rewards',
		icon: Award,
		description:
			"Performance-based bonuses, awards, and recognition programs that celebrate your achievements and contributions to the company's success.",
	},
	{
		title: 'Employee Assistance Program (EAP)',
		icon: Shield,
		description:
			'Confidential counseling and support services for personal or professional challenges, promoting mental well-being.',
	},
];

// Dummy Data for Financial Reports (categorized by year)
export const financialData = {
	'2023-2024': [
		{
			quarter: 'Q4',
			period: 'ended March 31, 2024',
			link: '#',
			isLatest: true,
		},
		{ quarter: 'Q3', period: 'ended December 31, 2023', link: '#' },
		{ quarter: 'Q2', period: 'ended September 30, 2023', link: '#' },
		{ quarter: 'Q1', period: 'ended June 30, 2023', link: '#' },
	],
	'2022-2023': [
		{ quarter: 'Full Year', period: 'ended March 31, 2023', link: '#' },
		{ quarter: 'Q3', period: 'ended December 31, 2022', link: '#' },
		{ quarter: 'Q2', period: 'ended September 30, 2022', link: '#' },
		{ quarter: 'Q1', period: 'ended June 30, 2022', link: '#' },
	],
	'2021-2022': [
		{ quarter: 'Full Year', period: 'ended March 31, 2022', link: '#' },
		// Add more reports for previous years
	],
};

export const features = [
	{
		title: 'Smart Budgeting',
		icon: DollarSign,
		description:
			'Automatically categorize transactions and set budget limits with real-time alerts.',
	},
	{
		title: 'Goal Planning',
		icon: TrendingUp,
		description:
			'Visualize and track your financial goals like saving for a house or retirement.',
	},
	{
		title: 'Real-Time Insights',
		icon: Zap,
		description:
			'Get personalized tips to optimize spending and boost your savings instantly.',
	},
	{
		title: 'Bill Reminders',
		icon: Shield,
		description:
			'Never miss a payment with automated notifications for all your recurring bills.',
	},
];

export const HowItWorksSteps = [
	{
		title: 'Sign up',
		details: 'Quickly create your account using our mobile or web app.',
	},
	{
		title: 'Personalize',
		details: 'Connect your existing bank accounts securely.',
	},
	{
		title: 'Track your progress',
		details: 'Start receiving insights and take control of your finances.',
	},
];

// Dummy Data for Job Openings
export const jobOpenings = [
	{
		title: 'Senior Credit Manager',
		location: 'Jaipur, Rajasthan',
		link: '#',
		department: 'Credit & Risk',
	},
	{
		title: 'Software Developer (Frontend)',
		location: 'Gurugram, Haryana',
		link: '#',
		department: 'Technology',
	},
	{
		title: 'Relationship Manager',
		location: 'Multiple Locations (PAN India)',
		link: '#',
		department: 'Sales',
	},
	{
		title: 'Compliance Officer',
		location: 'Jaipur, Rajasthan',
		link: '#',
		department: 'Legal & Compliance',
	},
];

export const personnelData = [
	{
		name: 'Mr. Ravi Sharma',
		title: 'Chief Financial Officer',
		image:
			'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', // Placeholder URL
	},
	{
		name: 'Mr. Jaikishan Premani',
		title: 'Company Secretary and Compliance Officer',
		image:
			'https://plus.unsplash.com/premium_photo-1723770023600-8083358720aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688', // Placeholder URL
	},
	// Add more KMP if needed
];

export const newsData = [
	{
		title:
			'Finova Capital joins hands with Jaipur-based Rajasthan Royals as official partner for IPL 2025',
		date: '16 Apr, 2025',
		source: 'Times of India',
		sourceLogo:
			'https://plus.unsplash.com/premium_photo-1692776205655-a10831536e0a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=731', // Replace with actual TOI logo image path
		summary:
			'Finova Capital is proud to announce its partnership with Jaipur-based Rajasthan Royals as an official partner for the ongoing IPL 2025 season. This collaboration marks a significant milestone as it seeks to leverage the widespread reach and influence of Rajasthan Royals to drive deeper engagement with communities across India.',
		readMoreLink: '#',
		tag: 'Partnership',
	},
	{
		title:
			'Finova Capital secures Rs 1,135 crore from Avaatar Venture Partners, Sofina, Madison India others',
		date: '29 Oct, 2024',
		source: 'Economic Times',
		sourceLogo:
			'https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', // Replace with actual ET logo image path
		summary:
			'Finova Capital has secured $135 million (about Rs 1,135 crore) in a fresh funding round led by Avaatar Venture Partners, Sofina and Madison India Capital. The transaction marks the business-to-business focused growth-stage fund Avaatar Venture Partners’ first investment in the financial services sector in India.',
		readMoreLink: '#',
		tag: 'Funding',
	},
];

export const noticeData = [
	{
		name: 'Notice of AGM FCPL_20.06.2025',
		downloadLink: '/notices/notice_agm_20062025.pdf',
		type: 'AGM',
	},
	{
		name: 'Notice of EOGM FCPL_18.10.2024',
		downloadLink: '/notices/notice_eogm_18102024.pdf',
		type: 'EOGM',
	},
	{
		name: 'Notice of EOGM FCPL_19.09.2024',
		downloadLink: '/notices/notice_eogm_19092024.pdf',
		type: 'EOGM',
	},
	{
		name: 'Notice of AGM FCPL_15.06.2024',
		downloadLink: '/notices/notice_agm_15062024.pdf',
		type: 'AGM',
	},

	{
		name: 'Notice of EOGM FCPL_29.02.2024',
		downloadLink: '/notices/notice_eogm_29022024.pdf',
		type: 'EOGM',
	},
	{
		name: 'Notice of AGM FCPL_15.06.2023',
		downloadLink: '/notices/notice_agm_15062023.pdf',
		type: 'AGM',
	},
	{
		name: 'Notice of AGM FCPL_20.05.2022',
		downloadLink: '/notices/notice_agm_20052022.pdf',
		type: 'AGM',
	},
	{
		name: 'Notice of EOGM FCPL_01.04.2022',
		downloadLink: '/notices/notice_eogm_01042022.pdf',
		type: 'EOGM',
	},
];

export const disclosureData = [
	{
		name: 'Intimation on Board Meeting Scheduled to be held on August 01, 2023',
		downloadLink: '/disclosures/board_meeting_01082023.pdf',
	},
	{
		name: 'Outcome of Board Meeting held on August 01, 2023',
		downloadLink: '/disclosures/outcome_board_01082023.pdf',
	},
	{
		name: 'Trading Window Closure_30.06.2023',
		downloadLink: '/disclosures/trading_window_30062023.pdf',
	},
	{
		name: 'Certificate on Security Cover for the Quarter ended as on June 30, 2023',
		downloadLink: '/disclosures/security_cover_30062023.pdf',
	},
	{
		name: 'BSE Intimation- Regulation 57(1)- Interest and Redemption of Principal',
		downloadLink: '/disclosures/bse_reg_57_interest.pdf',
	},
	{
		name: 'Proceedings of 08th AGM held on June 15, 2023',
		downloadLink: '/disclosures/proceedings_08th_agm.pdf',
	},
	{
		name: 'BSE Intimation Regulation 15(7) Notice of Recall Option',
		downloadLink: '/disclosures/bse_reg_15_recall.pdf',
	},
];

export const investorsData = [
	{
		name: 'Peak XV Partners',
		// logoSrc: FinovaLogo,
		description:
			'Peak XV Partners (formerly Sequoia Capital India) is a leading venture capital firm supporting various sectors across Southeast Asia and India. They have over 50 years of operations in the region.',
		tag: 'Venture Capital',
	},
	{
		name: 'Faering Capital',
		// logoSrc: FinovaLogo,
		description:
			'Faering Capital is a leading mid-market private equity firm with an entrepreneurial ethos. The firm was founded by industry veterans and focuses on a proprietary, sector-focused investment approach.',
		tag: 'Private Equity',
	},
	{
		name: 'Norwest Venture Partners',
		// logoSrc: FinovaLogo,
		description:
			'Norwest Venture Partners is a multi-stage investment firm managing more than $15.5 Billion in capital with a focus across consumer, enterprise, and healthcare sectors globally.',
		tag: 'Multi-Stage Fund',
	},
	{
		name: 'Maj Invest',
		// logoSrc: FinovaLogo,
		description:
			'Maj Invest is a Danish asset management company with about EUR 13 billion under management, providing services to asset management and private equity funds with headquarters in Copenhagen, Denmark.',
		tag: 'Asset Management',
	},
	{
		name: 'Sofina Ventures',
		// logoSrc: FinovaLogo,
		description:
			'Sofina is a global investment company listed on Euronext Brussels. Sofina’s mission is to partner with leading entrepreneurs and families, driving sustainable growth through conviction and long-term support.',
		tag: 'Global Investor',
	},
	{
		name: 'Avaatar Ventures',
		// logoSrc: FinovaLogo,
		description:
			'Avaatar is a growth-stage, tech-focused investment fund partnering with brilliant founder-led businesses looking to disrupt markets globally. They focus on businesses leveraging deep technology and innovation.',
		tag: 'Growth Stage Fund',
	},
	{
		name: 'Madison India Capital',
		// logoSrc: FinovaLogo,
		description:
			'Madison India Capital is a leading private equity firm focused on the Indian market. They focus on effective capital partnerships with their portfolio companies and co-investors.',
		tag: 'Indian PE',
	},
];

export const methods = [
	{
		title: 'Absence of Credit History',
		icon: CreditCard,
		desc: 'Many MSMEs lack a well-established credit history. We recognize this and use alternative methods to assess creditworthiness and provide necessary financial support.',
	},
	{
		title: 'Detailed Cash Flow Analysis',
		icon: Zap,
		desc: "Understanding and analyzing the cash flow of an MSME is crucial. We conduct detailed cash flow analysis at the customer's doorstep to gain a comprehensive financial understanding.",
	},
	{
		title: 'Seasonality of Every Business',
		icon: Repeat,
		desc: 'Seasonal fluctuations in business revenue are accommodated. We structure our offerings to align with seasonal cash flow requirements accordingly.',
	},
	{
		title: 'Variety of Collaterals',
		icon: Shield,
		desc: "MSMEs may have unique collaterals that don't fit traditional models. We have a flexible approach that accepts a wide range of assets for securing financing.",
	},
	{
		title: 'Poor Banking Practices',
		icon: Landmark,
		desc: 'MSMEs often face difficulties due to outdated banking practices and complex procedures. We strive to simplify the process and provide efficient, hassle-free solutions.',
	},
	{
		title: 'Properties in Rural Areas',
		icon: Map,
		desc: 'Many MSMEs operate in rural areas where documentation differs. Our understanding of rural dynamics helps us navigate these challenges and tailor financial solutions.',
	},
];

export const policyData = [
	{
		name: 'Corporate Social Responsibility Policy',
		downloadLink: '/downloads/csr_policy.pdf',
	},
	{
		name: 'Co-Lending Policy',
		downloadLink: '/downloads/colending_policy.pdf',
	},
	{
		name: 'Prevention of Sexual Harassment of Women at Workplace',
		downloadLink: '/downloads/posh_policy.pdf',
	},
	{
		name: 'Nomination, Remuneration and Compensation Policy',
		downloadLink: '/downloads/nomination_policy.pdf',
	},
	{ name: 'Archival Policy', downloadLink: '/downloads/archival_policy.pdf' },
	{
		name: 'Terms and Conditions of appointment of Independent Director',
		downloadLink: '/downloads/terms_independent_director.pdf',
	},
	{
		name: 'Policy on Appointment of Statutory Auditor',
		downloadLink: '/downloads/statutory_auditor_policy.pdf',
	},
	{
		name: 'Policy on Appointment and Fit & Proper Criteria for Directors',
		downloadLink: '/downloads/fit_proper_criteria.pdf',
	},
	{
		name: 'Fair Practice Code_English',
		downloadLink: '/downloads/fpc_english.pdf',
	},
	{
		name: 'Grievance Redressal Mechanism_English',
		downloadLink: '/downloads/grievance_english.pdf',
	},
	{
		name: 'Data Privacy Policy',
		downloadLink: '/downloads/data_privacy_policy.pdf',
	},
	{
		name: 'Vigil Mechanism/Whistle Blower Policy',
		downloadLink: '/downloads/vigil_mechanism.pdf',
	},
];

export const PolicyData = {
	'Fair Practices & Grievance': [
		{ name: 'Fair Practice Code (English)', link: '#' },
		{ name: 'Fair Practice Code (Vernacular)', link: '#' },
		{ name: 'Grievance Redressal Mechanism (English)', link: '#' },
		{ name: 'Grievance Redressal Mechanism (Vernacular)', link: '#' },
		{ name: 'Vigil Mechanism / Whistle Blower Policy', link: '#' },
		{ name: 'Equal Opportunity Policy', link: '#' },
	],
	'Loan Terms & Charges': [
		{
			name: 'Policy on Determining Interest Rate, Processing and Other Charges',
			link: '#',
		},
		{ name: 'Pricing Policy', link: '#' },
		{ name: 'Schedule of Charges', link: '#' },
		{
			name: 'Policy on Loan Closure and Return of Property Documents',
			link: '#',
		},
		{ name: 'Policy on Moratorium Term Loan (COVID-19)', link: '#' },
	],
	'Regulatory & Compliance': [
		{
			name: 'Salient Features of Integrated Ombudsman Scheme, 2021',
			link: '#',
		},
		{ name: 'Reserve Bank Integrated Ombudsman Scheme, 2021', link: '#' },
		{
			name: 'Guidelines on Classification as Special Mention Account (SMA) and Non-Performing Asset (NPA)',
			link: '#',
		},
		{ name: 'Resolution Framework 2.0 (MSME)', link: '#' },
		{
			name: 'Resolution Framework 2.0 (Individuals & Small Borrowers)',
			link: '#',
		},
		{ name: 'Anti Corruption Policy', link: '#' },
	],
	'Privacy & Others': [
		{ name: 'Data Privacy Policy', link: '#' },
		{
			name: 'Pre-Login Documents for Individuals and Non-Individuals',
			link: '#',
		},
	],
};

export const productsData = [
	{
		title: 'MSME Business Loan',
		icon: Banknote,
		image:
			'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=800',
		details: [
			{ label: 'Loan Amount', value: '₹2 Lakhs to ₹25 Lakhs' },
			{ label: 'Repayment Tenure', value: '3 years to 10 years' },
			{ label: 'Security', value: 'Secured against immovable properties' },
		],
		note: 'The company offers reasonable interest rates depending on factors like your credit score, loan amount, etc. ',
	},
	{
		title: 'Home Loan',
		icon: Home,
		image:
			'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
		details: [
			{ label: 'Loan Amount', value: '₹2 Lakhs to ₹25 Lakhs' },
			{ label: 'Repayment Tenure', value: '3 years to 10 years' },
			{ label: 'Security', value: 'Secured against immovable properties' },
		],
		note: 'Find the perfect loan to build your future home. Interest rates vary based on your profile. ',
	},
	{
		title: 'Personal Loan',
		icon: User,
		image:
			'https://images.unsplash.com/photo-1603039078583-13468e835b01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
		details: [
			{ label: 'Loan Amount', value: '₹50,000 to ₹3 Lakhs' },
			{ label: 'Repayment Tenure', value: '1 year to 3 years' },
		],
		note: 'Specifically for **Government Salaried Employees**. Interest rates apply based on credit history. ',
	},
];

export const disclosuresData = {
	'2025-2026': [
		{ quarter: 'June 30, 2025', link: '/disclosures/lrm_q1_2026.pdf' },
		{ quarter: 'September 30, 2025', link: '/disclosures/lrm_q2_2026.pdf' },
	],
	'2024-2025': [
		{ quarter: 'March 31, 2025', link: '/disclosures/lrm_q4_2025.pdf' },
		{ quarter: 'December 31, 2024', link: '/disclosures/lrm_q3_2025.pdf' },
		{ quarter: 'September 30, 2024', link: '/disclosures/lrm_q2_2025.pdf' },
		{ quarter: 'June 30, 2024', link: '/disclosures/lrm_q1_2025.pdf' },
	],
	'2023-2024': [
		{ quarter: 'March 31, 2024', link: '/disclosures/lrm_q4_2024.pdf' },
	],
};

// Dummy Data for SARFAESI Auction Notices
export const noticesData = [
	{
		name: 'Auction Notice_Mr. Mohammad Ghufran S/O Ali Murtaza_23.05.2025',
		link: '#',
		date: '23 May 2025',
		size: '2.4 MB',
	},
	{
		name: 'Auction Notice_Mr. Hasrat S/O Abdul Salam_23.05.2025',
		link: '#',
		date: '23 May 2025',
		size: '1.8 MB',
	},
	{
		name: 'Auction Notice_Mr. Om Prakash Tavatla S/O Ganesh Tavatla_23.05.2025',
		link: '#',
		date: '23 May 2025',
		size: '3.1 MB',
	},
	{
		name: 'Auction Notice_Ms. Anjali Sharma D/O Ramesh Sharma_23.05.2025',
		link: '#',
		date: '23 May 2025',
		size: '2.7 MB',
	},
	{
		name: 'Auction Notice_Mr. Sunil Kumar S/O Ashok Kumar_23.05.2025',
		link: '#',
		date: '23 May 2025',
		size: '1.9 MB',
	},
];

export const sarfaesiData = [
	{
		name: 'Information on secured assets possessed under the SARFAESI Act, 2002 - September, 2025',
		downloadLink: '/downloads/sarfaesi_sept_2025.pdf',
	},
	{
		name: 'Information on secured assets possessed under the SARFAESI Act, 2002 - March, 2025',
		downloadLink: '/downloads/sarfaesi_march_2025.pdf',
	},
	{
		name: 'Information on secured assets possessed under the SARFAESI Act, 2002 - September, 2024',
		downloadLink: '/downloads/sarfaesi_sept_2024.pdf',
	},
];

export const DisclosureData = [
	{
		srNo: 1,
		detail: 'Details of Business',
		link: '/investor-relations/business-details',
	},
	{
		srNo: 2,
		detail: 'Details of composition of Board of Directors',
		link: '/investor-relations/board-composition',
	},
	{
		srNo: 3,
		detail: 'Details of Contact Person for Investor grievances',
		link: '/investor-relations/grievance-contact',
	},
	{
		srNo: 4,
		detail: 'Email Address for grievance redressal and other relevant details',
		link: '/investor-relations/email-redressal',
	},
	{
		srNo: 5,
		detail:
			'Notice of Meeting of Board of Directors where financial results shall be discussed',
		link: '/investor-relations/board-meeting-notice',
	},
	{
		srNo: 6,
		detail:
			'The information, report, notices, call letters, circulars, proceedings, etc concerning non-convertible Securities',
		link: '/investor-relations/ncs-documents',
	},
	{
		srNo: 7,
		detail: 'Financial results',
		link: '/investor-relations/financial-results',
	},
	{
		srNo: 8,
		detail: 'Annual Report',
		link: '/investor-relations/annual-report',
	},
	{
		srNo: 9,
		detail: 'Name and Contact Details of Debenture Trustees',
		link: '/investor-relations/debenture-trustees',
	},
	{
		srNo: 10,
		detail: 'Compliance Reports',
		link: '/investor-relations/compliance-reports',
	},
	{
		srNo: 11,
		detail: 'Credit Ratings',
		link: '/investor-relations/credit-ratings',
	},
	{
		srNo: 12,
		detail: 'Annual Return',
		link: '/investor-relations/annual-return',
	},
];

export const valuesData = [
	{
		number: '01',
		title: 'Service',
		icon: Zap,
		desc: 'We are committed to reaching out to unserved segments and ensuring timely credit when our customers need it most.',
	},
	{
		number: '02',
		title: 'Trust',
		icon: Handshake,
		desc: 'We believe that transparency, integrity, and ethical conduct are the foundation of good business and internal excellence.',
	},
	{
		number: '03',
		title: 'Social',
		icon: Users,
		desc: 'We uplift unorganized entities, helping them maintain and scale their operations to reach the next level of business.',
	},
	{
		number: '04',
		title: 'Innovation',
		icon: Lightbulb,
		desc: "We are flexible and always explore new methods to tailor-made solutions to meet every customer's unique requirements.",
	},
	{
		number: '05',
		title: 'Responsibility',
		icon: ShieldCheck,
		desc: 'We act responsibly towards our investors, customers, and employees, diligently working to ensure our fiduciary success.',
	},
	{
		number: '06',
		title: 'Leadership',
		icon: Award,
		desc: "We foster an environment that encourages bold, creative leadership to attract, retain, and nurture the best talent for tomorrow's challenges.",
	},
	{
		number: '07',
		title: 'Mutual Respect',
		icon: Gem,
		desc: 'We build a positive organizational culture by conducting every interaction with respect, consideration, and fairness for all stakeholders.',
	},
	{
		number: '08',
		title: 'Community',
		icon: Leaf,
		desc: 'We are invested in contributing positively to the society we operate in, improving our surroundings and providing better opportunities for future generations.',
	},
];


export const hrValues = [
    { id: '01', title: 'Professionalism at its Core', description: 'At Finova, we set high standards for professionalism. Our team is comprised of dedicated individuals who take pride in their work, approach challenges with a solutions-oriented mindset, and uphold the highest ethical standards. We foster an environment where every employee is empowered to contribute their unique skills and expertise to drive the success of our organization.' },
    { id: '02', title: 'Collaborative Excellence', description: 'Success at Finova is a team effort. We believe that collaboration is key to achieving outstanding results. Our teams work seamlessly together, leveraging diverse talents and perspectives to solve complex problems and deliver exceptional financial solutions. As a part of Finova, you\'ll experience a culture that encourages teamwork, values open communication, and fosters a collaborative spirit.' },
    { id: '03', title: 'Continuous Learning and Growth', description: 'At Finova, we are committed to the ongoing development of our employees. We provide ample opportunities for professional growth, offering training programs, mentorship opportunities, and a supportive environment for expanding your skill set. Your success is our priority, and we invest in your development to ensure you reach your full potential.' },
    { id: '04', title: 'A Respectful and Inclusive Workplace', description: 'Respect is at the heart of our culture. We embrace diversity and inclusion, recognizing that a variety of perspectives enriches our work environment. At Finova, you are part of a team where everyone\'s contributions are valued and respected. We foster a culture that promotes equal opportunities, regardless of background or experience.' },
    { id: '05', title: 'Join Finova, Join a Family', description: 'When you join Finova, you become part of a family that cares about your success. We celebrate achievements, support each other in times of challenge, and foster a sense of camaraderie that extends beyond the workplace.' },
  ];

  export const galleryImages = [
    { src: "https://www.sosparty.io/imgs/module-grids/91_activities-for-office-christmas-party.jpg", alt: "Team celebrating Christmas" },
    { src: "https://www.sessionlab.com/wp-content/uploads/teambuilding-activities-for-collaboration.jpg", alt: "Team event gathering" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlZAk1WKjxi58xH4WgGTjPtOQz-F6ER9xjWA&s", alt: "Awards ceremony" },
  ];

  export const navigationItems = {
    "About Company": [
      { name: "About Us", link: "/about-us" },
      { name: "Opportunity", link: "/opportunity" },
      { name: "Our Method", link: "/our-method" },
      { name: "Vision And Mission", link: "/vision-and-mission" },
      { name: "Policies", link: "/policies" },
      { name: "Board Of Directors", link: "/board-of-directors" },
      { name: "Key Managerial Personnel", link: "/key-managerial-personnel" },
      { name: "Our Investors", link: "/our-investors" },
    ],
    "Investor Relation": [
      { name: "Financial Information", link: "/financial-information" },
      { name: "Annual Report", link: "/annual-report" },
      { name: "Committees", link: "/committees" },
      {
        name: "Corporate Governance",
        link: "/corporate-governance",
        submenu: [
          { name: "Policies and Codes", link: "/policies-and-codes" },
          { name: "SARFAESI", link: "/sarfaesi" },
          { name: "Credit Rating", link: "/credit-rating" },
        ],
      },
      {
        name: "Shareholder Information",
        link: "/shareholder-information",
        submenu: [
          { name: "Notice Of AGM/EGM/Postal ballot", link: "/notice-Of-ballot" },
          { name: "Disclosures under Regulation 62 of LODR", link: "/under-regulation" },
          { name: "Public Disclosure under Liquidity Risk", link: "/public-disclosure-under-liquidity-risk" },
          { name: "Other Disclosures", link: "/others-disclosures" },
        ],
      },
      { name: "CSR", link: "/csr" },
    ],
    "Media": [
      { name: "News And Media", link: "/News-And-Media" },
      { name: "SARFAESI Auction Notices", link: "/SARFAESI-Auction-Notices" },
    ],
    "Career": [
      { name: "Finova HR", link: "/Finova-HR" },
      { name: "Welcome to Finova", link: "/Welcome-to-Finova" },
      { name: "Employees Benefit", link: "/Employees-Benefit" },
      { name: "Join the Finova Family", link: "/Join-the-Finova-Family" },
      { name: "Apply Now", link: "/Apply-Now" },
    ],
  };