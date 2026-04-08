import React from "react";
import { BadgeCheck } from "lucide-react";

import Button from "../../../ui/Button";

export default function SuccessScreen({ onReset, leadNumber }) {
  const refNum = (
    leadNumber?.replace(/\D/g, "").slice(-8) || "00000000"
  ).padStart(8, "0");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <BadgeCheck size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Application Submitted!
        </h2>
        <p className="text-slate-500 text-sm">
          Your loan application has been received successfully.
        </p>
        <div className="bg-blue-50 rounded-2xl p-4 my-6 border border-blue-100">
          <p className="text-xs text-blue-600 font-semibold">
            Application Reference
          </p>
          <p className="text-2xl font-black text-blue-800 mt-1 tracking-wider">
            MPPL-{refNum}
          </p>
          {leadNumber && (
            <p className="text-xs text-blue-500 mt-2">
              Lead: <span className="font-bold">{leadNumber}</span>
            </p>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Our team will contact you within 2-3 business days
        </p>
        <Button onClick={onReset} className="w-full justify-center!">
          Start New Application
        </Button>
      </div>
    </div>
  );
}
