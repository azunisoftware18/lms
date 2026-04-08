export const TITLE_OPTIONS = [
  { value: "MR", label: "Mr." },
  { value: "MRS", label: "Mrs." },
  { value: "MS", label: "Ms." },
  { value: "DR", label: "Dr." },
  { value: "PROF", label: "Prof." },
];

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const MARITAL_OPTIONS = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "OTHER", label: "Other" },
];

export const EMPLOYMENT_OPTIONS = [
  { value: "SALARIED", label: "Salaried" },
  { value: "BUSINESS", label: "Business" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "OTHER", label: "Other" },
];

export const CATEGORY_OPTIONS = [
  { value: "GENERAL", label: "General" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "NT", label: "NT" },
  { value: "OBC", label: "OBC" },
  { value: "OTHER", label: "Other" },
];

export const ACCOMMODATION_OPTIONS = [
  { value: "OWN", label: "Owned" },
  { value: "FAMILY", label: "Family" },
  { value: "RENTED", label: "Rented" },
  { value: "EMPLOYER", label: "Employer Provided" },
];

export const RELATION_OPTIONS = [
  { value: "SPOUSE", label: "Spouse" },
  { value: "PARTNER", label: "Partner" },
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "SIBLING", label: "Sibling" },
  { value: "FRIEND", label: "Friend" },
  { value: "OTHER", label: "Other" },
];

export const CORRESPONDENCE_OPTIONS = [
  { value: "RESIDENCE", label: "Applicant's Residence" },
  { value: "OFFICE", label: "Applicant's Office" },
];

export const SALARIED_WORKING_FOR = [
  { value: "PUBLIC_LTD", label: "Public Ltd." },
  { value: "MNC", label: "MNC" },
  { value: "EDUCATIONAL_INST", label: "Educational Inst." },
  { value: "CENTRAL_STATE_GOVT", label: "Central/State Govt" },
  { value: "PUBLIC_SECTOR_UNIT", label: "Public Sector Unit" },
  { value: "PROPRIETOR_PARTNERSHIP", label: "Proprietor/Partnership" },
  { value: "PRIVATE_LTD", label: "Private Ltd." },
  { value: "OTHER", label: "Other" },
];

export const PROFESSIONAL_OPTIONS = [
  { value: "DOCTOR", label: "Doctor" },
  { value: "CA_ICWA_CS", label: "CA/ICWA/CS" },
  { value: "ARCHITECT", label: "Architect" },
  { value: "OTHER", label: "Other (Specify)" },
];

export const BUSINESS_OPTIONS = [
  { value: "TRADER", label: "Trader" },
  { value: "MANUFACTURER", label: "Manufacturer" },
  { value: "WHOLESELLER", label: "Wholeseller" },
  { value: "OTHER", label: "Other (Specify)" },
];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
].map((s) => ({ value: s, label: s }));
