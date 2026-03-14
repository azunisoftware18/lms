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
  BarChart2,
  FileText,
  Settings,
  Building2,
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

	HOMEIMG2:
		'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmluYW5jZSUyMGNlbnRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
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
        // link: "/corporate-governance",
        submenu: [
          { name: "Policies and Codes", link: "/policies-and-codes" },
          { name: "SARFAESI", link: "/sarfaesi" },
          { name: "Credit Rating", link: "/credit-rating" },
        ],
      },
      {
        name: "Shareholder Information",
        // link: "/shareholder-information",
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


  export const loanAccounts = [
  {
    loanNumber: "LN-2024-00143",
    customer: "Aditya Sharma",
    initials: "AS",
    branch: "Andheri West",
    loanAmount: 750000,
    balance: 612340,
    status: "Active",
  },
  {
    loanNumber: "LN-2024-00087",
    customer: "Priya Nair",
    initials: "PN",
    branch: "Koramangala",
    loanAmount: 1200000,
    balance: 1050000,
    status: "Delinquent",
  },
  {
    loanNumber: "LN-2023-00512",
    customer: "Rahul Gupta",
    initials: "RG",
    branch: "Connaught Place",
    loanAmount: 500000,
    balance: 0,
    status: "Closed",
  },
  {
    loanNumber: "LN-2024-00201",
    customer: "Sneha Pillai",
    initials: "SP",
    branch: "T. Nagar",
    loanAmount: 900000,
    balance: 875000,
    status: "Active",
  },
];

export const mockLoans = [
  {
    id: "LN-2024-00143", customerName: "Aditya Sharma", branch: "Andheri West",
    loanAmount: 750000, outstandingBalance: 612340, status: "Active",
    phone: "+91 98201 34567", email: "aditya.sharma@email.com",
    address: "204, Sai Niwas, Versova Road, Andheri West, Mumbai – 400053",
    interestRate: 10.5, tenure: 60, emiAmount: 16123,
    disbursementDate: "15 Mar 2023", disbursementAmount: 750000, bankAccount: "HDFC Bank •••• 4521",
    principalOutstanding: 498200, interestOutstanding: 114140,
    totalEMIs: 60, paidEMIs: 14, pendingEMIs: 46, nextEMIDate: "15 Apr 2024",
    nachStatus: "Registered", mandateDate: "10 Mar 2023", autoDebit: "Active",
  },
  {
    id: "LN-2024-00087", customerName: "Priya Nair", branch: "Koramangala",
    loanAmount: 1200000, outstandingBalance: 1050000, status: "Delinquent",
    phone: "+91 97740 22891", email: "priya.nair@email.com",
    address: "No. 12, 5th Block, Koramangala, Bengaluru – 560034",
    interestRate: 11.0, tenure: 84, emiAmount: 19450,
    disbursementDate: "02 Jan 2024", disbursementAmount: 1200000, bankAccount: "Axis Bank •••• 8812",
    principalOutstanding: 890000, interestOutstanding: 160000,
    totalEMIs: 84, paidEMIs: 3, pendingEMIs: 81, nextEMIDate: "02 Apr 2024",
    nachStatus: "Failed", mandateDate: "28 Dec 2023", autoDebit: "Suspended",
  },
  {
    id: "LN-2023-00512", customerName: "Rahul Gupta", branch: "Connaught Place",
    loanAmount: 500000, outstandingBalance: 0, status: "Closed",
    phone: "+91 99100 55678", email: "rahul.gupta@email.com",
    address: "A-47, Sector 14, Dwarka, New Delhi – 110078",
    interestRate: 9.75, tenure: 36, emiAmount: 16050,
    disbursementDate: "01 Sep 2020", disbursementAmount: 500000, bankAccount: "SBI Bank •••• 3302",
    principalOutstanding: 0, interestOutstanding: 0,
    totalEMIs: 36, paidEMIs: 36, pendingEMIs: 0, nextEMIDate: "—",
    nachStatus: "Cancelled", mandateDate: "25 Aug 2020", autoDebit: "Inactive",
  },
  {
    id: "LN-2024-00201", customerName: "Sneha Pillai", branch: "T. Nagar",
    loanAmount: 900000, outstandingBalance: 875000, status: "Active",
    phone: "+91 94440 77123", email: "sneha.pillai@email.com",
    address: "22/4, Thyagaraya Road, T. Nagar, Chennai – 600017",
    interestRate: 10.25, tenure: 72, emiAmount: 16820,
    disbursementDate: "20 Feb 2024", disbursementAmount: 900000, bankAccount: "ICICI Bank •••• 6634",
    principalOutstanding: 741000, interestOutstanding: 134000,
    totalEMIs: 72, paidEMIs: 1, pendingEMIs: 71, nextEMIDate: "20 Apr 2024",
    nachStatus: "Registered", mandateDate: "15 Feb 2024", autoDebit: "Active",
  },
  {
    id: "LN-2023-00398", customerName: "Mohammed Iqbal", branch: "Banjara Hills",
    loanAmount: 650000, outstandingBalance: 320000, status: "Active",
    phone: "+91 91002 34890", email: "m.iqbal@email.com",
    address: "Plot 88, Road No. 12, Banjara Hills, Hyderabad – 500034",
    interestRate: 10.75, tenure: 48, emiAmount: 16680,
    disbursementDate: "05 Jun 2022", disbursementAmount: 650000, bankAccount: "Kotak Bank •••• 9901",
    principalOutstanding: 271000, interestOutstanding: 49000,
    totalEMIs: 48, paidEMIs: 22, pendingEMIs: 26, nextEMIDate: "05 Apr 2024",
    nachStatus: "Registered", mandateDate: "01 Jun 2022", autoDebit: "Active",
  },
];

export const mockMandates = [
  { id: "MCH-2024-0143", customer: "Aditya Sharma",    bank: "HDFC Bank",   account: "****4521", limit: 16123,  status: "Active"    },
  { id: "MCH-2024-0087", customer: "Priya Nair",       bank: "Axis Bank",   account: "****8812", limit: 19450,  status: "Suspended" },
  { id: "MCH-2023-0512", customer: "Rahul Gupta",      bank: "SBI Bank",    account: "****3302", limit: 16050,  status: "Cancelled" },
  { id: "MCH-2024-0201", customer: "Sneha Pillai",     bank: "ICICI Bank",  account: "****6634", limit: 16820,  status: "Active"    },
  { id: "MCH-2023-0398", customer: "Mohammed Iqbal",   bank: "Kotak Bank",  account: "****9901", limit: 16680,  status: "Active"    },
  { id: "MCH-2024-0310", customer: "Kavya Reddy",      bank: "Yes Bank",    account: "****2271", limit: 22100,  status: "Suspended" },
  { id: "MCH-2024-0419", customer: "Rohan Mehta",      bank: "PNB Bank",    account: "****7743", limit: 13400,  status: "Active"    },
];

export const mockDebits = [
  { date: "12 Mar 2024", loan: "LN-2024-00143", customer: "Aditya Sharma",  amount: 16123, ref: "HDFC24031200143", status: "Success", reason: "—"                        },
  { date: "05 Mar 2024", loan: "LN-2024-00087", customer: "Priya Nair",     amount: 19450, ref: "AXS24030500087",  status: "Failed",  reason: "Insufficient Funds"       },
  { date: "01 Mar 2024", loan: "LN-2023-00512", customer: "Rahul Gupta",    amount: 16050, ref: "SBI24030100512",  status: "Success", reason: "—"                        },
  { date: "20 Feb 2024", loan: "LN-2024-00201", customer: "Sneha Pillai",   amount: 16820, ref: "ICI24022000201",  status: "Success", reason: "—"                        },
  { date: "15 Feb 2024", loan: "LN-2023-00398", customer: "Mohammed Iqbal", amount: 16680, ref: "KOT24021500398",  status: "Failed",  reason: "Account Dormant"          },
  { date: "10 Feb 2024", loan: "LN-2024-00310", customer: "Kavya Reddy",    amount: 22100, ref: "YES24021000310",  status: "Success", reason: "—"                        },
  { date: "05 Feb 2024", loan: "LN-2024-00419", customer: "Rohan Mehta",    amount: 13400, ref: "PNB24020500419",  status: "Failed",  reason: "Mandate Not Registered"   },
  { date: "01 Feb 2024", loan: "LN-2024-00143", customer: "Aditya Sharma",  amount: 16123, ref: "HDFC24020100143", status: "Success", reason: "—"                        },
];

export const dummyBranches = [
  {
    id: "1",
    name: "Finova Head Office",
    code: "HO-001",
    city: "Mumbai",
    type: "MAIN",
    parentBranch: null,
    head: "Rajesh Kumar",
    isActive: true,
    email: "ho@finova.com",
    phone: "+91 22 1234 5678",
    address: "Bandra Kurla Complex, Mumbai - 400051",
    established: "2010-01-15",
    employees: 250,
    revenue: "₹50Cr",
    subBranches: [
      {
        id: "101",
        name: "Finova Andheri West",
        code: "AND-101",
        city: "Mumbai",
        type: "SUB",
        parentBranch: { id: "1", name: "Finova Head Office" },
        head: "Priya Sharma",
        isActive: true,
        email: "andheri@finova.com",
        phone: "+91 22 2345 6789",
        address: "Andheri West, Mumbai - 400053",
        established: "2015-03-20",
        employees: 45,
        revenue: "₹8Cr",
        subBranches: [
          {
            id: "1011",
            name: "Finova Andheri East",
            code: "ANDE-1011",
            city: "Mumbai",
            type: "SUB",
            parentBranch: { id: "101", name: "Finova Andheri West" },
            head: "Rohan Mehta",
            isActive: true,
            email: "andherieast@finova.com",
            phone: "+91 22 3456 7891",
            address: "Andheri East, Mumbai - 400069",
            established: "2020-06-10",
            employees: 15,
            revenue: "₹2.5Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          }
        ],
        _count: { subBranches: 1 }
      },
      {
        id: "102",
        name: "Finova Borivali",
        code: "BOR-102",
        city: "Mumbai",
        type: "SUB",
        parentBranch: { id: "1", name: "Finova Head Office" },
        head: "Amit Patel",
        isActive: true,
        email: "borivali@finova.com",
        phone: "+91 22 3456 7890",
        address: "Borivali West, Mumbai - 400092",
        established: "2016-08-12",
        employees: 38,
        revenue: "₹7Cr",
        subBranches: [
          {
            id: "1021",
            name: "Finova Kandivali",
            code: "KAN-1021",
            city: "Mumbai",
            type: "SUB",
            parentBranch: { id: "102", name: "Finova Borivali" },
            head: "Sneha Desai",
            isActive: true,
            email: "kandivali@finova.com",
            phone: "+91 22 4567 8901",
            address: "Kandivali West, Mumbai - 400067",
            established: "2021-02-18",
            employees: 12,
            revenue: "₹2Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          }
        ],
        _count: { subBranches: 1 }
      },
      {
        id: "103",
        name: "Finova Thane",
        code: "THA-103",
        city: "Thane",
        type: "SUB",
        parentBranch: { id: "1", name: "Finova Head Office" },
        head: "Vikrant More",
        isActive: true,
        email: "thane@finova.com",
        phone: "+91 22 4567 8902",
        address: "Hiranandani Estate, Thane - 400607",
        established: "2017-11-05",
        employees: 28,
        revenue: "₹5Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      },
      {
        id: "104",
        name: "Finova Navi Mumbai",
        code: "NM-104",
        city: "Navi Mumbai",
        type: "SUB",
        parentBranch: { id: "1", name: "Finova Head Office" },
        head: "Sujata Patil",
        isActive: true,
        email: "navimumbai@finova.com",
        phone: "+91 22 5678 9012",
        address: "Vashi, Navi Mumbai - 400703",
        established: "2018-04-22",
        employees: 32,
        revenue: "₹6Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 4 }
  },
  {
    id: "2",
    name: "Finova Delhi NCR",
    code: "DL-001",
    city: "Delhi",
    type: "MAIN",
    parentBranch: null,
    head: "Vikram Singh",
    isActive: true,
    email: "delhi@finova.com",
    phone: "+91 11 2345 6789",
    address: "Connaught Place, New Delhi - 110001",
    established: "2011-06-20",
    employees: 180,
    revenue: "₹35Cr",
    subBranches: [
      {
        id: "201",
        name: "Finova Gurugram",
        code: "GUR-201",
        city: "Gurugram",
        type: "SUB",
        parentBranch: { id: "2", name: "Finova Delhi NCR" },
        head: "Neha Gupta",
        isActive: true,
        email: "gurugram@finova.com",
        phone: "+91 124 456 7890",
        address: "Cyber City, Gurugram - 122002",
        established: "2016-09-15",
        employees: 65,
        revenue: "₹12Cr",
        subBranches: [
          {
            id: "2011",
            name: "Finova DLF Phase 3",
            code: "DLF-2011",
            city: "Gurugram",
            type: "SUB",
            parentBranch: { id: "201", name: "Finova Gurugram" },
            head: "Arjun Nair",
            isActive: true,
            email: "dlf@finova.com",
            phone: "+91 124 567 8901",
            address: "DLF Phase 3, Gurugram - 122010",
            established: "2021-08-30",
            employees: 18,
            revenue: "₹3Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          },
          {
            id: "2012",
            name: "Finova Sohna Road",
            code: "SOH-2012",
            city: "Gurugram",
            type: "SUB",
            parentBranch: { id: "201", name: "Finova Gurugram" },
            head: "Kavita Sharma",
            isActive: false,
            email: "sohna@finova.com",
            phone: "+91 124 678 9012",
            address: "Sohna Road, Gurugram - 122018",
            established: "2022-01-12",
            employees: 10,
            revenue: "₹1.5Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          }
        ],
        _count: { subBranches: 2 }
      },
      {
        id: "202",
        name: "Finova Noida",
        code: "NOI-202",
        city: "Noida",
        type: "SUB",
        parentBranch: { id: "2", name: "Finova Delhi NCR" },
        head: "Rahul Verma",
        isActive: true,
        email: "noida@finova.com",
        phone: "+91 120 456 7890",
        address: "Sector 62, Noida - 201309",
        established: "2017-03-10",
        employees: 55,
        revenue: "₹10Cr",
        subBranches: [
          {
            id: "2021",
            name: "Finova Sector 18",
            code: "SEC18-2021",
            city: "Noida",
            type: "SUB",
            parentBranch: { id: "202", name: "Finova Noida" },
            head: "Pooja Singh",
            isActive: true,
            email: "sector18@finova.com",
            phone: "+91 120 567 8901",
            address: "Sector 18, Noida - 201301",
            established: "2022-04-05",
            employees: 12,
            revenue: "₹2Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          }
        ],
        _count: { subBranches: 1 }
      },
      {
        id: "203",
        name: "Finova Ghaziabad",
        code: "GHA-203",
        city: "Ghaziabad",
        type: "SUB",
        parentBranch: { id: "2", name: "Finova Delhi NCR" },
        head: "Manoj Tiwari",
        isActive: true,
        email: "ghaziabad@finova.com",
        phone: "+91 120 789 0123",
        address: "Raj Nagar, Ghaziabad - 201002",
        established: "2019-07-19",
        employees: 25,
        revenue: "₹4.5Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      },
      {
        id: "204",
        name: "Finova Faridabad",
        code: "FAR-204",
        city: "Faridabad",
        type: "SUB",
        parentBranch: { id: "2", name: "Finova Delhi NCR" },
        head: "Sunil Yadav",
        isActive: false,
        email: "faridabad@finova.com",
        phone: "+91 129 456 7890",
        address: "Sector 21, Faridabad - 121001",
        established: "2020-11-11",
        employees: 15,
        revenue: "₹2.8Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 4 }
  },
  {
    id: "3",
    name: "Finova Bangalore",
    code: "BLR-001",
    city: "Bangalore",
    type: "MAIN",
    parentBranch: null,
    head: "Suresh Reddy",
    isActive: true,
    email: "bangalore@finova.com",
    phone: "+91 80 2345 6789",
    address: "MG Road, Bangalore - 560001",
    established: "2012-09-05",
    employees: 220,
    revenue: "₹45Cr",
    subBranches: [
      {
        id: "301",
        name: "Finova Whitefield",
        code: "WHT-301",
        city: "Bangalore",
        type: "SUB",
        parentBranch: { id: "3", name: "Finova Bangalore" },
        head: "Anita Desai",
        isActive: true,
        email: "whitefield@finova.com",
        phone: "+91 80 3456 7890",
        address: "Whitefield, Bangalore - 560066",
        established: "2017-12-01",
        employees: 48,
        revenue: "₹9Cr",
        subBranches: [
          {
            id: "3011",
            name: "Finova ITPL",
            code: "ITPL-3011",
            city: "Bangalore",
            type: "SUB",
            parentBranch: { id: "301", name: "Finova Whitefield" },
            head: "Vivek Rao",
            isActive: true,
            email: "itpl@finova.com",
            phone: "+91 80 4567 8901",
            address: "ITPL Main Road, Whitefield - 560066",
            established: "2022-09-15",
            employees: 14,
            revenue: "₹2.2Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          }
        ],
        _count: { subBranches: 1 }
      },
      {
        id: "302",
        name: "Finova Indiranagar",
        code: "IND-302",
        city: "Bangalore",
        type: "SUB",
        parentBranch: { id: "3", name: "Finova Bangalore" },
        head: "Karthik Subramanian",
        isActive: true,
        email: "indiranagar@finova.com",
        phone: "+91 80 4567 8902",
        address: "100 Feet Road, Indiranagar - 560038",
        established: "2018-05-20",
        employees: 42,
        revenue: "₹8.5Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      },
      {
        id: "303",
        name: "Finova Electronic City",
        code: "EC-303",
        city: "Bangalore",
        type: "SUB",
        parentBranch: { id: "3", name: "Finova Bangalore" },
        head: "Divya Prakash",
        isActive: true,
        email: "electroniccity@finova.com",
        phone: "+91 80 5678 9012",
        address: "Phase 1, Electronic City - 560100",
        established: "2019-10-10",
        employees: 35,
        revenue: "₹7Cr",
        subBranches: [
          {
            id: "3031",
            name: "Finova Electronic City Phase 2",
            code: "EC2-3031",
            city: "Bangalore",
            type: "SUB",
            parentBranch: { id: "303", name: "Finova Electronic City" },
            head: "Ramesh Babu",
            isActive: true,
            email: "ecphase2@finova.com",
            phone: "+91 80 6789 0123",
            address: "Phase 2, Electronic City - 560100",
            established: "2023-01-08",
            employees: 8,
            revenue: "₹1.2Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          }
        ],
        _count: { subBranches: 1 }
      },
      {
        id: "304",
        name: "Finova Koramangala",
        code: "KOR-304",
        city: "Bangalore",
        type: "SUB",
        parentBranch: { id: "3", name: "Finova Bangalore" },
        head: "Shilpa Joseph",
        isActive: true,
        email: "koramangala@finova.com",
        phone: "+91 80 7890 1234",
        address: "5th Block, Koramangala - 560095",
        established: "2020-03-15",
        employees: 28,
        revenue: "₹5.5Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 4 }
  },
  {
    id: "4",
    name: "Finova Chennai",
    code: "CHE-001",
    city: "Chennai",
    type: "MAIN",
    parentBranch: null,
    head: "Lakshmi Krishnan",
    isActive: false,
    email: "chennai@finova.com",
    phone: "+91 44 2345 6789",
    address: "Anna Salai, Chennai - 600002",
    established: "2013-04-12",
    employees: 95,
    revenue: "₹18Cr",
    subBranches: [
      {
        id: "401",
        name: "Finova T Nagar",
        code: "TNG-401",
        city: "Chennai",
        type: "SUB",
        parentBranch: { id: "4", name: "Finova Chennai" },
        head: "Sundar Rajan",
        isActive: false,
        email: "tnagar@finova.com",
        phone: "+91 44 3456 7890",
        address: "T Nagar, Chennai - 600017",
        established: "2018-07-22",
        employees: 25,
        revenue: "₹4.2Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      },
      {
        id: "402",
        name: "Finova OMR",
        code: "OMR-402",
        city: "Chennai",
        type: "SUB",
        parentBranch: { id: "4", name: "Finova Chennai" },
        head: "Deepa Venkat",
        isActive: false,
        email: "omr@finova.com",
        phone: "+91 44 4567 8901",
        address: "OMR Road, Chennai - 603103",
        established: "2019-11-30",
        employees: 18,
        revenue: "₹3.1Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 2 }
  },
  {
    id: "5",
    name: "Finova Pune",
    code: "PUN-001",
    city: "Pune",
    type: "MAIN",
    parentBranch: null,
    head: "Sanjay Joshi",
    isActive: true,
    email: "pune@finova.com",
    phone: "+91 20 2345 6789",
    address: "Koregaon Park, Pune - 411001",
    established: "2014-08-25",
    employees: 145,
    revenue: "₹28Cr",
    subBranches: [
      {
        id: "501",
        name: "Finova Hinjewadi",
        code: "HIN-501",
        city: "Pune",
        type: "SUB",
        parentBranch: { id: "5", name: "Finova Pune" },
        head: "Meera Kulkarni",
        isActive: true,
        email: "hinjewadi@finova.com",
        phone: "+91 20 3456 7890",
        address: "Hinjewadi Phase 3, Pune - 411057",
        established: "2018-10-15",
        employees: 52,
        revenue: "₹10Cr",
        subBranches: [
          {
            id: "5011",
            name: "Finova Phase 1",
            code: "HP1-5011",
            city: "Pune",
            type: "SUB",
            parentBranch: { id: "501", name: "Finova Hinjewadi" },
            head: "Amol Pawar",
            isActive: true,
            email: "phase1@finova.com",
            phone: "+91 20 4567 8901",
            address: "Phase 1, Hinjewadi - 411057",
            established: "2022-06-20",
            employees: 15,
            revenue: "₹2.8Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          }
        ],
        _count: { subBranches: 1 }
      },
      {
        id: "502",
        name: "Finova Kothrud",
        code: "KOT-502",
        city: "Pune",
        type: "SUB",
        parentBranch: { id: "5", name: "Finova Pune" },
        head: "Rajendra Deshmukh",
        isActive: true,
        email: "kothrud@finova.com",
        phone: "+91 20 4567 8902",
        address: "Kothrud, Pune - 411038",
        established: "2019-05-08",
        employees: 35,
        revenue: "₹6.5Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      },
      {
        id: "503",
        name: "Finova Viman Nagar",
        code: "VIM-503",
        city: "Pune",
        type: "SUB",
        parentBranch: { id: "5", name: "Finova Pune" },
        head: "Smita Patwardhan",
        isActive: true,
        email: "vimannagar@finova.com",
        phone: "+91 20 5678 9012",
        address: "Viman Nagar, Pune - 411014",
        established: "2020-12-01",
        employees: 22,
        revenue: "₹4Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 3 }
  },
  {
    id: "6",
    name: "Finova Kolkata",
    code: "KOL-001",
    city: "Kolkata",
    type: "MAIN",
    parentBranch: null,
    head: "Arindam Mukherjee",
    isActive: true,
    email: "kolkata@finova.com",
    phone: "+91 33 2345 6789",
    address: "Salt Lake City, Kolkata - 700091",
    established: "2015-02-18",
    employees: 110,
    revenue: "₹22Cr",
    subBranches: [
      {
        id: "601",
        name: "Finova Sector V",
        code: "SEC5-601",
        city: "Kolkata",
        type: "SUB",
        parentBranch: { id: "6", name: "Finova Kolkata" },
        head: "Rina Das",
        isActive: true,
        email: "sector5@finova.com",
        phone: "+91 33 3456 7890",
        address: "Sector V, Salt Lake - 700091",
        established: "2019-09-14",
        employees: 32,
        revenue: "₹6Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      },
      {
        id: "602",
        name: "Finova New Town",
        code: "NT-602",
        city: "Kolkata",
        type: "SUB",
        parentBranch: { id: "6", name: "Finova Kolkata" },
        head: "Sourav Ghosh",
        isActive: true,
        email: "newtown@finova.com",
        phone: "+91 33 4567 8901",
        address: "New Town, Kolkata - 700156",
        established: "2021-03-22",
        employees: 18,
        revenue: "₹3.2Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 2 }
  },
  {
    id: "7",
    name: "Finova Ahmedabad",
    code: "AHM-001",
    city: "Ahmedabad",
    type: "MAIN",
    parentBranch: null,
    head: "Nidhi Shah",
    isActive: true,
    email: "ahmedabad@finova.com",
    phone: "+91 79 2345 6789",
    address: "CG Road, Ahmedabad - 380009",
    established: "2016-11-30",
    employees: 85,
    revenue: "₹17Cr",
    subBranches: [
      {
        id: "701",
        name: "Finova SG Highway",
        code: "SGH-701",
        city: "Ahmedabad",
        type: "SUB",
        parentBranch: { id: "7", name: "Finova Ahmedabad" },
        head: "Kiran Patel",
        isActive: true,
        email: "sghighway@finova.com",
        phone: "+91 79 3456 7890",
        address: "SG Highway, Ahmedabad - 380015",
        established: "2020-08-05",
        employees: 28,
        revenue: "₹5Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      },
      {
        id: "702",
        name: "Finova Vastrapur",
        code: "VAS-702",
        city: "Ahmedabad",
        type: "SUB",
        parentBranch: { id: "7", name: "Finova Ahmedabad" },
        head: "Rakesh Joshi",
        isActive: false,
        email: "vastrapur@finova.com",
        phone: "+91 79 4567 8901",
        address: "Vastrapur, Ahmedabad - 380015",
        established: "2021-12-12",
        employees: 12,
        revenue: "₹2.1Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 2 }
  },
  {
    id: "8",
    name: "Finova Hyderabad",
    code: "HYD-001",
    city: "Hyderabad",
    type: "MAIN",
    parentBranch: null,
    head: "Srinivas Rao",
    isActive: true,
    email: "hyderabad@finova.com",
    phone: "+91 40 2345 6789",
    address: "Hitech City, Hyderabad - 500081",
    established: "2017-05-20",
    employees: 130,
    revenue: "₹26Cr",
    subBranches: [
      {
        id: "801",
        name: "Finova Gachibowli",
        code: "GAC-801",
        city: "Hyderabad",
        type: "SUB",
        parentBranch: { id: "8", name: "Finova Hyderabad" },
        head: "Pavan Kumar",
        isActive: true,
        email: "gachibowli@finova.com",
        phone: "+91 40 3456 7890",
        address: "Gachibowli, Hyderabad - 500032",
        established: "2019-11-18",
        employees: 42,
        revenue: "₹8Cr",
        subBranches: [
          {
            id: "8011",
            name: "Finova Financial District",
            code: "FD-8011",
            city: "Hyderabad",
            type: "SUB",
            parentBranch: { id: "801", name: "Finova Gachibowli" },
            head: "Anjali Reddy",
            isActive: true,
            email: "financialdistrict@finova.com",
            phone: "+91 40 4567 8901",
            address: "Financial District, Hyderabad - 500032",
            established: "2023-02-14",
            employees: 10,
            revenue: "₹1.8Cr",
            subBranches: [],
            _count: { subBranches: 0 }
          }
        ],
        _count: { subBranches: 1 }
      },
      {
        id: "802",
        name: "Finova Madhapur",
        code: "MAD-802",
        city: "Hyderabad",
        type: "SUB",
        parentBranch: { id: "8", name: "Finova Hyderabad" },
        head: "Venkat Reddy",
        isActive: true,
        email: "madhapur@finova.com",
        phone: "+91 40 5678 9012",
        address: "Madhapur, Hyderabad - 500081",
        established: "2020-10-25",
        employees: 28,
        revenue: "₹5.5Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 2 }
  },
  {
    id: "9",
    name: "Finova Jaipur",
    code: "JAI-001",
    city: "Jaipur",
    type: "MAIN",
    parentBranch: null,
    head: "Rajendra Singh",
    isActive: true,
    email: "jaipur@finova.com",
    phone: "+91 141 2345 6789",
    address: "MI Road, Jaipur - 302001",
    established: "2018-03-15",
    employees: 65,
    revenue: "₹12Cr",
    subBranches: [
      {
        id: "901",
        name: "Finova Malviya Nagar",
        code: "MAL-901",
        city: "Jaipur",
        type: "SUB",
        parentBranch: { id: "9", name: "Finova Jaipur" },
        head: "Priyanka Sharma",
        isActive: true,
        email: "malviyanagar@finova.com",
        phone: "+91 141 3456 7890",
        address: "Malviya Nagar, Jaipur - 302017",
        established: "2021-07-08",
        employees: 18,
        revenue: "₹3Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 1 }
  },
  {
    id: "10",
    name: "Finova Lucknow",
    code: "LKO-001",
    city: "Lucknow",
    type: "MAIN",
    parentBranch: null,
    head: "Akhtar Ali",
    isActive: true,
    email: "lucknow@finova.com",
    phone: "+91 522 2345 6789",
    address: "Hazratganj, Lucknow - 226001",
    established: "2019-09-10",
    employees: 55,
    revenue: "₹9.5Cr",
    subBranches: [
      {
        id: "1001",
        name: "Finova Gomti Nagar",
        code: "GOM-1001",
        city: "Lucknow",
        type: "SUB",
        parentBranch: { id: "10", name: "Finova Lucknow" },
        head: "Shalini Gupta",
        isActive: true,
        email: "gontinagar@finova.com",
        phone: "+91 522 3456 7890",
        address: "Gomti Nagar, Lucknow - 226010",
        established: "2022-04-18",
        employees: 14,
        revenue: "₹2.2Cr",
        subBranches: [],
        _count: { subBranches: 0 }
      }
    ],
    _count: { subBranches: 1 }
  }
];

export const dummyBranchAdmins = [
  {
    id: 1,
    fullName: "Rajesh Kumar",
    email: "rajesh@company.com",
    userName: "rajesh.admin",
    contactNumber: "9876543210",
    isActive: true,
    branch: { name: "Finova Mumbai" }
  },
  {
    id: 2,
    fullName: "Vikram Singh",
    email: "vikram@company.com",
    userName: "vikram.admin",
    contactNumber: "9876500000",
    isActive: true,
    branch: { name: "Finova Delhi NCR" }
  },
  {
    id: 3,
    fullName: "Suresh Reddy",
    email: "suresh@company.com",
    userName: "suresh.admin",
    contactNumber: "9123456789",
    isActive: false,
    branch: { name: "Finova Bangalore" }
  }
];

export const dummyLoanProducts = [
  {
    id: 1,
    name: "Personal Loan Standard",
    category: "PERSONAL_LOAN",
    minInterestRate: 9,
    maxInterestRate: 14,
    minAmount: 50000,
    maxAmount: 500000,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    processingFee: 2,
    secured: false,
    createdAt: "2024-01-12",
    status: "active",
    minAge: 21,
    maxAge: 60,
    minIncome: 20000,
    minCibilScore: 650,
    maxCibilScore: 900,
    prepaymentAllowed: true,
    foreclosureAllowed: true,
  },
  {
    id: 2,
    name: "Vehicle Loan Premium",
    category: "VEHICLE_LOAN",
    minInterestRate: 8,
    maxInterestRate: 12,
    minAmount: 100000,
    maxAmount: 2000000,
    minTenureMonths: 12,
    maxTenureMonths: 84,
    processingFee: 1.5,
    secured: true,
    createdAt: "2024-02-05",
    status: "active",
    minAge: 21,
    maxAge: 65,
    minIncome: 25000,
    minCibilScore: 680,
    maxCibilScore: 900,
    prepaymentAllowed: true,
    foreclosureAllowed: false,
  }
];

export const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart2, description: 'Analytics and overview' },
    { id: 'customers', name: 'Customers', icon: Users, description: 'Customer management' },
    { id: 'loans', name: 'Loans', icon: CreditCard, description: 'Loan processing' },
    { id: 'payments', name: 'Payments', icon: FileText, description: 'Payment collection' },
    { id: 'reports', name: 'Reports', icon: BarChart2, description: 'Reports and analytics' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'System configuration' },
    { id: 'adminManagement', name: 'Admin Management', icon: Lock, description: 'Admin controls' },
    { id: 'branch', name: 'Branch Management', icon: Building2, description: 'Branch operations' },
  ];

  export const initialRoles = [
      {
        id: 1,
        name: 'Super Admin',
        description: 'Complete system access with all permissions',
        email: 'superadmin@loanapp.com',
        password: 'admin123',
        permissions: ['dashboard', 'customers', 'loans', 'payments', 'reports', 'settings', 'adminManagement', 'branch'],
        userCount: 1,
        color: 'bg-red-50 text-red-700 border-red-200'
      },
      {
        id: 2,
        name: 'Manager',
        description: 'Managerial access for loan operations',
        email: 'manager@loanapp.com',
        password: 'manager123',
        permissions: ['dashboard', 'customers', 'loans', 'payments', 'reports'],
        userCount: 3,
        color: 'bg-blue-50 text-blue-700 border-blue-200'
      },
      {
        id: 3,
        name: 'Accountant',
        description: 'Financial operations and payments',
        email: 'accountant@loanapp.com',
        password: 'accountant123',
        permissions: ['dashboard', 'payments', 'reports'],
        userCount: 2,
        color: 'bg-green-50 text-green-700 border-green-200'
      },
      {
        id: 4,
        name: 'Telecaller',
        description: 'Customer communication and follow-ups',
        email: 'telecaller@loanapp.com',
        password: 'telecaller123',
        permissions: ['dashboard', 'customers'],
        userCount: 5,
        color: 'bg-purple-50 text-purple-700 border-purple-200'
      },
    ];