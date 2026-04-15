import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { User, Phone, IndianRupee } from "lucide-react";

import Button from "../../../ui/Button";
import InputField from "../../../ui/InputField";
import SelectField from "../../../ui/SelectField";
import { apiGet } from "../../../../lib/api/apiClient";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../lib/utils/toastService";
import { useGetLead } from "../../../../hooks/useLead";
import { useAadhaar } from "../../../../hooks/useAadhaar";
import {
  SectionCard,
  Grid,
  PersonEmploymentFields,
  PersonFinancialFields,
} from "../sharedFields";
import {
  TITLE_OPTIONS,
  GENDER_OPTIONS,
  CATEGORY_OPTIONS,
  MARITAL_OPTIONS,
  EMPLOYMENT_OPTIONS,
  ACCOMMODATION_OPTIONS,
} from "../constants";
import AddressSection from "./AddressSection";
import LoanRequirementSection from "./LoanRequirementSection";

const OTP_TIMER_SECONDS = 10 * 60;

const formatSeconds = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const mins = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (safeSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export default function ApplicantSection({
  control,
  errors,
  watch,
  setValue,
  loanTypeOptions,
  mode = "all",
  requiredPaths = new Set(),
}) {
  const [leadQuery, setLeadQuery] = useState("");
  const [aadhaarQuery, setAadhaarQuery] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [showAadhaarOtpModal, setShowAadhaarOtpModal] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0);
  const [searching, setSearching] = useState(false);
  const leadQueryHook = useGetLead(leadQuery, { enabled: false });
  const { sendOtp, verifyOtp, isLoading: aadhaarLoading } = useAadhaar();

  useEffect(() => {
    if (!otpExpiresAt) {
      setOtpSecondsLeft(0);
      return;
    }

    const updateTimer = () => {
      const seconds = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
      setOtpSecondsLeft(seconds);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [otpExpiresAt]);

  const isOtpExpired = aadhaarOtpSent && otpSecondsLeft === 0;
  const fillApplicant = (data) => {
    if (!data) return;
    const m = (path, val) => setValue(path, val);
    const fullName = data.fullName || data.name || "";
    if (fullName) {
      const parts = String(fullName).trim().split(/\s+/);
      m("applicant.firstName", parts.shift() || "");
      m(
        "applicant.middleName",
        parts.length > 1 ? parts.slice(0, -1).join(" ") : "",
      );
      m("applicant.lastName", parts.length ? parts.slice(-1).join(" ") : "");
    } else {
      m("applicant.firstName", data.firstName || "");
      m("applicant.middleName", data.middleName || "");
      m("applicant.lastName", data.lastName || "");
    }

    m("applicant.fatherName", data.fatherName || "");
    m("applicant.motherName", data.motherName || "");

    if (data.dob) {
      const d = typeof data.dob === "string" ? new Date(data.dob) : data.dob;
      const dateStr =
        d instanceof Date && !isNaN(d.getTime())
          ? d.toISOString().split("T")[0]
          : "";
      m("applicant.dob", dateStr);
    }

    if (data.gender) m("applicant.gender", data.gender);
    if (data.nationality) m("applicant.nationality", data.nationality);
    if (data.category) m("applicant.category", data.category);
    if (data.contactNumber)
      m("applicant.contactNumber", String(data.contactNumber));
    if (data.alternateNumber)
      m("applicant.alternateNumber", String(data.alternateNumber));
    if (data.email) m("applicant.email", data.email);
    if (data.aadhaarNumber)
      m("applicant.aadhaarNumber", String(data.aadhaarNumber));
    if (data.panNumber) m("applicant.panNumber", data.panNumber);
    if (data.presentAccommodation)
      m("applicant.presentAccommodation", data.presentAccommodation);

    if (data.address) {
      if (typeof data.address === "string") {
        m("addresses.currentAddress.addressLine1", data.address);
      } else {
        m(
          "addresses.currentAddress.addressLine1",
          data.address.addressLine1 || data.address.line1 || "",
        );
      }
      m(
        "addresses.currentAddress.city",
        data.city || (data.address && data.address.city) || "",
      );
      m(
        "addresses.currentAddress.district",
        (data.address && data.address.district) || "",
      );
      m(
        "addresses.currentAddress.state",
        data.state || (data.address && data.address.state) || "",
      );
      m(
        "addresses.currentAddress.pinCode",
        data.pinCode ||
          (data.address && (data.address.pinCode || data.address.postal)) ||
          "",
      );
      m(
        "addresses.currentAddress.phoneNumber",
        data.contactNumber ||
          (data.address && (data.address.phoneNumber || data.address.phone)) ||
          "",
      );
    }

    if (data.loanAmount !== undefined && data.loanAmount !== null) {
      m("loanRequirement.loanAmount", Number(data.loanAmount));
    }
    if (data.loanType && data.loanType.id) {
      m("loanTypeId", data.loanType.id);
    }
  };

  const handleLeadSearch = async () => {
    if (!leadQuery) return showInfo("Enter a lead number to search");
    setSearching(true);
    try {
      const r = await leadQueryHook.refetch();
      const item = r?.data ?? null;
      if (!item) throw new Error("Lead not found");
      fillApplicant(item);
      showSuccess("Lead details loaded");
    } catch (err) {
      showError(err?.message || "Lead not found");
    } finally {
      setSearching(false);
    }
  };

  const handleAadhaarSearch = async () => {
    if (!aadhaarQuery) return showInfo("Enter Aadhaar to search");
    if (!aadhaarVerified) {
      return showInfo("Verify OTP first, then fetch Aadhaar details");
    }
    const val = aadhaarQuery.replace(/\D/g, "").slice(0, 12);
    try {
      setSearching(true);
      const res = await apiGet(`/customers`, { params: { aadhaar: val } });
      const data = res?.data ?? res;
      fillApplicant(data);
      showSuccess("Customer details loaded");
    } catch (err) {
      showError(err?.message || "No record found for Aadhaar");
    } finally {
      setSearching(false);
    }
  };

  const handleSendAadhaarOtp = async () => {
    const val = aadhaarQuery.replace(/\D/g, "").slice(0, 12);
    if (val.length !== 12) return showInfo("Enter valid 12-digit Aadhaar");

    try {
      const res = await sendOtp.mutateAsync({
        aadhaarNumber: val,
      });
      console.log("[Aadhaar] Send OTP response:", res);
      setAadhaarOtpSent(true);
      setAadhaarVerified(false);
      setAadhaarOtp("");
      setOtpExpiresAt(Date.now() + OTP_TIMER_SECONDS * 1000);
      setShowAadhaarOtpModal(true);
    } catch (err) {
      showError(err?.message || "Failed to send OTP");
    }
  };

  const handleAadhaarButtonClick = () => {
    if (aadhaarOtpSent && !aadhaarVerified) {
      setShowAadhaarOtpModal(true);
      return;
    }
    handleSendAadhaarOtp();
  };

  const handleVerifyAadhaarOtp = async () => {
    const val = aadhaarQuery.replace(/\D/g, "").slice(0, 12);
    const otp = aadhaarOtp.replace(/\D/g, "").slice(0, 6);
    if (val.length !== 12) return showInfo("Enter valid 12-digit Aadhaar");
    if (otp.length !== 6) return showInfo("Enter valid 6-digit OTP");
    if (isOtpExpired) return showInfo("OTP expired. Please resend OTP.");

    try {
      const res = await verifyOtp.mutateAsync({
        aadhaarNumber: val,
        otp,
      });
      console.log("[Aadhaar] Verify OTP response:", res);
      setAadhaarVerified(true);
      setShowAadhaarOtpModal(false);
      showSuccess("OTP verified successfully");
    } catch (err) {
      showError(err?.message || "OTP verification failed");
    }
  };

  return (
    <div>
      {(mode === "personal" || mode === "all") && (
        <>
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <InputField
                  label="Fetch by Lead Number"
                  value={leadQuery}
                  onChange={(e) => setLeadQuery(e.target.value)}
                  placeholder="Enter Lead Number"
                />
              </div>
              <div className="mt-6">
                <Button
                  type="button"
                  onClick={handleLeadSearch}
                  disabled={searching}
                >
                  {searching ? "Fetching..." : "Fetch"}
                </Button>
              </div>
            </div>


            {/* /// Aadhaar fetch section is moved to the personal information section for better UX, so leaving this space blank for now. */}

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <InputField
                  label="Fetch by Aadhaar"
                  value={aadhaarQuery}
                  onChange={(e) => {
                    const sanitized = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 12);
                    setAadhaarQuery(sanitized);
                    setAadhaarOtp("");
                    setAadhaarOtpSent(false);
                    setAadhaarVerified(false);
                    setOtpExpiresAt(null);
                    setOtpSecondsLeft(0);
                    setShowAadhaarOtpModal(false);
                  }}
                  placeholder="Enter 12-digit Aadhaar"
                />
              </div>
              <div className="mt-6">
                <Button
                  type="button"
                  onClick={handleAadhaarButtonClick}
                  disabled={
                    searching ||
                    aadhaarLoading ||
                    aadhaarQuery.length !== 12
                  }
                >
                  {sendOtp.isPending ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            </div>

            {/* {aadhaarOtpSent && (
              <div className="flex items-end gap-3">
                <div className="mt-6 flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => setShowAadhaarOtpModal(true)}
                    disabled={searching || aadhaarLoading || aadhaarVerified}
                  >
                    {aadhaarVerified ? "Verified" : "Verify OTP"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAadhaarSearch}
                    disabled={searching || aadhaarLoading || !aadhaarVerified}
                  >
                    {searching ? "Fetching..." : "Fetch"}
                  </Button>
                </div>
              </div>
            )} */}
          </div>

          <SectionCard title="Personal Information" icon={User}>
            <div className="space-y-4">
              <Grid cols={3}>
                <Controller
                  name="applicant.title"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Title"
                      isRequired
                      options={TITLE_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.applicant?.title?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.firstName"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="First Name"
                      isRequired
                      {...field}
                      error={errors.applicant?.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.middleName"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Middle Name" {...field} />
                  )}
                />
              </Grid>

              <Grid cols={3}>
                <Controller
                  name="applicant.lastName"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Last Name"
                      isRequired
                      {...field}
                      error={errors.applicant?.lastName?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.fatherName"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Father's Name"
                      isRequired
                      {...field}
                      error={errors.applicant?.fatherName?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.motherName"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Mother's Name"
                      isRequired
                      {...field}
                      error={errors.applicant?.motherName?.message}
                    />
                  )}
                />
              </Grid>

              <Controller
                name="applicant.woname"
                control={control}
                render={({ field }) => <InputField label="W/o" {...field} />}
              />

              <Grid cols={3}>
                <Controller
                  name="applicant.dob"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Date of Birth"
                      type="date"
                      isRequired
                      {...field}
                      error={errors.applicant?.dob?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.gender"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Gender"
                      isRequired
                      options={GENDER_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.applicant?.gender?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.nationality"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Nationality"
                      isRequired
                      {...field}
                      error={errors.applicant?.nationality?.message}
                    />
                  )}
                />
              </Grid>

              <Grid cols={2}>
                <Controller
                  name="applicant.category"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Category"
                      isRequired
                      options={CATEGORY_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.applicant?.category?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Marital Status"
                      isRequired
                      options={MARITAL_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.applicant?.maritalStatus?.message}
                    />
                  )}
                />
              </Grid>

              <Grid cols={2}>
                <Controller
                  name="applicant.qualification"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Qualification"
                      options={[
                        { value: "MATRIC", label: "Matriculation" },
                        { value: "INTERMEDIATE", label: "Intermediate" },
                        { value: "GRADUATE", label: "Graduate" },
                        { value: "POSTGRADUATE", label: "Post Graduate" },
                        { value: "DOCTORATE", label: "Doctorate" },
                        { value: "OTHER", label: "Other" },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.applicant?.qualification?.message}
                    />
                  )}
                />
              </Grid>

              <Controller
                name="applicant.employmentType"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Employment Type"
                    isRequired
                    options={EMPLOYMENT_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.applicant?.employmentType?.message}
                  />
                )}
              />

              <Grid cols={2}>
                <Controller
                  name="applicant.aadhaarNumber"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Aadhaar Number"
                      isRequired
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 12),
                        )
                      }
                      error={errors.applicant?.aadhaarNumber?.message}
                      placeholder="Enter 12-digit Aadhaar Number"
                    />
                  )}
                />
                <Controller
                  name="applicant.voterId"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Voter ID" {...field} />
                  )}
                />
              </Grid>
            </div>
          </SectionCard>

          <SectionCard title="Contact Details" icon={Phone}>
            <div className="space-y-4">
              <Grid>
                <Controller
                  name="applicant.contactNumber"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Mobile Number"
                      type="tel"
                      isRequired
                      icon={Phone}
                      hint="10-digit"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      error={errors.applicant?.contactNumber?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.alternateNumber"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="Alternate Number"
                      type="tel"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                    />
                  )}
                />
              </Grid>

              <Controller
                name="applicant.email"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Email Address"
                    type="email"
                    {...field}
                    error={errors.applicant?.email?.message}
                  />
                )}
              />

              <Controller
                name="applicant.presentAccommodation"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Accommodation Type"
                    isRequired
                    options={ACCOMMODATION_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors?.applicant?.presentAccommodation?.message}
                  />
                )}
              />

              <Grid>
                <Controller
                  name="applicant.periodOfStay"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Period of Stay" {...field} />
                  )}
                />
                <Controller
                  name="applicant.rentPerMonth"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="If Rented Rent p.m. (₹)"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid cols={3}>
                <Controller
                  name="applicant.passportNumber"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Passport No." {...field} />
                  )}
                />
                <Controller
                  name="applicant.panNumber"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      label="PAN No."
                      isRequired
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.toUpperCase().slice(0, 10),
                        )
                      }
                      error={errors.applicant?.panNumber?.message}
                    />
                  )}
                />
                <Controller
                  name="applicant.drivingLicenceNo"
                  control={control}
                  render={({ field }) => (
                    <InputField label="Driving Licence No." {...field} />
                  )}
                />
              </Grid>
            </div>
          </SectionCard>

          <AddressSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <PersonEmploymentFields
            control={control}
            watch={watch}
            prefix="applicant"
            setValue={setValue}
            requiredPaths={requiredPaths}
          />

          <LoanRequirementSection
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            loanTypeOptions={loanTypeOptions}
          />

          <SectionCard title="Financial Status — Income" icon={IndianRupee}>
            <PersonFinancialFields
              control={control}
              watch={watch}
              setValue={setValue}
              prefix="applicant"
            />
          </SectionCard>

          {showAadhaarOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl">
                <h3 className="text-base font-semibold">Enter Aadhaar OTP</h3>
                <p className="mt-1 text-sm text-gray-600">
                  OTP has been sent to the Aadhaar-linked mobile number.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  OTP expires in {formatSeconds(otpSecondsLeft)}
                </p>

                <div className="mt-4">
                  <InputField
                    label="OTP"
                    value={aadhaarOtp}
                    onChange={(e) =>
                      setAadhaarOtp(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="Enter 4-6 digit OTP"
                  />
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    onClick={handleSendAadhaarOtp}
                    disabled={sendOtp.isPending || otpSecondsLeft > 0}
                  >
                    {sendOtp.isPending
                      ? "Resending..."
                      : otpSecondsLeft > 0
                        ? `Resend in ${formatSeconds(otpSecondsLeft)}`
                        : "Resend OTP"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowAadhaarOtpModal(false)}
                    disabled={verifyOtp.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleVerifyAadhaarOtp}
                    disabled={verifyOtp.isPending || aadhaarOtp.length < 4 || isOtpExpired}
                  >
                    {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
