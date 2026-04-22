import React, { useEffect, useState } from "react";
import { Users, Trash2, Plus, UserCheck, TrendingUp } from "lucide-react";

import Button from "../../../ui/Button";
import InputField from "../../../ui/InputField";
import { apiGet } from "../../../../lib/api/apiClient";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../lib/utils/toastService";
import { useAadhaar } from "../../../../hooks/useAadhaar";
import { usePanDetails } from "../../../../hooks/usePan";
import {
  SectionCard,
  PersonPersonalFields,
  PersonEmploymentFields,
  PersonFinancialFields,
} from "../sharedFields";
import { personDefaults, fillPerson } from "../sharedUtils";

const OTP_TIMER_SECONDS = 10 * 60;

const formatSeconds = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const mins = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (safeSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

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
  const g = String(gender || "").trim().toUpperCase();
  if (g === "M" || g === "MALE") return "MALE";
  if (g === "F" || g === "FEMALE") return "FEMALE";
  if (g === "O" || g === "OTHER") return "OTHER";
  return "";
};

const extractVerifyProfile = (response) => {
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

const normalizePanProfile = (response) => {
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
    panNumber: data.pan,
    address,
    split_address: {
      house: data.buildingName || "",
      street: data.streetName || "",
      locality: data.locality || "",
      city: data.city || "",
      state: data.state || "",
      pincode: data.pinCode || "",
    },
  };
};

const applyAadhaarProfileToCoApplicant = (profile, aadhaarNumber, index, setValue) => {
  if (!profile) return;
  const setField = (path, value) => {
    setValue(`coApplicants.${index}.${path}`, value ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const splitAddress = profile.split_address || {};
  const fullName = String(profile.name || "").trim();

  if (fullName) {
    const parts = fullName.split(/\s+/);
    setField("firstName", parts.shift() || "");
    setField(
      "middleName",
      parts.length > 1 ? parts.slice(0, -1).join(" ") : "",
    );
    setField("lastName", parts.length ? parts.slice(-1).join(" ") : "");
  }

  const dob = parseProviderDateToIso(profile.dob);
  if (dob) setField("dob", dob);

  const gender = normalizeGenderValue(profile.gender);
  if (gender) setField("gender", gender);

  if (profile.email) setField("email", profile.email);
  if (profile.care_of) setField("fatherName", profile.care_of);

  setField("aadhaarNumber", String(aadhaarNumber || ""));

  const addressLine1 =
    [splitAddress.house, splitAddress.street].filter(Boolean).join(", ") ||
    profile.address ||
    "";
  const city = splitAddress.vtc || splitAddress.po || splitAddress.dist || "";

  setField("sameAsCurrent", false);
  setField("permanentAddress.addressLine1", addressLine1);
  setField("permanentAddress.addressLine2", splitAddress.locality || "");
  setField("permanentAddress.city", city);
  setField("permanentAddress.district", splitAddress.dist || "");
  setField("permanentAddress.state", splitAddress.state || "");
  setField("permanentAddress.pinCode", splitAddress.pincode || "");
  setField("permanentAddress.landmark", splitAddress.landmark || "");
};

const applyPanProfileToCoApplicant = (profile, index, setValue) => {
  if (!profile) return;
  const setField = (path, value) => {
    setValue(`coApplicants.${index}.${path}`, value ?? "", {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const splitAddress = profile.split_address || {};
  const firstName = String(profile.firstName || "").trim();
  const middleName = String(profile.middleName || "").trim();
  const lastName = String(profile.lastName || "").trim();
  const fullName = String(profile.name || "").trim();

  if (firstName || middleName || lastName) {
    setField("firstName", firstName);
    setField("middleName", middleName);
    setField("lastName", lastName);
  } else if (fullName) {
    const parts = fullName.split(/\s+/);
    setField("firstName", parts.shift() || "");
    setField("middleName", parts.length > 1 ? parts.slice(0, -1).join(" ") : "");
    setField("lastName", parts.length ? parts.slice(-1).join(" ") : "");
  }

  const dob = parseProviderDateToIso(profile.dob);
  if (dob) setField("dob", dob);

  const gender = normalizeGenderValue(profile.gender);
  if (gender) setField("gender", gender);

  if (profile.email) setField("email", profile.email);
  if (profile.panNumber) setField("panNumber", profile.panNumber);

  const addressLine1 =
    [splitAddress.house, splitAddress.street].filter(Boolean).join(", ") ||
    profile.address ||
    "";
  const city = splitAddress.city || splitAddress.vtc || splitAddress.po || "";

  setField("sameAsCurrent", false);
  setField("permanentAddress.addressLine1", addressLine1);
  setField("permanentAddress.addressLine2", splitAddress.locality || "");
  setField("permanentAddress.city", city);
  setField("permanentAddress.district", splitAddress.dist || "");
  setField("permanentAddress.state", splitAddress.state || "");
  setField("permanentAddress.pinCode", splitAddress.pincode || "");
  setField("permanentAddress.landmark", splitAddress.landmark || "");
};

export default function CoApplicantSection({
  control,
  watch,
  setValue,
  fields,
  append,
  remove,
  requiredPaths = new Set(),
}) {
  const [aadhaarQueries, setAadhaarQueries] = useState({});
  const [aadhaarApiResponses, setAadhaarApiResponses] = useState({});
  const [otpMap, setOtpMap] = useState({});
  const [refIdMap, setRefIdMap] = useState({});
  const [otpSentMap, setOtpSentMap] = useState({});
  const [otpVerifiedMap, setOtpVerifiedMap] = useState({});
  const [showOtpModalMap, setShowOtpModalMap] = useState({});
  const [identityMethodMap, setIdentityMethodMap] = useState({});
  const [panQueryMap, setPanQueryMap] = useState({});
  const [otpExpiresAtMap, setOtpExpiresAtMap] = useState({});
  const [otpSecondsLeftMap, setOtpSecondsLeftMap] = useState({});
  const [searchingMap, setSearchingMap] = useState({});
  const { sendOtp, verifyOtp, isLoading: aadhaarLoading } = useAadhaar();
  const { mutateAsync: verifyPanDetails, isPending: panLoading } = usePanDetails();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOtpSecondsLeftMap((prev) => {
        const next = {};
        Object.keys(otpExpiresAtMap).forEach((key) => {
          const expiresAt = otpExpiresAtMap[key];
          if (!expiresAt) {
            next[key] = 0;
            return;
          }
          next[key] = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [otpExpiresAtMap]);

  const isOtpExpired = (index) =>
    !!otpSentMap[index] && (otpSecondsLeftMap[index] || 0) === 0;

  const handleSendOtp = async (index) => {
    const q = (aadhaarQueries[index] || "").replace(/\D/g, "").slice(0, 12);
    if (q.length !== 12) return showInfo("Enter valid 12-digit Aadhaar");

    try {
      setSearchingMap((s) => ({ ...s, [index]: true }));
      const res = await sendOtp.mutateAsync({ aadhaarNumber: q });
      console.log(`[Aadhaar][Co-Applicant ${index + 1}] Send OTP response:`, res);
      const refId = res?.data?.ref_id || res?.data?.data?.ref_id || res?.ref_id || "";
      setRefIdMap((s) => ({ ...s, [index]: refId }));
      setOtpSentMap((s) => ({ ...s, [index]: true }));
      setOtpVerifiedMap((s) => ({ ...s, [index]: false }));
      setOtpMap((s) => ({ ...s, [index]: "" }));
      setOtpExpiresAtMap((s) => ({
        ...s,
        [index]: Date.now() + OTP_TIMER_SECONDS * 1000,
      }));
      setShowOtpModalMap((s) => ({ ...s, [index]: true }));
    } catch (err) {
      showError(err?.message || "Failed to send OTP");
    } finally {
      setSearchingMap((s) => ({ ...s, [index]: false }));
    }
  };

  const handleAadhaarButtonClick = (index) => {
    setIdentityMethodMap((s) => ({ ...s, [index]: "AADHAAR" }));
    setShowOtpModalMap((s) => ({ ...s, [index]: true }));
  };

  const handlePanFetch = async (index) => {
    const normalizedPan = String(panQueryMap[index] || "").trim().toUpperCase();
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(normalizedPan)) {
      return showInfo("Enter valid PAN (ABCDE1234F)");
    }

    try {
      setSearchingMap((s) => ({ ...s, [index]: true }));
      const res = await verifyPanDetails({ panNumber: normalizedPan });
      const payload = res?.data ?? res;
      setValue(`coApplicants.${index}.panProvider`, payload);
      const profile = normalizePanProfile(res);
      const seedStatus = String(profile?.aadhaar_seeding_status || "").toUpperCase();
      if (seedStatus && seedStatus !== "Y") {
        showError(profile?.aadhaar_seeding_status_desc || "Aadhaar is not linked to PAN");
        return;
      }
      if (profile) {
        applyPanProfileToCoApplicant(profile, index, setValue);
      }
      setOtpVerifiedMap((s) => ({ ...s, [index]: true }));
      setShowOtpModalMap((s) => ({ ...s, [index]: false }));
      showSuccess("PAN details loaded");
    } catch (err) {
      showError(err?.message || "Failed to fetch PAN details");
    } finally {
      setSearchingMap((s) => ({ ...s, [index]: false }));
    }
  };

  const handleVerifyOtp = async (index) => {
    const aadhaar = (aadhaarQueries[index] || "")
      .replace(/\D/g, "")
      .slice(0, 12);
    const otp = (otpMap[index] || "").replace(/\D/g, "").slice(0, 6);
    if (aadhaar.length !== 12) return showInfo("Enter valid 12-digit Aadhaar");
    if (otp.length < 4) return showInfo("Enter valid 4-6 digit OTP");
    if (isOtpExpired(index)) return showInfo("OTP expired. Please resend OTP.");
    if (!refIdMap[index]) return showInfo("Missing ref_id. Please send OTP again.");

    try {
      setSearchingMap((s) => ({ ...s, [index]: true }));
      const res = await verifyOtp.mutateAsync({
        ref_id: refIdMap[index],
        otp,
      });
      console.log(`[Aadhaar][Co-Applicant ${index + 1}] Verify OTP response:`, res);
      setAadhaarApiResponses((s) => ({ ...s, [index]: res }));
      try {
        setValue(`coApplicants.${index}.aadhaarProvider`, res?.data ?? res);
      } catch (e) {
        console.error(`Failed to set coApplicants.${index}.aadhaarProvider on form:`, e);
      }
      try {
        const profile = extractVerifyProfile(res);
        if (profile) {
          applyAadhaarProfileToCoApplicant(profile, aadhaar, index, setValue);
        }
      } catch (e) {
        console.error(`Failed to apply Aadhaar profile to coApplicants.${index}:`, e);
      }
      setOtpVerifiedMap((s) => ({ ...s, [index]: true }));
      setShowOtpModalMap((s) => ({ ...s, [index]: false }));
      await handleCoApplicantAadhaarSearch(index);
      showSuccess("OTP verified and customer details loaded");
    } catch (err) {
      showError(err?.message || "OTP verification failed");
    } finally {
      setSearchingMap((s) => ({ ...s, [index]: false }));
    }
  };

  const handleCoApplicantAadhaarSearch = async (index) => {
    const q = (aadhaarQueries[index] || "").replace(/\D/g, "").slice(0, 12);
    if (!q) return showInfo("Enter Aadhaar to search");
    if (!otpVerifiedMap[index]) {
      return showInfo("Verify OTP first, then fetch Aadhaar details");
    }
    try {
      setSearchingMap((s) => ({ ...s, [index]: true }));
      const res = await apiGet(`/customers`, { params: { aadhaar: q } });
      const data = res?.data ?? res;
      fillPerson(`coApplicants.${index}`, setValue, data);
      showSuccess("Customer details loaded");
    } catch (err) {
      showError(err?.message || "No record found for Aadhaar");
    } finally {
      setSearchingMap((s) => ({ ...s, [index]: false }));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
        <div>
          <h3 className="font-bold text-blue-800 text-sm">Co-Applicants</h3>
          <p className="text-xs text-blue-500 mt-0.5">
            Add co-applicants to strengthen the application
          </p>
        </div>
        <Button
          type="button"
          onClick={() => append({ ...personDefaults() })}
          className="py-2! px-4! text-xs!"
        >
          <Plus size={13} /> Add Co-Applicant
        </Button>
      </div>
      {fields.length === 0 && (
        <div className="text-center py-14 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <Users size={36} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-400 font-semibold text-sm">
            No co-applicants added
          </p>
        </div>
      )}
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-blue-700 text-sm">
              Co-Applicant {index + 1}
            </h3>
            <Button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-50! text-red-600! border border-red-200 shadow-none! py-1.5! px-3! text-xs!"
            >
              <Trash2 size={13} /> Remove
            </Button>
          </div>

          <div className="mb-4 flex justify-end">
            <Button
              type="button"
              onClick={() => handleAadhaarButtonClick(index)}
              disabled={!!searchingMap[index] || aadhaarLoading}
            >
              Use Aadhaar / PAN Identity
            </Button>
          </div>

          {showOtpModalMap[index] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl">
                <h3 className="text-base font-semibold">Fetch Identity</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Choose Aadhaar OTP or PAN lookup.
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    onClick={() =>
                      setIdentityMethodMap((s) => ({ ...s, [index]: "AADHAAR" }))
                    }
                    className={
                      identityMethodMap[index] === "PAN"
                        ? ""
                        : "bg-blue-600 text-white"
                    }
                  >
                    Aadhaar
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      setIdentityMethodMap((s) => ({ ...s, [index]: "PAN" }))
                    }
                    className={
                      identityMethodMap[index] === "PAN"
                        ? "bg-blue-600 text-white"
                        : ""
                    }
                  >
                    PAN
                  </Button>
                </div>

                {(identityMethodMap[index] || "AADHAAR") === "AADHAAR" ? (
                  <>
                    <div className="mt-4">
                      <InputField
                        label="Aadhaar"
                        value={aadhaarQueries[index] || ""}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/\D/g, "").slice(0, 12);
                          setAadhaarQueries((s) => ({ ...s, [index]: sanitized }));
                          setOtpMap((s) => ({ ...s, [index]: "" }));
                          setOtpSentMap((s) => ({ ...s, [index]: false }));
                          setOtpVerifiedMap((s) => ({ ...s, [index]: false }));
                          setRefIdMap((s) => ({ ...s, [index]: "" }));
                          setOtpExpiresAtMap((s) => ({ ...s, [index]: 0 }));
                        }}
                        placeholder="Enter 12-digit Aadhaar"
                      />
                    </div>
                    {otpSentMap[index] && (
                      <>
                        <p className="mt-1 text-xs text-gray-500">
                          OTP expires in {formatSeconds(otpSecondsLeftMap[index] || 0)}
                        </p>
                        <div className="mt-4">
                          <InputField
                            label="OTP"
                            value={otpMap[index] || ""}
                            onChange={(e) =>
                              setOtpMap((s) => ({
                                ...s,
                                [index]: e.target.value.replace(/\D/g, "").slice(0, 6),
                              }))
                            }
                            placeholder="Enter 4-6 digit OTP"
                          />
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-4">
                    <InputField
                      label="PAN"
                      value={panQueryMap[index] || ""}
                      onChange={(e) =>
                        setPanQueryMap((s) => ({
                          ...s,
                          [index]: e.target.value.toUpperCase().slice(0, 10),
                        }))
                      }
                      placeholder="ABCDE1234F"
                    />
                  </div>
                )}

                <div className="mt-4 flex items-center justify-end gap-2">
                  {(identityMethodMap[index] || "AADHAAR") === "AADHAAR" ? (
                    <>
                      <Button
                        type="button"
                        onClick={() =>
                          setShowOtpModalMap((s) => ({ ...s, [index]: false }))
                        }
                        disabled={verifyOtp.isPending}
                      >
                        Cancel
                      </Button>
                      {!otpSentMap[index] ? (
                        <Button
                          type="button"
                          onClick={() => handleSendOtp(index)}
                          disabled={
                            sendOtp.isPending ||
                            (aadhaarQueries[index] || "").length !== 12
                          }
                        >
                          {sendOtp.isPending ? "Sending..." : "Send OTP"}
                        </Button>
                      ) : (
                        <>
                          <Button
                            type="button"
                            onClick={() => handleSendOtp(index)}
                            disabled={
                              sendOtp.isPending ||
                              (otpSecondsLeftMap[index] || 0) > 0 ||
                              (aadhaarQueries[index] || "").length !== 12
                            }
                          >
                            {sendOtp.isPending
                              ? "Resending..."
                              : (otpSecondsLeftMap[index] || 0) > 0
                                ? `Resend in ${formatSeconds(otpSecondsLeftMap[index])}`
                                : "Resend OTP"}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleVerifyOtp(index)}
                            disabled={
                              verifyOtp.isPending ||
                              (otpMap[index] || "").length < 4 ||
                              isOtpExpired(index) ||
                              !refIdMap[index]
                            }
                          >
                            {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        onClick={() =>
                          setShowOtpModalMap((s) => ({ ...s, [index]: false }))
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handlePanFetch(index)}
                        disabled={panLoading || !/^[A-Z]{5}\d{4}[A-Z]$/.test(String(panQueryMap[index] || "").trim().toUpperCase())}
                      >
                        {panLoading ? "Fetching..." : "Fetch PAN"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <SectionCard
            title={`Co-Applicant ${index + 1} — Personal Details`}
            icon={UserCheck}
          >
            <PersonPersonalFields
              control={control}
              prefix={`coApplicants.${index}`}
              watch={watch}
              setValue={setValue}
            />
          </SectionCard>
          <PersonEmploymentFields
            control={control}
            watch={watch}
            prefix={`coApplicants.${index}`}
            setValue={setValue}
            requiredPaths={requiredPaths}
          />
          <SectionCard
            title={`Co-Applicant ${index + 1} — Financial Status`}
            icon={TrendingUp}
            accentColor="emerald"
          >
            <PersonFinancialFields
              control={control}
              watch={watch}
              setValue={setValue}
              prefix={`coApplicants.${index}`}
            />
          </SectionCard>
        </div>
      ))}
    </div>
  );
}
