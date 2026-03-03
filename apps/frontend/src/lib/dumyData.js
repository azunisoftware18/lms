import {
	DollarSign,
	Shield,
	Zap,
	UserCheck,
	Briefcase,
	Users,
	Shield,
	Heart,
	Zap,
	DollarSign,
	Briefcase,
	TrendingUp,
	Award,
} from 'lucide-react';

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
