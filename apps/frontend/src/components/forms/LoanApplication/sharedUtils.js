export const personDefaults = () => ({
  title: undefined,
  firstName: "",
  middleName: undefined,
  lastName: "",
  fatherName: "",
  motherName: "",
  woname: undefined,
  sameAsCurrent: false,
  currentAddress: {
    addressLine1: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    landmark: "",
    phoneWithStd: "",
  },
  permanentAddress: {
    addressLine1: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    landmark: "",
    phoneWithStd: "",
  },
  dob: "",
  gender: undefined,
  maritalStatus: undefined,
  category: undefined,
  noOfDependents: "",
  noOfChildren: "",
  correspondenceAddressType: undefined,
  qualification: "",
  passportNumber: "",
  panNumber: "",
  drivingLicenceNo: "",
  aadhaarNumber: "",
  contactNumber: "",
  alternateNumber: "",
  email: "",
  accommodationType: undefined,
  presentAccommodation: undefined,
  periodOfStay: undefined,
  rentPerMonth: "",
  employmentType: undefined,
  additionalOccupationalDetails: [],
  companyName: "",
  companyAddress: "",
  companyCity: "",
  companyDistrict: "",
  companyState: "",
  companyPinCode: "",
  companyLandMark: "",
  companyPhone: "",
  companyExtNo: "",
  workExperience: "",
  noOfEmployees: "",
  commencementDate: undefined,
  professionalType: undefined,
  professionalTypeOther: "",
  businessType: undefined,
  businessTypeOther: "",
  salariedWorkingFor: undefined,
  designation: "",
  department: undefined,
  dateOfJoining: undefined,
  dateOfRetirement: undefined,
  grossMonthlyIncome: null,
  netMonthlyIncome: null,
  averageMonthlyExpenses: null,
  savingBankBalance: null,
  valueOfImmovableProperty: null,
  currentBalanceInPF: null,
  valueOfSharesSecurities: null,
  fixedDeposits: null,
  otherAssets: null,
  totalAssets: null,
  creditSocietyLoan: null,
  employerLoan: null,
  homeLoan: null,
  pfLoan: null,
  vehicleLoan: null,
  personalLoan: null,
  otherLoan: null,
  totalLiabilities: null,
});

export const fillPerson = (prefix, setValue, data) => {
  if (!data) return;
  const m = (path, val) => setValue(`${prefix}.${path}`, val);
  const fullName = data.fullName || data.name || "";
  if (fullName) {
    const parts = String(fullName).trim().split(/\s+/);
    m("firstName", parts.shift() || "");
    m("middleName", parts.length > 1 ? parts.slice(0, -1).join(" ") : "");
    m("lastName", parts.length ? parts.slice(-1).join(" ") : "");
  } else {
    m("firstName", data.firstName || "");
    m("middleName", data.middleName || "");
    m("lastName", data.lastName || "");
  }
  m("fatherName", data.fatherName || "");
  m("motherName", data.motherName || "");
  if (data.dob) {
    const d = typeof data.dob === "string" ? new Date(data.dob) : data.dob;
    const dateStr =
      d instanceof Date && !isNaN(d.getTime())
        ? d.toISOString().split("T")[0]
        : "";
    m("dob", dateStr);
  }
  if (data.gender) m("gender", data.gender);
  if (data.nationality) m("nationality", data.nationality);
  if (data.category) m("category", data.category);
  if (data.contactNumber) m("contactNumber", String(data.contactNumber));
  if (data.alternateNumber) m("alternateNumber", String(data.alternateNumber));
  if (data.email) m("email", data.email);
  if (data.aadhaarNumber) m("aadhaarNumber", String(data.aadhaarNumber));
  if (data.panNumber) m("panNumber", data.panNumber);

  if (data.address) {
    if (typeof data.address === "string") {
      m("currentAddress.addressLine1", data.address);
    } else {
      m(
        "currentAddress.addressLine1",
        data.address.addressLine1 || data.address.line1 || "",
      );
      m("currentAddress.city", data.city || data.address?.city || "");
      m("currentAddress.district", data.address?.district || "");
      m("currentAddress.state", data.state || data.address?.state || "");
      m(
        "currentAddress.pinCode",
        data.pinCode || data.address?.pinCode || data.address?.postal || "",
      );
      m(
        "currentAddress.phoneNumber",
        data.contactNumber ||
          data.address?.phoneNumber ||
          data.address?.phone ||
          "",
      );
    }
  }
  if (data.noOfDependents !== undefined)
    m("noOfDependents", data.noOfDependents);
  if (data.noOfFamilyDependents !== undefined)
    m("noOfDependents", data.noOfFamilyDependents);
  if (data.noOfChildren !== undefined) m("noOfChildren", data.noOfChildren);
  if (data.correspondenceAddressType !== undefined)
    m("correspondenceAddressType", data.correspondenceAddressType);
  if (data.accommodationType !== undefined)
    m("accommodationType", data.accommodationType);
  if (data.presentAccommodation !== undefined)
    m("presentAccommodation", data.presentAccommodation);
  if (data.financialDetails) {
    const f = data.financialDetails;
    if (f.grossMonthlyIncome !== undefined)
      m("grossMonthlyIncome", f.grossMonthlyIncome);
    if (f.netMonthlyIncome !== undefined)
      m("netMonthlyIncome", f.netMonthlyIncome);
    if (f.averageMonthlyExpenses !== undefined)
      m("averageMonthlyExpenses", f.averageMonthlyExpenses);
    if (f.savingBankBalance !== undefined)
      m("savingBankBalance", f.savingBankBalance);
    if (f.valueOfImmovableProperty !== undefined)
      m("valueOfImmovableProperty", f.valueOfImmovableProperty);
    if (f.currentBalanceInPF !== undefined)
      m("currentBalanceInPF", f.currentBalanceInPF);
    if (f.valueOfSharesSecurities !== undefined)
      m("valueOfSharesSecurities", f.valueOfSharesSecurities);
    if (f.valueOfSharesAndSecurities !== undefined)
      m("valueOfSharesSecurities", f.valueOfSharesAndSecurities);
    if (f.fixedDeposits !== undefined) m("fixedDeposits", f.fixedDeposits);
    if (f.otherAssets !== undefined) m("otherAssets", f.otherAssets);
    if (f.totalAssets !== undefined) m("totalAssets", f.totalAssets);
    if (f.creditSocietyLoan !== undefined)
      m("creditSocietyLoan", f.creditSocietyLoan);
    if (f.employerLoan !== undefined) m("employerLoan", f.employerLoan);
    if (f.homeLoan !== undefined) m("homeLoan", f.homeLoan);
    if (f.pfLoan !== undefined) m("pfLoan", f.pfLoan);
    if (f.vehicleLoan !== undefined) m("vehicleLoan", f.vehicleLoan);
    if (f.personalLoan !== undefined) m("personalLoan", f.personalLoan);
    if (f.otherLoan !== undefined) m("otherLoan", f.otherLoan);
    if (f.totalLiabilities !== undefined)
      m("totalLiabilities", f.totalLiabilities);
  }
};
