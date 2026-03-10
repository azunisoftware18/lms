export const loanTypeDummyData = [
  {
    code: "PERSONAL_LOAN",
    name: "Personal Loan",
    description: "Unsecured loan for personal expenses",

    category: "PERSONAL_LOAN",
    secured: false,

    minAmount: 50000,
    maxAmount: 1000000,
    minTenureMonths: 12,
    maxTenureMonths: 60,

    interestType: "REDUCING",
    minInterestRate: 10,
    maxInterestRate: 24,
    defaultInterestRate: 14,

    processingFeeType: "PERCENTAGE",
    processingFee: 2,
    gstApplicable: true,
    gstPercentage: 18,

    minAge: 21,
    maxAge: 60,
    minIncome: 20000,
    employmentType: "salaried",

    minCibilScore: 650,
    maxCibilScore: 900,

    maxLoanToValueRatio: 0,

    prepaymentAllowed: true,
    foreclosureAllowed: true,
    prepaymentCharges: 2,
    foreclosureCharges: 3,

    isActive: true,
    isPublic: true,
    approvalRequired: true,

    estimatedProcessingTimeDays: 3,
    documentsRequired: "PAN, Aadhaar, Salary Slip, Bank Statement",
  },

  {
    code: "HOME_LOAN",
    name: "Home Loan",
    description: "Loan for purchasing residential property",

    category: "HOME_LOAN",
    secured: true,

    minAmount: 500000,
    maxAmount: 10000000,
    minTenureMonths: 60,
    maxTenureMonths: 360,

    interestType: "REDUCING",
    minInterestRate: 7,
    maxInterestRate: 12,
    defaultInterestRate: 8.5,

    processingFeeType: "PERCENTAGE",
    processingFee: 1,
    gstApplicable: true,
    gstPercentage: 18,

    minAge: 23,
    maxAge: 65,
    minIncome: 30000,
    employmentType: "salaried",

    minCibilScore: 700,
    maxCibilScore: 900,

    maxLoanToValueRatio: 80,

    prepaymentAllowed: true,
    foreclosureAllowed: true,
    prepaymentCharges: 0,
    foreclosureCharges: 2,

    isActive: true,
    isPublic: true,
    approvalRequired: true,

    estimatedProcessingTimeDays: 7,
    documentsRequired: "PAN, Aadhaar, Income Proof, Property Papers",
  },

  {
    code: "CAR_LOAN",
    name: "Car Loan",
    description: "Loan for purchasing a new or used car",

    category: "CAR_LOAN",
    secured: true,

    minAmount: 100000,
    maxAmount: 1500000,
    minTenureMonths: 12,
    maxTenureMonths: 84,

    interestType: "REDUCING",
    minInterestRate: 8,
    maxInterestRate: 14,
    defaultInterestRate: 10,

    processingFeeType: "PERCENTAGE",
    processingFee: 1.5,
    gstApplicable: true,
    gstPercentage: 18,

    minAge: 21,
    maxAge: 60,
    minIncome: 25000,
    employmentType: "salaried",

    minCibilScore: 680,
    maxCibilScore: 900,

    maxLoanToValueRatio: 90,

    prepaymentAllowed: true,
    foreclosureAllowed: true,
    prepaymentCharges: 2,
    foreclosureCharges: 2,

    isActive: true,
    isPublic: true,
    approvalRequired: true,

    estimatedProcessingTimeDays: 2,
    documentsRequired: "PAN, Aadhaar, Salary Slip, Car Invoice",
  },

  {
    code: "BUSINESS_LOAN",
    name: "Business Loan",
    description: "Loan for business expansion and working capital",

    category: "BUSINESS_LOAN",
    secured: false,

    minAmount: 100000,
    maxAmount: 5000000,
    minTenureMonths: 12,
    maxTenureMonths: 120,

    interestType: "REDUCING",
    minInterestRate: 11,
    maxInterestRate: 22,
    defaultInterestRate: 15,

    processingFeeType: "PERCENTAGE",
    processingFee: 2,
    gstApplicable: true,
    gstPercentage: 18,

    minAge: 23,
    maxAge: 65,
    minIncome: 50000,
    employmentType: "business",

    minCibilScore: 680,
    maxCibilScore: 900,

    maxLoanToValueRatio: 75,

    prepaymentAllowed: true,
    foreclosureAllowed: true,
    prepaymentCharges: 3,
    foreclosureCharges: 4,

    isActive: true,
    isPublic: true,
    approvalRequired: true,

    estimatedProcessingTimeDays: 5,
    documentsRequired: "PAN, GST Certificate, ITR, Bank Statement",
  }
];

export const leadDummyData = [
  {
    leadNumber: "LD0001",
    fullName: "Rahul Sharma",
    contactNumber: "9876543210",
    email: "rahul.sharma@gmail.com",
    dob: "1992-05-12",
    gender: "MALE",

    loanAmount: 300000,
    loanTypeId: "cm123loan001",

    city: "Jaipur",
    state: "Rajasthan",
    pinCode: "302001",
    address: "Vaishali Nagar, Jaipur",

    assignedTo: "cm_user_101",
    assignedBy: "cm_admin_001",
    status: "INTERESTED",
  },

  {
    leadNumber: "LD0002",
    fullName: "Priya Singh",
    contactNumber: "9988776655",
    email: "priya.singh@gmail.com",
    dob: "1995-11-02",
    gender: "FEMALE",

    loanAmount: 500000,
    loanTypeId: "cm123loan002",

    city: "Delhi",
    state: "Delhi",
    pinCode: "110001",
    address: "Dwarka Sector 10",

    assignedTo: "cm_user_102",
    assignedBy: "cm_admin_001",
    status: "APPLICATION_IN_PROGRESS",
  },

  {
    leadNumber: "LD0003",
    fullName: "Amit Verma",
    contactNumber: "9123456789",
    email: "amit.verma@gmail.com",
    dob: "1989-03-20",
    gender: "MALE",

    loanAmount: 1200000,
    loanTypeId: "cm123loan003",

    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400001",
    address: "Andheri West",

    assignedTo: "cm_user_103",
    assignedBy: "cm_admin_001",
    status: "UNDER_REVIEW",
  },

  {
    leadNumber: "LD0004",
    fullName: "Sneha Patel",
    contactNumber: "9012345678",
    email: "sneha.patel@gmail.com",
    dob: "1993-07-15",
    gender: "FEMALE",

    loanAmount: 800000,
    loanTypeId: "cm123loan004",

    city: "Ahmedabad",
    state: "Gujarat",
    pinCode: "380001",
    address: "Navrangpura",

    assignedTo: "cm_user_104",
    assignedBy: "cm_admin_001",
    status: "APPROVED",
  },

  {
    leadNumber: "LD0005",
    fullName: "Mohit Gupta",
    contactNumber: "9098765432",
    email: "mohit.gupta@gmail.com",
    dob: "1990-09-10",
    gender: "MALE",

    loanAmount: 250000,
    loanTypeId: "cm123loan005",

    city: "Lucknow",
    state: "Uttar Pradesh",
    pinCode: "226001",
    address: "Gomti Nagar",

    assignedTo: null,
    assignedBy: null,
    status: "PENDING",
  }
];