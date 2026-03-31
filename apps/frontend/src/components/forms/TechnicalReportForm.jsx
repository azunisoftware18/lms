import React, { useState, useEffect } from "react";
import { z } from "zod";


const initialState = {
  loanNumber: "",
  engineerId: "",
  engineerName: "",
  agencyName: "",
  propertyType: "RESIDENTIAL",
  propertyAddress: "",
  city: "",
  state: "",
  pincode: "",
  marketValue: "",
  discussionValue: "",
  forcesdSaleValue: "",
  recommendedLtv: "",
  constructionStatus: "COMPLETED",
  propertyAge: "",
  residualLife: "",
  qualityOfConstruction: "",
  status: "",
  remarks: "",
  reportUrl: "",
  sitePhotographs: "",
};

const schema = z.object({
  loanNumber: z.string().min(1, "Loan Number is required"),
  engineerId: z.string().optional(),
  engineerName: z.string().min(1, "Engineer name is required"),
  agencyName: z.string().optional(),
  propertyType: z.enum([
    "RESIDENTIAL",
    "COMMERCIAL",
    "LAND",
    "FLAT",
    "VILLA",
    "PLOT",
    "INDUSTRIAL",
  ]),
  propertyAddress: z.string().min(5, "Property address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid pincode"),
  marketValue: z.string().min(1, "Market value is required"),
  discussionValue: z.string().min(1, "Discussion value is required"),
  forcesdSaleValue: z.string().optional(),
  recommendedLtv: z.string().min(1, "Recommended LTV is required"),
  constructionStatus: z.enum([
    "COMPLETED",
    "UNDER_CONSTRUCTION",
    "NEW_PROJECT",
  ]),
  propertyAge: z.string().optional(),
  residualLife: z.string().optional(),
  qualityOfConstruction: z.enum(["GOOD", "AVERAGE", "POOR"]).optional(),
  status: z.enum(["PENDING", "SUBMITTED", "APPROVED", "REJECTED"]).optional(),
  remarks: z.string().optional(),
  reportUrl: z.string().url("Invalid report URL").optional().or(z.literal("")),
  sitePhotographs: z.string().url("Invalid site photo URL").optional().or(z.literal("")),
});

export default function TechnicalReportForm({ onSubmit, loading, error, serverFieldErrors }) {
  const [form, setForm] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState({});

  // Merge server field errors into local fieldErrors so they show next to inputs
  useEffect(() => {
    if (!serverFieldErrors) return;
    // serverFieldErrors expected shape: { fieldName: "error message" } or array
    if (Array.isArray(serverFieldErrors)) {
      const parsed = {};
      serverFieldErrors.forEach((e) => {
        // support { field, message } shape
        if (e.field && e.message) parsed[e.field] = e.message;
        // support ZodError items: { path: ['fieldName'], message: '...' }
        else if (e.path && Array.isArray(e.path) && e.path.length > 0) {
          const key = String(e.path[0]);
          parsed[key] = e.message || e.errors || "Invalid value";
        }
      });
      setFieldErrors((prev) => ({ ...prev, ...parsed }));
    } else if (typeof serverFieldErrors === "object") {
      setFieldErrors((prev) => ({ ...prev, ...serverFieldErrors }));
    }
  }, [serverFieldErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error when user edits the input
    setFieldErrors((prev) => {
      if (!prev || !prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errors = {};
      parsed.error.errors.forEach((err) => {
        if (err.path && err.path.length > 0) {
          errors[err.path[0]] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }
    onSubmit(form, () => setForm(initialState));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Loan Number</label>
          <input name="loanNumber" value={form.loanNumber} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          {fieldErrors.loanNumber && <div className="text-red-500 text-xs">{fieldErrors.loanNumber}</div>}
        </div>
        <div>
          <label className="block mb-1">Engineer ID</label>
          <input name="engineerId" value={form.engineerId} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block mb-1">Engineer Name</label>
          <input name="engineerName" value={form.engineerName} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          {fieldErrors.engineerName && <div className="text-red-500 text-xs">{fieldErrors.engineerName}</div>}
        </div>
        <div>
          <label className="block mb-1">Agency Name</label>
          <input name="agencyName" value={form.agencyName} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block mb-1">Property Type</label>
          <select name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="LAND">Land</option>
            <option value="FLAT">Flat</option>
            <option value="VILLA">Villa</option>
            <option value="PLOT">Plot</option>
            <option value="INDUSTRIAL">Industrial</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Property Address</label>
          <input name="propertyAddress" value={form.propertyAddress} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          {fieldErrors.propertyAddress && <div className="text-red-500 text-xs">{fieldErrors.propertyAddress}</div>}
        </div>
        <div>
          <label className="block mb-1">City</label>
          <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          {fieldErrors.city && <div className="text-red-500 text-xs">{fieldErrors.city}</div>}
        </div>
        <div>
          <label className="block mb-1">State</label>
          <input name="state" value={form.state} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          {fieldErrors.state && <div className="text-red-500 text-xs">{fieldErrors.state}</div>}
        </div>
        <div>
          <label className="block mb-1">Pincode</label>
          <input name="pincode" value={form.pincode} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
          {fieldErrors.pincode && <div className="text-red-500 text-xs">{fieldErrors.pincode}</div>}
        </div>
        <div>
          <label className="block mb-1">Market Value</label>
          <input name="marketValue" value={form.marketValue} onChange={handleChange} className="w-full border rounded px-2 py-1" type="number" required />
          {fieldErrors.marketValue && <div className="text-red-500 text-xs">{fieldErrors.marketValue}</div>}
        </div>
        <div>
          <label className="block mb-1">Discussion Value</label>
          <input name="discussionValue" value={form.discussionValue} onChange={handleChange} className="w-full border rounded px-2 py-1" type="number" required />
          {fieldErrors.discussionValue && <div className="text-red-500 text-xs">{fieldErrors.discussionValue}</div>}
        </div>
        <div>
          <label className="block mb-1">Forced Sale Value</label>
          <input name="forcesdSaleValue" value={form.forcesdSaleValue} onChange={handleChange} className="w-full border rounded px-2 py-1" type="number" />
        </div>
        <div>
          <label className="block mb-1">Recommended LTV (%)</label>
          <input name="recommendedLtv" value={form.recommendedLtv} onChange={handleChange} className="w-full border rounded px-2 py-1" type="number" required />
          {fieldErrors.recommendedLtv && <div className="text-red-500 text-xs">{fieldErrors.recommendedLtv}</div>}
        </div>
        <div>
          <label className="block mb-1">Construction Status</label>
          <select name="constructionStatus" value={form.constructionStatus} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="COMPLETED">Completed</option>
            <option value="UNDER_CONSTRUCTION">Under Construction</option>
            <option value="NEW_PROJECT">New Project</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Property Age</label>
          <input name="propertyAge" value={form.propertyAge} onChange={handleChange} className="w-full border rounded px-2 py-1" type="number" />
        </div>
        <div>
          <label className="block mb-1">Residual Life</label>
          <input name="residualLife" value={form.residualLife} onChange={handleChange} className="w-full border rounded px-2 py-1" type="number" />
        </div>
        <div>
          <label className="block mb-1">Quality of Construction</label>
          <select name="qualityOfConstruction" value={form.qualityOfConstruction} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Select</option>
            <option value="GOOD">Good</option>
            <option value="AVERAGE">Average</option>
            <option value="POOR">Poor</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-2 py-1">
            <option value="">Select</option>
            <option value="PENDING">Pending</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block mb-1">Remarks</label>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block mb-1">Report URL</label>
          <input name="reportUrl" value={form.reportUrl} onChange={handleChange} className="w-full border rounded px-2 py-1" type="url" />
          {fieldErrors.reportUrl && <div className="text-red-500 text-xs">{fieldErrors.reportUrl}</div>}
        </div>
        <div>
          <label className="block mb-1">Site Photographs URL</label>
          <input name="sitePhotographs" value={form.sitePhotographs} onChange={handleChange} className="w-full border rounded px-2 py-1" type="url" />
          {fieldErrors.sitePhotographs && <div className="text-red-500 text-xs">{fieldErrors.sitePhotographs}</div>}
        </div>
      </div>
      <div className="flex justify-end border-t border-slate-200 pt-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Report"}
        </button>
      </div>
    </form>
  );
}
