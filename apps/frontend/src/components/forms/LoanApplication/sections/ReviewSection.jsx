import React, { useState } from "react";
import {
  Eye,
  User,
  MapPin,
  IndianRupee,
  Users,
  Shield,
  CreditCard,
  Landmark,
  Home,
  UserCheck,
  Info,
  Check,
  Loader2,
  Send,
  Search,
} from "lucide-react";

import Button from "../../../ui/Button";

const EMPLOYMENT_OPTIONS = [
  { value: "SALARIED", label: "Salaried" },
  { value: "BUSINESS", label: "Business" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "OTHER", label: "Other" },
];

const LOAN_PURPOSE_OPTIONS = [
  { value: "HOME", label: "Home Purchase" },
  { value: "HOME_IMPROVEMENT", label: "Home Improvement" },
  { value: "PLOT_PURCHASE", label: "Plot Purchase" },
  { value: "NRPL", label: "NRPL" },
  { value: "POST_DATED_CHEQUE", label: "Post Dated Cheque" },
  { value: "STANDING_INSTRUCTION", label: "Standing Instruction" },
];

const ReviewBlock = ({ title, icon: Icon, rows }) => {
  const valid = rows.filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (!valid.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4">
      <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100">
        {Icon && <Icon size={14} className="text-blue-600" />}
        <h4 className="font-bold text-sm text-slate-700">{title}</h4>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {valid.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-slate-800">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ReviewSection({ getValues, onSubmit, isSubmitting }) {
  const [agreed, setAgreed] = useState(false);
  const data = getValues();
  const a = data.applicant || {};
  const addr = data.addresses?.currentAddress || {};
  const lr = data.loanRequirement || {};

  return (
    <div className="space-y-4">
      <div className="p-5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Eye size={18} />
          </div>
          <div>
            <h3 className="font-black text-lg">Review Application</h3>
            <p className="text-blue-100 text-sm">
              Verify all details before final submission
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [
              "Loan Purpose",
              LOAN_PURPOSE_OPTIONS.find((o) => o.value === lr.loanPurpose)
                ?.label || "—",
            ],
            [
              "Loan Amount",
              lr.loanAmount
                ? `₹${Number(lr.loanAmount).toLocaleString("en-IN")}`
                : "—",
            ],
            ["Tenure", lr.tenure ? `${lr.tenure} Months` : "—"],
          ].map(([l, v]) => (
            <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-blue-200 text-[10px] font-medium">{l}</p>
              <p className="text-white font-bold text-sm mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        {data.leadNumber && (
          <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Search size={12} className="text-blue-200 shrink-0" />
            <span className="text-blue-100 text-xs">Lead Reference:</span>
            <span className="text-white text-xs font-black tracking-widest">
              {data.leadNumber}
            </span>
          </div>
        )}
      </div>

      <ReviewBlock
        title="Applicant Details"
        icon={User}
        rows={[
          [
            "Full Name",
            [a.title, a.firstName, a.middleName, a.lastName]
              .filter(Boolean)
              .join(" "),
          ],
          ["Date of Birth", a.dob],
          ["Gender", a.gender],
          ["Mobile", a.contactNumber],
          ["Email", a.email],
          ["PAN", a.panNumber],
          ["Aadhaar", a.aadhaarNumber],
          ["Category", a.category],
          [
            "Employment",
            EMPLOYMENT_OPTIONS.find((o) => o.value === a.employmentType)?.label,
          ],
          ["Nationality", a.nationality],
        ]}
      />

      <ReviewBlock
        title="Current Address"
        icon={MapPin}
        rows={[
          ["Address", addr.addressLine1],
          ["City", addr.city],
          ["District", addr.district],
          ["State", addr.state],
          ["Pin Code", addr.pinCode],
        ]}
      />

      <ReviewBlock
        title="Loan Requirement"
        icon={IndianRupee}
        rows={[
          [
            "Loan Amount",
            lr.loanAmount
              ? `₹${Number(lr.loanAmount).toLocaleString("en-IN")}`
              : "",
          ],
          ["Tenure", lr.tenure ? `${lr.tenure} Months` : ""],
          ["Interest Option", lr.interestOption],
          ["Repayment Method", lr.repaymentMethod],
        ]}
      />

      {(data.coApplicants || []).length > 0 && (
        <ReviewBlock
          title={`Co-Applicants (${data.coApplicants.length})`}
          icon={Users}
          rows={data.coApplicants.map((ca, i) => [
            `Co-Applicant ${i + 1}`,
            [ca.firstName, ca.lastName].filter(Boolean).join(" "),
          ])}
        />
      )}

      {(data.guarantors || []).length > 0 && (
        <ReviewBlock
          title={`Guarantors (${data.guarantors.length})`}
          icon={Shield}
          rows={data.guarantors.map((g, i) => [
            `Guarantor ${i + 1}`,
            [g.firstName, g.lastName].filter(Boolean).join(" "),
          ])}
        />
      )}

      {(data.existingLoans || []).length > 0 && (
        <ReviewBlock
          title="Existing Loans"
          icon={CreditCard}
          rows={data.existingLoans.map((l, i) => [
            `Loan ${i + 1}`,
            `${l.institutionName} - ₹${l.disbursedAmount}`,
          ])}
        />
      )}

      {(data.bankAccounts || []).length > 0 && (
        <ReviewBlock
          title="Bank Accounts"
          icon={Landmark}
          rows={data.bankAccounts.map((b, i) => [
            `Account ${i + 1}`,
            `${b.bankName} - ₹${b.balanceAmount}`,
          ])}
        />
      )}

      {(data.properties || []).length > 0 && (
        <ReviewBlock
          title="Properties"
          icon={Home}
          rows={data.properties.map((p, i) => [
            `Property ${i + 1}`,
            `${p.landArea} sqft - ${p.ownershipType}`,
          ])}
        />
      )}

      {(data.references || data.reference || []).length > 0 && (
        <ReviewBlock
          title="References"
          icon={UserCheck}
          rows={(data.references || data.reference).map((r, i) => [
            `Reference ${i + 1}`,
            `${r.name} - ${r.phoneNo || r.phone}`,
          ])}
        />
      )}

      <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800 mb-2">Declaration</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              I/We declare that all the particulars and information given in
              this application form are true, correct and complete and that they
              shall form the basis of any loan Mascot Projects Pvt. Ltd. may
              decide to grant to me/us.
            </p>
            <div
              className="flex items-center gap-2.5 mt-4 cursor-pointer select-none"
              onClick={() => setAgreed((v) => !v)}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${agreed ? "bg-amber-600 border-amber-600" : "border-amber-400 bg-white"}`}
              >
                {agreed && (
                  <Check size={11} strokeWidth={3} className="text-white" />
                )}
              </div>
              <span className="text-xs font-bold text-amber-800">
                I agree to the above declaration
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={!agreed || isSubmitting}
        className={`w-full justify-center! py-3.5! text-base! rounded-xl! bg-emerald-600! hover:bg-emerald-700! ${!agreed || isSubmitting ? "opacity-50! cursor-not-allowed!" : ""}`}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send size={16} /> Submit Application
          </>
        )}
      </Button>
    </div>
  );
}
