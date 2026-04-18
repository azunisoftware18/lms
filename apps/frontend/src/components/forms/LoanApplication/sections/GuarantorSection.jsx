import React, { useEffect, useState } from "react";
import { Shield, Trash2, Plus, BarChart3 } from "lucide-react";

import Button from "../../../ui/Button";
import InputField from "../../../ui/InputField";
import { apiGet } from "../../../../lib/api/apiClient";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../lib/utils/toastService";
import { useAadhaar } from "../../../../hooks/useAadhaar";
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

export default function GuarantorSection({
  control,
  watch,
  setValue,
  fields,
  append,
  remove,
  requiredPaths = new Set(),
}) {
  const [aadhaarQueries, setAadhaarQueries] = useState({});
  const [otpMap, setOtpMap] = useState({});
  const [refIdMap, setRefIdMap] = useState({});
  const [otpSentMap, setOtpSentMap] = useState({});
  const [otpVerifiedMap, setOtpVerifiedMap] = useState({});
  const [showOtpModalMap, setShowOtpModalMap] = useState({});
  const [otpExpiresAtMap, setOtpExpiresAtMap] = useState({});
  const [otpSecondsLeftMap, setOtpSecondsLeftMap] = useState({});
  const [searchingMap, setSearchingMap] = useState({});
  const { sendOtp, verifyOtp, isLoading: aadhaarLoading } = useAadhaar();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOtpSecondsLeftMap(() => {
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
      console.log(`[Aadhaar][Guarantor ${index + 1}] Send OTP response:`, res);
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
    if (otpSentMap[index] && !otpVerifiedMap[index]) {
      setShowOtpModalMap((s) => ({ ...s, [index]: true }));
      return;
    }
    handleSendOtp(index);
  };

  const handleVerifyOtp = async (index) => {
    const aadhaar = (aadhaarQueries[index] || "")
      .replace(/\D/g, "")
      .slice(0, 12);
    const otp = (otpMap[index] || "").replace(/\D/g, "").slice(0, 6);
    if (aadhaar.length !== 12) return showInfo("Enter valid 12-digit Aadhaar");
    if (otp.length !== 6) return showInfo("Enter valid 6-digit OTP");
    if (isOtpExpired(index)) return showInfo("OTP expired. Please resend OTP.");
    if (!refIdMap[index]) return showInfo("Missing ref_id. Please send OTP again.");

    try {
      setSearchingMap((s) => ({ ...s, [index]: true }));
      const res = await verifyOtp.mutateAsync({
        ref_id: refIdMap[index],
        otp,
      });
      console.log(`[Aadhaar][Guarantor ${index + 1}] Verify OTP response:`, res);
      try {
        setValue(`guarantors.${index}.aadhaarProvider`, res?.data ?? res);
      } catch (e) {
        console.error(`Failed to set guarantors.${index}.aadhaarProvider on form:`, e);
      }
      setOtpVerifiedMap((s) => ({ ...s, [index]: true }));
      setShowOtpModalMap((s) => ({ ...s, [index]: false }));
      await handleGuarantorAadhaarSearch(index);
      showSuccess("OTP verified and customer details loaded");
    } catch (err) {
      showError(err?.message || "OTP verification failed");
    } finally {
      setSearchingMap((s) => ({ ...s, [index]: false }));
    }
  };

  const handleGuarantorAadhaarSearch = async (index) => {
    const q = (aadhaarQueries[index] || "").replace(/\D/g, "").slice(0, 12);
    if (!q) return showInfo("Enter Aadhaar to search");
    if (!otpVerifiedMap[index]) {
      return showInfo("Verify OTP first, then fetch Aadhaar details");
    }
    try {
      setSearchingMap((s) => ({ ...s, [index]: true }));
      const res = await apiGet(`/customers`, { params: { aadhaar: q } });
      const data = res?.data ?? res;
      fillPerson(`guarantors.${index}`, setValue, data);
      showSuccess("Customer details loaded");
    } catch (err) {
      showError(err?.message || "No record found for Aadhaar");
    } finally {
      setSearchingMap((s) => ({ ...s, [index]: false }));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
        <div>
          <h3 className="font-bold text-amber-800 text-sm">Guarantors</h3>
          <p className="text-xs text-amber-600 mt-0.5">
            Guarantors provide additional assurance
          </p>
        </div>
        <Button
          type="button"
          onClick={() => append({ ...personDefaults() })}
          className="bg-amber-500! hover:bg-amber-600! py-2! px-4! text-xs!"
        >
          <Plus size={13} /> Add Guarantor
        </Button>
      </div>
      {fields.length === 0 && (
        <div className="text-center py-14 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <Shield size={36} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-400 font-semibold text-sm">
            No guarantors added
          </p>
        </div>
      )}
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-amber-700 text-sm">
              Guarantor {index + 1}
            </h3>
            <Button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-50! text-red-600! border border-red-200 shadow-none! py-1.5! px-3! text-xs!"
            >
              <Trash2 size={13} /> Remove
            </Button>
          </div>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <InputField
                  label={`Fetch Aadhaar — Guarantor ${index + 1}`}
                  value={aadhaarQueries[index] || ""}
                  onChange={(e) =>
                    setAadhaarQueries((s) => ({
                      ...s,
                      [index]: e.target.value.replace(/\D/g, "").slice(0, 12),
                    }))
                  }
                  placeholder="Enter 12-digit Aadhaar"
                />
              </div>
              <div className="mt-6 flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleAadhaarButtonClick(index)}
                  disabled={
                    !!searchingMap[index] ||
                    aadhaarLoading ||
                    (aadhaarQueries[index] || "").length !== 12
                  }
                >
                  {sendOtp.isPending ? "Sending..." : "Send OTP"}
                </Button>
              </div>
            </div>
          </div>

          {showOtpModalMap[index] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl">
                <h3 className="text-base font-semibold">Enter Aadhaar OTP</h3>
                <p className="mt-1 text-sm text-gray-600">
                  OTP has been sent to the Aadhaar-linked mobile number.
                </p>
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

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => handleSendOtp(index)}
                    disabled={
                      sendOtp.isPending || (otpSecondsLeftMap[index] || 0) > 0
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
                    onClick={() =>
                      setShowOtpModalMap((s) => ({ ...s, [index]: false }))
                    }
                    disabled={verifyOtp.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleVerifyOtp(index)}
                    disabled={
                      verifyOtp.isPending ||
                      (otpMap[index] || "").length !== 6 ||
                      isOtpExpired(index)
                    }
                  >
                    {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <SectionCard
            title={`Guarantor ${index + 1} — Personal Details`}
            icon={Shield}
          >
            <PersonPersonalFields
              control={control}
              prefix={`guarantors.${index}`}
              watch={watch}
              setValue={setValue}
            />
          </SectionCard>
          <PersonEmploymentFields
            control={control}
            watch={watch}
            prefix={`guarantors.${index}`}
            setValue={setValue}
            requiredPaths={requiredPaths}
          />
          <SectionCard
            title={`Guarantor ${index + 1} — Financial Status`}
            icon={BarChart3}
            accentColor="rose"
          >
            <PersonFinancialFields
              control={control}
              watch={watch}
              setValue={setValue}
              prefix={`guarantors.${index}`}
            />
          </SectionCard>
        </div>
      ))}
    </div>
  );
}
