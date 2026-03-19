import { useMemo, useState } from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";

const CHILD_TYPE_BY_PARENT = {
  HEAD_OFFICE: "ZONAL",
  ZONAL: "REGIONAL",
  REGIONAL: "BRANCH",
};

const TYPE_LABEL = {
  HEAD_OFFICE: "Head Office",
  ZONAL: "Zonal",
  REGIONAL: "Regional",
  BRANCH: "Branch",
};

const createEmptyRow = () => ({ name: "", code: "" });

export default function BulkCreateBranchesForm({
  branches = [],
  onClose,
  onSave,
}) {
  const [parentBranchId, setParentBranchId] = useState("");
  const [rows, setRows] = useState([createEmptyRow()]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const parentOptions = useMemo(
    () => [
      { value: "", label: "Select Parent Branch" },
      ...(Array.isArray(branches) ? branches : [])
        .filter((branch) =>
          ["HEAD_OFFICE", "ZONAL", "REGIONAL"].includes(branch.type),
        )
        .map((branch) => ({
          value: branch.id,
          label: `${branch.name} (${branch.code}) - ${TYPE_LABEL[branch.type] || branch.type}`,
        })),
    ],
    [branches],
  );

  const selectedParent = useMemo(
    () =>
      (Array.isArray(branches) ? branches : []).find(
        (branch) => branch.id === parentBranchId,
      ),
    [branches, parentBranchId],
  );

  const expectedChildType = selectedParent
    ? CHILD_TYPE_BY_PARENT[selectedParent.type]
    : null;

  const handleParentChange = (value) => {
    setParentBranchId(value);
    setRows([createEmptyRow()]);
    setFormError("");
  };

  const updateRow = (index, key, value) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    );
  };

  const addRow = () => setRows((prev) => [...prev, createEmptyRow()]);

  const removeRow = (index) => {
    setRows((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, rowIndex) => rowIndex !== index);
    });
  };

  const validate = () => {
    if (!parentBranchId) return "Please select a parent branch";
    if (!expectedChildType) return "Selected parent cannot have child branches";

    const hasEmpty = rows.some((row) => !row.name?.trim() || !row.code?.trim());
    if (hasEmpty) return "Each row needs branch name and branch code";

    const cleanedCodes = rows.map((row) => row.code.trim().toUpperCase());
    const uniqueCodes = new Set(cleanedCodes);
    if (uniqueCodes.size !== cleanedCodes.length) {
      return "Duplicate branch code found in rows";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setSubmitting(true);
    try {
      await onSave({
        parentBranchId,
        type: expectedChildType,
        branches: rows.map((row) => ({
          name: row.name.trim(),
          code: row.code.trim().toUpperCase(),
        })),
      });
      onClose();
    } catch (error) {
      const errorMessage = error?.message || "Failed to create bulk branches";
      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white sm:rounded-xl shadow-sm border-x sm:border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-5 border-b bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg shrink-0">
          <Building2 className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-slate-800 leading-tight">
            Create Bulk Branches
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Add multiple branches with the same hierarchy in one action.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
        <div className="p-4 sm:p-6 space-y-5">
          <SelectField
            label="Parent Branch"
            options={parentOptions}
            value={parentBranchId}
            onChange={handleParentChange}
            isSearchable
            inlineMenu
            isRequired
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-semibold">Child Type:</span>{" "}
            {expectedChildType
              ? TYPE_LABEL[expectedChildType]
              : "Select parent branch"}
          </div>

          <div className="space-y-3">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
              >
                <div className="md:col-span-5">
                  <InputField
                    label={index === 0 ? "Branch Name" : undefined}
                    placeholder="Enter branch name"
                    value={row.name}
                    onChange={(e) => updateRow(index, "name", e.target.value)}
                    isRequired={index === 0}
                  />
                </div>
                <div className="md:col-span-5">
                  <InputField
                    label={index === 0 ? "Branch Code" : undefined}
                    placeholder="Enter branch code"
                    value={row.code}
                    onChange={(e) => updateRow(index, "code", e.target.value)}
                    isRequired={index === 0}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    disabled={rows.length === 1}
                    className="inline-flex items-center justify-center px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={addRow}
            className="bg-white hover:bg-slate-100 text-slate-700! border border-slate-200"
          >
            <Plus size={16} />
            Add Branch Row
          </Button>

          {formError ? (
            <p className="text-sm text-red-600 font-medium">{formError}</p>
          ) : null}
        </div>

        <div className="p-4 sm:p-5 bg-slate-50/50 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-600! border border-slate-200 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto px-10"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Bulk Branches"}
          </Button>
        </div>
      </form>
    </div>
  );
}
