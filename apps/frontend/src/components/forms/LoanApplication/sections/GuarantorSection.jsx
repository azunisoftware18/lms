import React, { useState } from "react";
import { Shield, Trash2, Plus, BarChart3 } from "lucide-react";

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
  const [searchingMap, setSearchingMap] = useState({});

  const handleGuarantorAadhaarSearch = async (index) => {
    const q = (aadhaarQueries[index] || "").replace(/\D/g, "").slice(0, 12);
    if (!q) return showInfo("Enter Aadhaar to search");
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
                      [index]: e.target.value,
                    }))
                  }
                  placeholder="Enter 12-digit Aadhaar"
                />
              </div>
              <div className="mt-6">
                <Button
                  type="button"
                  onClick={() => handleGuarantorAadhaarSearch(index)}
                  disabled={!!searchingMap[index]}
                >
                  {searchingMap[index] ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </div>

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
