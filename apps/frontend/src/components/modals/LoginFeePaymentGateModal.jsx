import React, { useState } from "react";
import {
  Search,
  Check,
  X,
  AlertCircle,
  Loader,
  ShieldCheckIcon,
  CreditCard,
  FileText,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { getLeadByIdOrNumber } from "../../hooks/useLead";
import { useLogginFeeList } from "../../hooks/useLogginFee";
import { useSendAadhaarOtp, useVerifyAadhaarOtp } from "../../hooks/useAadhaar";
import { usePanDetails } from "../../hooks/usePan";
import { useAadhaarContext } from "../../contexts/AadhaarContext";
import { usePanContext } from "../../contexts/PanContext";
import {
  extractVerifyProfile,
  normalizePanProfile,
} from "../../lib/utils/identityProfileHelper";

const VERIFICATION_MODES = {
  FETCH_LEAD: "fetch_lead",
  CHECK_PAYMENT: "check_payment",
  SELECT_METHOD: "select_method",
  VERIFY_AADHAAR: "verify_aadhaar",
  VERIFY_PAN: "verify_pan",
};

export default function LoginFeePaymentGateModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [mode, setMode] = useState(VERIFICATION_MODES.FETCH_LEAD);
  const [leadNumber, setLeadNumber] = useState("");
  const [fetchedLead, setFetchedLead] = useState(null);
  const [loginFee, setLoginFee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Aadhaar OTP flow
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [refId, setRefId] = useState("");
  const [otp, setOtp] = useState("");

  // PAN flow
  const [panNumber, setPanNumber] = useState("");

  const { fees } = useLogginFeeList();
  const sendAadhaarOtpMutation = useSendAadhaarOtp();
  const verifyAadhaarOtpMutation = useVerifyAadhaarOtp();
  const panDetailsMutation = usePanDetails();
  const { setAadhaarData } = useAadhaarContext();
  const { setPanData } = usePanContext();

  if (!isOpen) return null;

  /**
   * Step 1: Fetch Lead by Number
   */
  const handleFetchLead = async () => {
    if (!leadNumber.trim()) {
      toast.error("Please enter a lead number");
      return;
    }

    setLoading(true);
    try {
      const lead = await getLeadByIdOrNumber(leadNumber.trim());

      if (!lead) {
        toast.error("Lead not found");
        setLoading(false);
        return;
      }


      if(lead.status === "REJECTED") {
        toast.error("Lead is rejected. Please contact support.");
        setLoading(false);
        return;
      }
      if(lead.status === "PENDING") {
        toast.error("Lead is still pending approval. Please wait for approval before proceeding.");
        setLoading(false);
        return;
      }
       if(lead.status === "APPLICATION_SUBMITTED"  ) {
        toast.error("Lead has already submitted application. Please check the application status or contact support.");
        setLoading(false);
        return;
      }

       if (lead.status !== "APPROVED") {
        toast.error("Lead is not approved");
        setLoading(false);
        return;
      }
      setFetchedLead(lead);
      
      // Check if login fee is paid for this lead
      const fee = fees?.find(
        (f) =>
          f.leadId === lead.id &&
          f.status === "PAID"
      );

      if (!fee) {
        toast.error("Login fee not paid for this lead. Please pay first.");
        setLoading(false);
        return;
      }

      setLoginFee(fee);
      setMode(VERIFICATION_MODES.SELECT_METHOD);
      toast.success("Lead found and login fee verified ✓");
    } catch (error) {
      toast.error(error?.message || "Failed to fetch lead");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Select Aadhaar verification
   */
  const handleSelectAadhaar = () => {
    setMode(VERIFICATION_MODES.VERIFY_AADHAAR);
    setAadhaarNumber("");
    setOtp("");
    setRefId("");
  };

  /**
   * Select PAN verification
   */
  const handleSelectPan = () => {
    setMode(VERIFICATION_MODES.VERIFY_PAN);
    setPanNumber("");
  };

  /**
   * Aadhaar OTP: Send OTP
   */
  const handleSendAadhaarOtp = async () => {
    if (!aadhaarNumber.trim()) {
      toast.error("Please enter Aadhaar number");
      return;
    }

    try {
      const response = await sendAadhaarOtpMutation.mutateAsync({
        aadhaarNumber: aadhaarNumber.trim(),
      });
      
      // Extract ref_id from response (handle multiple response formats)
      const newRefId =
        response?.ref_id ||
        response?.refId ||
        response?.reference_id ||
        response?.data?.ref_id ||
        response?.data?.refId ||
        response?.data?.data?.ref_id ||
        response?.data?.data?.refId ||
        response?.data?.data?.reference_id ||
        "";
      
      if (newRefId) {
        setRefId(newRefId);
        setOtp("");
        toast.success("OTP sent to your registered mobile number");
      } else {
        console.error("Send OTP response did not include ref_id:", response);
        toast.error("OTP sent, but reference id was not returned by server");
      }
    } catch (error) {
      console.error("OTP Send Error:", error);
      toast.error(error?.message || "Failed to send OTP");
    }
  };

  /**
   * Aadhaar OTP: Verify OTP
   */
  const handleVerifyAadhaarOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    if (!refId) {
      toast.error("Reference ID not found. Please send OTP again");
      return;
    }

    try {
      const response = await verifyAadhaarOtpMutation.mutateAsync({
        ref_id: refId,
        otp: otp.trim(),
      });

      // persist response in Aadhaar provider
      try {
        setAadhaarData(response);
      } catch (err) {
        console.warn("Failed to set Aadhaar context:", err);
      }

      const profileData = extractVerifyProfile(response);

      console.log("[LoginFeePaymentGateModal] Aadhaar verify response, profileData:", profileData, response);
      toast.success("Aadhaar verified successfully ✓");

      // Call success callback with complete data including API response
      onSuccess({
        lead: fetchedLead,
        loginFee,
        verificationData: {
          aadhaarNumber: aadhaarNumber.trim(),
          panNumber: null,
          verificationMethod: "aadhaar",
          verificationResponse: response,
          profileData,
        },
      });
      console.log("[LoginFeePaymentGateModal] onSuccess payload sent", {
        lead: fetchedLead,
        loginFee,
        verificationData: {
          aadhaarNumber: aadhaarNumber.trim(),
          verificationMethod: "aadhaar",
          profileData,
        },
      });
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(error?.message || "Failed to verify OTP");
    }
  };

  /**
   * PAN: Fetch PAN Details
   */
  const handleVerifyPan = async () => {
    if (!panNumber.trim()) {
      toast.error("Please enter PAN number");
      return;
    }

    try {
      const response = await panDetailsMutation.mutateAsync({
        panNumber: panNumber.trim(),
      });

      // persist response in Pan provider
      try {
        setPanData(response);
      } catch (err) {
        console.warn("Failed to set Pan context:", err);
      }

      const profileData = normalizePanProfile(response);

      // Call success callback with complete data including API response
      onSuccess({
        lead: fetchedLead,
        loginFee,
        verificationData: {
          aadhaarNumber: null,
          panNumber: panNumber.trim(),
          verificationMethod: "pan",
          verificationResponse: response,
          profileData,
        },
      });
    } catch (error) {
      toast.error(error?.message || "Failed to verify PAN");
    }
  };

  /**
   * Render: Fetch Lead Screen
   */
  if (mode === VERIFICATION_MODES.FETCH_LEAD) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative  w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center bg- gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Login Fee Check
              </h2>
              <p className="text-sm text-slate-500">
                Verify payment before proceeding
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Lead Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={leadNumber}
                  onChange={(e) => setLeadNumber(e.target.value)}
                  placeholder="Enter lead number"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleFetchLead();
                  }}
                />
                <Button
                  onClick={handleFetchLead}
                  disabled={loading}
                  className="px-4 py-2.5"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Search
                </Button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Login Fee Required</p>
                  <p className="text-blue-700">
                    A login fee must be paid before you can submit a loan
                    application. This prevents spam and ensures commitment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 justify-end">
            <Button
              onClick={onClose}
              className="flex  bg-blue-500 text-white hover:bg-blue-600 font-semibold "
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render: Verify Identity Screen
   */
  /**
   * Render: Select Verification Method
   */
  if (mode === VERIFICATION_MODES.SELECT_METHOD) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-6 border-b border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Verify Your Identity
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Lead{" "}
                  <span className="font-mono font-semibold">
                    {fetchedLead?.leadNumber}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Payment Verified */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-green-900">
                    ✓ Login Fee Verified
                  </p>
                  <p className="text-xs text-green-700 mt-2">Transaction ID</p>
                  <p className="text-xs font-mono bg-white/50 px-2 py-1 rounded mt-1 text-green-900 font-semibold">
                    {loginFee?.transactionId}
                  </p>
                </div>
              </div>
            </div>

            {/* Lead Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                Lead Information
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {fetchedLead?.fullName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Mobile
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {fetchedLead?.contactNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Choose Verification Method */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Choose Verification Method
              </p>

              {/* Aadhaar Button */}
              <button
                onClick={handleSelectAadhaar}
                className="w-full p-4 border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-100">
                      <Smartphone className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      📋 Aadhaar (OTP)
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Verify with 12-digit Aadhaar via OTP
                    </p>
                  </div>
                  <ChevronRight />
                </div>
              </button>

              {/* PAN Button */}
              <button
                onClick={handleSelectPan}
                className="w-full p-4 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      💳 PAN Details
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Verify with 10-character PAN code
                    </p>
                  </div>
                  <ChevronRight />
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r flex justify-end from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200">
            <Button
              onClick={() => {
                setMode(VERIFICATION_MODES.FETCH_LEAD);
                setLeadNumber("");
                setFetchedLead(null);
                setLoginFee(null);
              }}
              className=" bg-blue-500 text-white hover:bg-blue-600 font-semibold"
            >
              ← Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render: Verify Aadhaar via OTP
   */
  if (mode === VERIFICATION_MODES.VERIFY_AADHAAR) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-6 border-b border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Smartphone className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Verify Aadhaar
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  OTP verification via Aadhaar number
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Lead Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                Lead Information
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {fetchedLead?.fullName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Mobile
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {fetchedLead?.contactNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {!refId ? (
              <div className="space-y-3">
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg">
                  <p className="text-xs font-bold text-indigo-900">
                    STEP 1: Send OTP
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    📋 Aadhaar Number (12 digits)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={aadhaarNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                      setAadhaarNumber(val);
                    }}
                    placeholder="123456789012"
                    disabled={sendAadhaarOtpMutation.isPending}
                    maxLength="12"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-sm font-mono"
                  />
                  <p className="text-xs text-slate-600 mt-1.5">
                    Enter your registered 12-digit Aadhaar number
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900 font-medium">
                    ℹ️ OTP will be sent to your registered mobile number
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg">
                  <p className="text-xs font-bold text-emerald-900">
                    STEP 2: Verify OTP
                  </p>
                </div>

                <div className="bg-slate-100 p-3 rounded-lg">
                  <p className="text-xs text-slate-600 font-medium mb-2">
                    Aadhaar Number (Masked)
                  </p>
                  <p className="text-lg font-mono font-bold text-slate-900 tracking-widest">
                    {aadhaarNumber.replace(/\d(?=\d{4})/g, "*")}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    🔐 Enter OTP (4-6 digits)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(val);
                    }}
                    placeholder="000000"
                    disabled={verifyAadhaarOtpMutation.isPending}
                    maxLength="6"
                    className="w-full px-3 py-3 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-sm font-mono text-center text-2xl tracking-widest font-bold text-emerald-900"
                  />
                  <p className="text-xs text-slate-600 mt-1.5">
                    Enter the OTP sent to your mobile number
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-xs text-emerald-900 font-medium">
                    ✓ OTP received? Enter it above to verify
                  </p>
                </div>

                <button
                  onClick={() => {
                    setRefId("");
                    setOtp("");
                  }}
                  className="w-full text-xs text-indigo-600 hover:text-indigo-700 font-semibold py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  ↻ Send OTP to different Aadhaar
                </button>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900 font-medium">
                ✓ This data will auto-fill in your loan application
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r  flex justify-between from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200 flex gap-3">
            <Button
              onClick={() => setMode(VERIFICATION_MODES.SELECT_METHOD)}
              disabled={
                sendAadhaarOtpMutation.isPending ||
                verifyAadhaarOtpMutation.isPending
              }
              className="flex bg-blue-500 text-white hover:bg-blue-600 font-semibold"
            >
              ← Back
            </Button>

            {!refId ? (
              <Button
                onClick={handleSendAadhaarOtp}
                disabled={sendAadhaarOtpMutation.isPending}
                className="flex bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 font-semibold"
              >
                {sendAadhaarOtpMutation.isPending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Send OTP
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleVerifyAadhaarOtp}
                disabled={verifyAadhaarOtpMutation.isPending}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 font-semibold"
              >
                {verifyAadhaarOtpMutation.isPending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Verify OTP
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render: Verify PAN
   */
  if (mode === VERIFICATION_MODES.VERIFY_PAN) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-6 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Verify PAN
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Enter your PAN details
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Lead Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                Lead Information
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {fetchedLead?.fullName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Mobile
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {fetchedLead?.contactNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* PAN Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  💳 PAN Number (10 characters)
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().slice(0, 10);
                    setPanNumber(val);
                  }}
                  placeholder="ABCDE1234F"
                  disabled={panDetailsMutation.isPending}
                  maxLength="10"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-sm font-mono uppercase text-center tracking-widest"
                />
                <p className="text-xs text-slate-600 mt-1.5">
                  Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-xs text-emerald-900 font-medium">
                  ℹ️ PAN will be verified with tax records
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900 font-medium">
                  ✓ This data will auto-fill in your loan application
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r flex justify-between from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200 flex gap-3">
            <Button
              onClick={() => setMode(VERIFICATION_MODES.SELECT_METHOD)}
              disabled={panDetailsMutation.isPending}
              className="flex bg-blue-500 text-white hover:bg-blue-600 font-semibold"
            >
              ← Back
            </Button>

            <Button
              onClick={handleVerifyPan}
              disabled={panDetailsMutation.isPending}
              className="flex bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 font-semibold"
            >
              {panDetailsMutation.isPending ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Verify PAN
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ChevronRight Icon
function ChevronRight() {
  return (
    <svg
      className="w-5 h-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
