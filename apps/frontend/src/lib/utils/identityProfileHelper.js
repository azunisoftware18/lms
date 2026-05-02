const parseProviderDateToIso = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);
    if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      return `${yyyy}-${mm}-${dd}`;
    }

    const direct = new Date(trimmed);
    if (!Number.isNaN(direct.getTime())) {
      return direct.toISOString().split("T")[0];
    }

    return "";
  }

  const fromDate = new Date(value);
  return Number.isNaN(fromDate.getTime())
    ? ""
    : fromDate.toISOString().split("T")[0];
};

const normalizeGenderValue = (gender) => {
  const value = String(gender || "").trim().toUpperCase();
  if (value === "M" || value === "MALE") return "MALE";
  if (value === "F" || value === "FEMALE") return "FEMALE";
  if (value === "O" || value === "OTHER") return "OTHER";
  return "";
};

const splitFullName = (value) => {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    firstName: parts[0] || "",
    middleName: parts.length > 2 ? parts.slice(1, -1).join(" ") : "",
    lastName: parts.length > 1 ? parts[parts.length - 1] : "",
  };
};

export const extractVerifyProfile = (response) => {
  const root = response?.data?.data ?? response?.data ?? response;
  const profile = root?.data && typeof root?.data === "object" ? root.data : root;

  if (!profile || typeof profile !== "object") return null;

  if (
    profile.name ||
    profile.dob ||
    profile.gender ||
    profile.address ||
    profile.split_address
  ) {
    return profile;
  }

  return null;
};

export const normalizePanProfile = (response) => {
  const root = response?.data?.data ?? response?.data ?? response;
  const data = root?.data && typeof root?.data === "object" ? root.data : root;

  if (!data || typeof data !== "object") return null;

  const address = [
    data.buildingName,
    data.streetName,
    data.locality,
    data.city,
    data.state,
    data.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  const providerName = String(
    data.registered_name ||
      data.name_pan_card ||
      data.name ||
      [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ") ||
      "",
  ).trim();
  const parsedName = splitFullName(providerName);

  return {
    ...data,
    name: providerName,
    firstName: data.firstName || parsedName.firstName,
    middleName: data.middleName || parsedName.middleName,
    lastName: data.lastName || parsedName.lastName,
    dob: data.dob,
    gender: data.gender,
    email: data.email,
    panNumber: data.pan || data.panNumber,
    address,
    split_address: {
      house: data.buildingName || "",
      street: data.streetName || "",
      locality: data.locality || "",
      city: data.city || "",
      state: data.state || "",
      pincode: data.pinCode || "",
      landmark: data.landmark || "",
    },
  };
};

const applyAddressFields = (profile, setField) => {
  const splitAddress = profile.split_address || {};
  const addressLine1 =
    [splitAddress.house, splitAddress.street].filter(Boolean).join(", ") ||
    profile.address ||
    "";
  const addressLine2 = splitAddress.locality || "";
  const city = splitAddress.city || splitAddress.vtc || splitAddress.po || splitAddress.dist || "";

  if (addressLine1) setField("addresses.currentAddress.addressLine1", addressLine1);
  if (addressLine2) setField("addresses.currentAddress.addressLine2", addressLine2);
  if (city) setField("addresses.currentAddress.city", city);
  if (splitAddress.dist) setField("addresses.currentAddress.district", splitAddress.dist);
  if (splitAddress.state) setField("addresses.currentAddress.state", splitAddress.state);
  if (splitAddress.pincode) setField("addresses.currentAddress.pinCode", splitAddress.pincode);
  if (splitAddress.landmark) setField("addresses.currentAddress.landmark", splitAddress.landmark);

  if (addressLine1) setField("addresses.permanentAddress.addressLine1", addressLine1);
  if (addressLine2) setField("addresses.permanentAddress.addressLine2", addressLine2);
  if (city) setField("addresses.permanentAddress.city", city);
  if (splitAddress.dist) setField("addresses.permanentAddress.district", splitAddress.dist);
  if (splitAddress.state) setField("addresses.permanentAddress.state", splitAddress.state);
  if (splitAddress.pincode) setField("addresses.permanentAddress.pinCode", splitAddress.pincode);
  if (splitAddress.landmark) setField("addresses.permanentAddress.landmark", splitAddress.landmark);
};

export const applyAadhaarProfile = (profile, aadhaarNumber, setValue) => {
  if (!profile || !setValue) return;

  try {
    console.log("[identityProfileHelper] applyAadhaarProfile called", { profile, aadhaarNumber });
  } catch (e) {
    // ignore logging issues in non-browser environments
  }

  const setField = (path, value) => {
    setValue(path, value ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const fullName = String(profile.name || "").trim();
  if (fullName) {
    const parts = fullName.split(/\s+/);
    setField("applicant.firstName", parts.shift() || "");
    setField(
      "applicant.middleName",
      parts.length > 1 ? parts.slice(0, -1).join(" ") : "",
    );
    setField("applicant.lastName", parts.length ? parts.slice(-1).join(" ") : "");
  }

  const dob = parseProviderDateToIso(profile.dob);
  if (dob) setField("applicant.dob", dob);

  const gender = normalizeGenderValue(profile.gender);
  if (gender) setField("applicant.gender", gender);

  if (profile.email) setField("applicant.email", profile.email);
  if (profile.care_of) setField("applicant.fatherName", profile.care_of);
  if (aadhaarNumber) setField("applicant.aadhaarNumber", String(aadhaarNumber));

  applyAddressFields(profile, setField);
};

export const applyPanProfile = (profile, setValue) => {
  if (!profile || !setValue) return;

  const setField = (path, value) => {
    setValue(path, value ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const firstName = String(profile.firstName || "").trim();
  const middleName = String(profile.middleName || "").trim();
  const lastName = String(profile.lastName || "").trim();
  const fullName = String(profile.name || "").trim();

  if (firstName || middleName || lastName) {
    setField("applicant.firstName", firstName);
    setField("applicant.middleName", middleName);
    setField("applicant.lastName", lastName);
  } else if (fullName) {
    const parts = fullName.split(/\s+/);
    setField("applicant.firstName", parts.shift() || "");
    setField(
      "applicant.middleName",
      parts.length > 1 ? parts.slice(0, -1).join(" ") : "",
    );
    setField("applicant.lastName", parts.length ? parts.slice(-1).join(" ") : "");
  }

  const dob = parseProviderDateToIso(profile.dob);
  if (dob) setField("applicant.dob", dob);

  const gender = normalizeGenderValue(profile.gender);
  if (gender) setField("applicant.gender", gender);

  if (profile.email) setField("applicant.email", profile.email);
  if (profile.panNumber) setField("applicant.panNumber", profile.panNumber);

  applyAddressFields(profile, setField);
};