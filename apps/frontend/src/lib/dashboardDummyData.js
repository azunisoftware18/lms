export const customersData = [
  {
    id: "CUST001",
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    pan: "ABCDE1234F",
    aadhaar: "123456789012",
    city: "Jaipur",
    status: "Active",
    risk: "Low",
    dob: "1990-05-15",
    gender: "Male",
    address: "123, Vaishali Nagar, Jaipur",
    loans: [{ id: "LN-2023", amount: "₹50,000", status: "Active" }],
  },
  {
    id: "CUST002",
    name: "Priya Verma",
    phone: "9988776655",
    email: "priya@example.com",
    pan: "XYZAB5678C",
    aadhaar: "987654321098",
    city: "Delhi",
    status: "Active",
    risk: "Medium",
    dob: "1995-08-20",
    gender: "Female",
    address: "45, Rohini, Delhi",
    loans: [],
  },
  {
    id: "CUST003",
    name: "Amit Kumar",
    phone: "7766554433",
    email: "amit@example.com",
    pan: "PQRST1234L",
    aadhaar: "112233445566",
    city: "Mumbai",
    status: "Blacklisted",
    risk: "High",
    dob: "1988-12-10",
    gender: "Male",
    address: "12, Andheri West, Mumbai",
    loans: [{ id: "LN-2021", amount: "₹2,00,000", status: "Defaulted" }],
  },
];

export const dashboardStats = [
  {
    title: "Total Disbursed",
    value: "₹45.2 Lakh",
    change: "+12.5%",
    icon: "Wallet",
    color: "blue",
    note: "+12.5% from last month",
  },
  {
    title: "Active Loans",
    value: "1,240",
    change: "+4.2%",
    icon: "Users",
    color: "green",
    note: "+4.2% new borrowers",
  },
  {
    title: "Pending Requests",
    value: "45",
    change: null,
    icon: "Clock",
    color: "orange",
    note: "+4.2% new borrowers",
  },
  {
    title: "Overdue Loans",
    value: "₹2.4 Lakh",
    change: "2.1%",
    icon: "AlertCircle",
    color: "red",
    note: "+4.2% new borrowers",
  },
];

export const recentLoans = [
  {
    id: "#LN-2023",
    name: "Amit Sharma",
    amount: "₹50,000",
    type: "Personal",
    status: "Pending",
  },
  {
    id: "#LN-2022",
    name: "Priya Singh",
    amount: "₹2,00,000",
    type: "Home Loan",
    status: "Approved",
  },
];

export const foreclosureData = [
  {
    id: "LN0012345",
    customer: "Arun Sharma",
    requestedDate: "2025-10-20",
    loanAmount: 500000,
    outstanding: 125000,
    foreclosureAmount: 120000,
    status: "Pending Approval",
    daysPending: 4,
    loanType: "Home Loan",
    tenure: "36 months",
    paidEMIs: 24,
  },
  {
    id: "LN0012346",
    customer: "Priya Singh",
    requestedDate: "2025-10-18",
    loanAmount: 120000,
    outstanding: 25000,
    foreclosureAmount: 23000,
    status: "Approved",
    daysPending: 0,
    loanType: "Personal Loan",
    tenure: "24 months",
    paidEMIs: 18,
  },
];

export const nocData = [
  {
    loanId: "LN0030101",
    customer: "Hema Chandra",
    customerId: "CUST001",
    mobile: "+91 9876543210",
    closeDate: "2025-10-01",
    closureType: "Normal Closure",
    printStatus: "Ready to Print",
    deliveryMode: "Email",
    nocNumber: "NOC2025001",
    generatedDate: "2025-10-02",
  },
];

export const users = [
  {
    id: "1",
    fullName: "Super Admin",
    role: "SUPER_ADMIN",
    email: "admin@test.com",
  },
  {
    id: "2",
    fullName: "Rahul Sharma",
    role: "EMPLOYEE",
    email: "rahul@test.com",
  },
];

export const permissions = [
  {
    id: "1",
    name: "View User Permissions",
    code: "VIEW_USER_PERMISSIONS",
  },
  {
    id: "2",
    name: "Assign Permissions",
    code: "ASSIGN_PERMISSIONS",
  },
  {
    id: "3",
    name: "Create Permissions",
    code: "CREATE_PERMISSIONS",
  },
];

export const employees = [
  "Ravi Sharma (Emp-001)",
  "Priya Varma (Emp-002)",
  "Admin",
];

export const partners = [
  "Connect FinTech",
  "Global Loans Inc",
  "Direct Channel",
];

export const loanRequests = [
  {
    id: "LN-1678880000",
    borrower: "Anil Kumar",
    amount: "₹5,00,000",
    type: "Personal Loan",
    status: "Approved",
    loanSource: "Ravi Sharma (Emp-001)",
    approvedBy: "Admin",
  },
  {
    id: "LN-1678880001",
    borrower: "Sunita Mehra",
    amount: "₹20,00,000",
    type: "Home Loan",
    status: "Pending",
    loanSource: "Connect FinTech",
    approvedBy: null,
  },
  {
    id: "LN-1678880002",
    borrower: "Rajesh Gupta",
    amount: "₹1,50,000",
    type: "Business Loan",
    status: "Rejected",
    loanSource: "Priya Varma (Emp-002)",
    approvedBy: "Admin",
  },
];

export const borrowers = [
  {
    id: 1,
    name: "Ravi Sharma",
    phone: "9876543210",
    email: "ravi@email.com",
    branch: "Mumbai",
    status: "active",
  },
  {
    id: 2,
    name: "Priya Verma",
    phone: "9988776655",
    email: "priya@email.com",
    branch: "Delhi",
    status: "pending",
  },
];

export const adminRoles = [
  {
    id: 1,
    name: "Super Admin",
    email: "superadmin@loanapp.com",
    description: "Complete system access",
    permissions: [
      "dashboard",
      "customers",
      "loans",
      "payments",
      "reports",
      "settings",
    ],
    userCount: 1,
  },
  {
    id: 2,
    name: "Manager",
    email: "manager@loanapp.com",
    description: "Loan operations management",
    permissions: ["dashboard", "customers", "loans", "reports"],
    userCount: 3,
  },
];

export const daysConfig = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export const paymentModeConfig = [
  {
    id: "upi",
    label: "UPI",
    icon: "Smartphone",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-300",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    icon: "Building",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-300",
  },
  {
    id: "credit_card",
    label: "Credit Card",
    icon: "CreditCard",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-300",
  },
  {
    id: "debit_card",
    label: "Debit Card",
    icon: "CreditCard",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-300",
  },
  {
    id: "cash",
    label: "Cash",
    icon: "Wallet",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-300",
  },
  {
    id: "cheque",
    label: "Cheque",
    icon: "Clipboard",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-300",
  },
];

export const loanConfigurationDummy = {
  defaultInterestRate: 12.5,
  minInterestRate: 8.0,
  maxInterestRate: 24.0,
  latePaymentPenalty: 2.0,
  processingFee: 1.5,
  prepaymentCharge: 2.0,
  foreclosureCharges: 3.0,

  minLoanAmount: 5000,
  maxLoanAmount: 5000000,
  defaultLoanAmount: 100000,
  autoApprovalLimit: 100000,
  maxLoanPerCustomer: 1000000,

  minTenure: 3,
  maxTenure: 60,
  defaultTenure: 12,
  tenureSteps: [3, 6, 12, 24, 36, 48, 60],

  emiMethod: "reducing_balance",
  emiRounding: 1,
  gracePeriodDays: 5,
  holidayProcessing: true,

  prepaymentAllowed: true,
  foreclosureAllowed: true,
  topUpAllowed: true,
  loanTransferAllowed: false,
  coApplicantRequired: false,
  minCoApplicantIncome: 25000,

  maxDbrRatio: 50,
  minIncomeRequirement: 15000,
  creditScoreMin: 650,
  employmentMinMonths: 6,

  loanCategories: [
    {
      id: 1,
      name: "Personal Loan",
      active: true,
      minAmount: 10000,
      maxAmount: 500000,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Business Loan",
      active: true,
      minAmount: 50000,
      maxAmount: 5000000,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Education Loan",
      active: true,
      minAmount: 50000,
      maxAmount: 1000000,
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "Home Loan",
      active: false,
      minAmount: 1000000,
      maxAmount: 5000000,
      color: "bg-orange-500",
    },
  ],
};

// Loan configuration sections
export const loanConfigCategories = [
  {
    id: "interest",
    label: "Interest & Fees",
    icon: "Percent",
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: "amount",
    label: "Loan Amounts",
    icon: "Banknote",
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "tenure",
    label: "Tenure",
    icon: "Calendar",
    color: "text-green-600 bg-green-50",
  },
  {
    id: "features",
    label: "Features",
    icon: "Settings",
    color: "text-orange-600 bg-orange-50",
  },
  {
    id: "risk",
    label: "Risk Settings",
    icon: "Shield",
    color: "text-red-600 bg-red-50",
  },
  {
    id: "loanTypes",
    label: "Loan Types",
    icon: "PieChart",
    color: "text-indigo-600 bg-indigo-50",
  },
];

// Stats data
export const loanConfigStats = [
  {
    label: "Active Loan Types",
    key: "loanTypes",
    icon: "CreditCard",
    change: "+2",
  },
  {
    label: "Avg Interest Rate",
    key: "interest",
    icon: "TrendingUp",
    change: "-0.5%",
  },
  {
    label: "Auto Approval",
    key: "autoApproval",
    icon: "CheckCircle",
    change: "10%",
  },
  {
    label: "Min Credit Score",
    key: "creditScore",
    icon: "BarChart3",
    change: "+20",
  },
];

export const companyDefaultDetails = {
  name: "Quick Loan Finance Ltd.",
  email: "support@quickloan.com",
  phone: "+91 9876543210",
  address: "123 Business Tower, Sector 18, Noida, UP - 201301",
  website: "www.quickloan.com",
  logo: null,
  favicon: null,
  panNumber: "ABCDE1234F",
  gstNumber: "22ABCDE1234F1Z5",
  cinNumber: "U67190MH2010PLC199123",
  registrationDate: "2015-03-15",
  businessType: "NBFC",
  industry: "Financial Services",
  contactPerson: "Rajesh Sharma",
  contactPersonPhone: "+91 9876543211",
  contactPersonEmail: "rajesh@quickloan.com",
  timezone: "IST (UTC+5:30)",
  currency: "INR (₹)",
  description:
    "A leading NBFC providing quick loan solutions to individuals and small businesses across India.",
};

export const businessTypes = [
  "NBFC",
  "Bank",
  "FinTech",
  "Cooperative Society",
  "Microfinance",
  "Insurance",
  "Other",
];

export const industries = [
  "Financial Services",
  "Banking",
  "Insurance",
  "Investment",
  "Wealth Management",
  "Peer-to-Peer Lending",
  "Digital Payments",
  "Other",
];

export const companyTabs = [
  { id: "basic", label: "Basic Info", icon: "Building2" },
  { id: "contact", label: "Contact", icon: "Phone" },
  { id: "legal", label: "Legal", icon: "Shield" },
  { id: "branding", label: "Branding", icon: "ImageIcon" },
];

export const branches = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
];

export const statusOptions = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "overdue",
    label: "Overdue",
    color: "bg-orange-100 text-orange-800",
  },
  { value: "blocked", label: "Blocked", color: "bg-red-100 text-red-800" },
  { value: "rejected", label: "Rejected", color: "bg-gray-100 text-gray-800" },
  {
    value: "blacklisted",
    label: "Blacklisted",
    color: "bg-purple-100 text-purple-800",
  },
];

export const borrowersData = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    branch: "Mumbai",
    employment: "Software Engineer",
    monthlyIncome: 75000,
    status: "active",
    totalLoans: 2,
    activeLoans: 1,
    totalAmount: 250000,
    overdueAmount: 0,
    creditScore: 720,
    kycStatus: "verified",
    tags: ["Premium"],
  },
  {
    id: 2,
    name: "Amit Kumar",
    phone: "9876543222",
    email: "amit@example.com",
    branch: "Delhi",
    employment: "Business Owner",
    monthlyIncome: 90000,
    status: "overdue",
    totalLoans: 3,
    activeLoans: 2,
    totalAmount: 500000,
    overdueAmount: 25000,
    creditScore: 680,
    kycStatus: "pending",
    tags: ["VIP"],
  },
];

export const MOCK_EMPLOYEES = [
  "Ravi Sharma (Emp-001)",
  "Priya Varma (Emp-002)",
  "Admin",
];

export const MOCK_PARTNERS = [
  "Connect FinTech",
  "Global Loans Inc",
  "Direct Channel",
];

export const INITIAL_ADMIN_LOAN_DATA = [
  {
    id: "LN-1678880000",
    borrower: "Anil Kumar",
    amount: "₹5,00,000",
    type: "Personal Loan",
    status: "Approved",
    loanSource: "Ravi Sharma (Emp-001)",
    approvedBy: "Admin",
    details: {
      mobile: "9876543210",
      email: "anil@example.com",
      loanCategory: "Unsecured",
      tenure: "60 months",
    },
  },
  {
    id: "LN-1678880001",
    borrower: "Sunita Mehra",
    amount: "₹20,00,000",
    type: "Home Loan",
    status: "Pending",
    loanSource: "Connect FinTech",
    approvedBy: null,
    details: {
      mobile: "9988776655",
      email: "sunita@example.com",
      loanCategory: "Secured",
      tenure: "240 months",
    },
  },
];

export const securitySettingsData = {
  // Password Policy
  minPasswordLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  passwordExpiryDays: 90,
  passwordHistoryCount: 5,
  maxPasswordAge: 365,

  // Login Security
  maxLoginAttempts: 5,
  lockDuration: 30,
  sessionTimeout: 30,
  rememberMeDuration: 30,
  concurrentSessions: 3,

  // Two-Factor Authentication
  twoFactorAuth: true,
  twoFactorMethods: ["authenticator", "sms", "email"],
  mandatory2FA: false,
  backupCodesCount: 10,

  // IP Security
  ipWhitelisting: false,
  ipBlacklisting: true,
  allowedIPs: ["192.168.1.1", "10.0.0.1"],
  blockedIPs: [],

  // Device Management
  deviceTracking: true,
  maxDevicesPerUser: 5,
  autoLogoutInactive: true,
  inactiveTimeout: 15,

  // Audit & Logging
  auditLogRetention: 365,
  loginLogging: true,
  sensitiveActionLogging: true,
  logExportEnabled: true,

  // Advanced Security
  encryptionLevel: "high",
  sslEnforcement: true,
  csrfProtection: true,
  xssProtection: true,
  sqlInjectionProtection: true,
};

export const securitySections = [
  { id: "password", label: "Password Policy", icon: "Key", color: "blue" },
  { id: "login", label: "Login Security", icon: "Lock", color: "indigo" },
  { id: "2fa", label: "Two-Factor Auth", icon: "ShieldCheck", color: "purple" },
  { id: "network", label: "Network Security", icon: "Network", color: "green" },
  {
    id: "device",
    label: "Device Management",
    icon: "Fingerprint",
    color: "amber",
  },
  { id: "audit", label: "Audit & Logging", icon: "Clock", color: "gray" },
  { id: "advanced", label: "Advanced Security", icon: "Cpu", color: "red" },
];
