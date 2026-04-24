import React, { useState, useEffect } from "react";
import { X, DollarSign } from "lucide-react";
import Button from "../ui/Button";
import { useUpdateLeadLoginCharges } from "../../hooks/useLead";
import toast from "react-hot-toast";

export default function UpdateLoginChargesModal({ isOpen, lead, onClose, onSuccess }) {
  const [loginCharges, setLoginCharges] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const updateMutation = useUpdateLeadLoginCharges();

  useEffect(() => {
    if (lead) {
      const current =
        lead?.defaultLoggingFeeAmount ??
        lead?.defaultLoginCharges ??
        lead?.loanType?.defaultLoginCharges ??
        "";

      setLoginCharges(current === null || current === undefined ? "" : String(current));
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginCharges || Number(loginCharges) < 0) {
      toast.error("Please enter a valid login charges amount");
      return;
    }

    setIsLoading(true);
    try {
      await updateMutation.mutateAsync({
        id: lead.id,
        defaultLoginCharges: Number(loginCharges),
      });
      toast.success("Login charges updated successfully!");
      setLoginCharges("");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update login charges");
    } finally {
      setIsLoading(false);
    }
  };
 

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 border-b border-gray-200 p-6 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white">
              Edit Login Fee
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Update lead login charges
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-400 rounded-lg transition-colors text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Lead Details Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-600 mb-4">
              Lead Information
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lead Number</span>
                <span className="font-semibold text-gray-900">
                  {lead?.leadNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Name</span>
                <span className="font-semibold text-gray-900">
                  {lead?.fullName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contact</span>
                <span className="font-semibold text-gray-900">
                  {lead?.contactNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email</span>
                <span className="font-semibold text-gray-900 truncate">
                  {lead?.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Loan Type</span>
                <span className="font-semibold text-gray-900">
                  {lead?.loanType?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  {lead?.status?.replace(/_/g, " ") || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Loan Amount</span>
                <span className="font-semibold text-green-600">
                  ₹ {lead?.loanAmount?.toLocaleString("en-IN") || "0"}
                </span>
              </div>
               <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Login Fee</span>
                <span className="font-semibold text-green-600">
                  ₹ {Number(
                    lead?.defaultLoggingFeeAmount ?? lead?.defaultLoginCharges ?? lead?.loanType?.defaultLoginCharges ?? 0,
                  ).toLocaleString("en-IN")}
                </span>
              </div>

            </div>
          </div>

          {/* Loan Charges Bounds */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">
              Charge Limits
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Minimum Charges</span>
                <span className="font-semibold text-blue-900">
                  ₹ {lead?.loanType?.minLoginCharges?.toLocaleString("en-IN") || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Maximum Charges</span>
                <span className="font-semibold text-blue-900">
                  ₹ {lead?.loanType?.maxLoginCharges?.toLocaleString("en-IN") || "N/A"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-sm text-blue-700">Current Charges</span>
                <span className="font-semibold text-blue-900">
                  ₹ {Number(
                    lead?.defaultLoggingFeeAmount ?? lead?.defaultLoginCharges ?? lead?.loanType?.defaultLoginCharges ?? 0,
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Login Charges <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={loginCharges}
                  onChange={(e) => setLoginCharges(e.target.value)}
                  placeholder="Enter login charges"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter the new login charges amount in rupees
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={isLoading || !loginCharges}
                className="flex-1"
              >
                {isLoading ? "Updating..." : "Update Charges"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
