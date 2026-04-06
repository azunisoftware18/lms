import React, { useState } from "react";
import { Users, Trash2, Plus, UserCheck, TrendingUp } from "lucide-react";

import Button from "../../../ui/Button";
import InputField from "../../../ui/InputField";
import { apiGet } from "../../../../lib/api/apiClient";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../lib/utils/toastService";
import {
  SectionCard,
  PersonPersonalFields,
  PersonEmploymentFields,
  PersonFinancialFields,
} from "../sharedFields";
import { personDefaults, fillPerson } from "../sharedUtils";

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
  const [searchingMap, setSearchingMap] = useState({});

  const handleCoApplicantAadhaarSearch = async (index) => {
    const q = (aadhaarQueries[index] || "").replace(/\D/g, "").slice(0, 12);
    if (!q) return showInfo("Enter Aadhaar to search");
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

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <InputField
                  label={`Fetch Aadhaar — Co-Applicant ${index + 1}`}
                  value={aadhaarQueries[index] || ""}
                  onChange={(e) =>
                    setAadhaarQueries((s) => ({
                      ...s,
                      [index]: e.target.value,
                    }))
                  }
                  placeholder="Enter 12-digit Aadhaar"
                />
              </div>
              <div className="mt-6">
                <Button
                  type="button"
                  onClick={() => handleCoApplicantAadhaarSearch(index)}
                  disabled={!!searchingMap[index]}
                >
                  {searchingMap[index] ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </div>

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
