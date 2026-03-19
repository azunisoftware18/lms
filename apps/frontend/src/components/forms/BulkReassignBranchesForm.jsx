import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import Button from "../ui/Button";
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

export default function BulkReassignBranchesForm({
  branches = [],
  onClose,
  onSave,
}) {
  const [newParentBranchId, setNewParentBranchId] = useState("");
  const [branchIds, setBranchIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const parentOptions = useMemo(
    () => [
      { value: "", label: "Select Target Parent" },
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
        (branch) => branch.id === newParentBranchId,
      ),
    [branches, newParentBranchId],
  );

  const expectedChildType = selectedParent
    ? CHILD_TYPE_BY_PARENT[selectedParent.type]
    : null;

  const branchOptions = useMemo(() => {
    if (!expectedChildType) return [];
    return (Array.isArray(branches) ? branches : [])
      .filter((branch) => branch.type === expectedChildType)
      .filter((branch) => branch.id !== newParentBranchId)
      .map((branch) => ({
        value: branch.id,
        label: `${branch.name} (${branch.code})`,
      }));
  }, [branches, expectedChildType, newParentBranchId]);

  const handleParentChange = (value) => {
    setNewParentBranchId(value);
    setBranchIds([]);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newParentBranchId) {
      setFormError("Please select target parent branch");
      return;
    }

    if (!expectedChildType) {
      setFormError("Selected parent cannot accept child branches");
      return;
    }

    if (!Array.isArray(branchIds) || branchIds.length === 0) {
      setFormError("Please select at least one branch to reassign");
      return;
    }

    setFormError("");
    setSubmitting(true);
    try {
      await onSave({ newParentBranchId, branchIds });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white sm:rounded-xl shadow-sm border-x sm:border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-5 border-b bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg shrink-0">
          <Shuffle className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg sm:text-xl text-slate-800 leading-tight">
            Reassign Bulk Branches
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm">
            Move multiple branches under one new parent with valid hierarchy.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
        <div className="p-4 sm:p-6 space-y-5">
          <SelectField
            label="Target Parent Branch"
            options={parentOptions}
            value={newParentBranchId}
            onChange={handleParentChange}
            isSearchable
            inlineMenu
            isRequired
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-semibold">Expected Child Type:</span>{" "}
            {expectedChildType
              ? TYPE_LABEL[expectedChildType]
              : "Select parent branch"}
          </div>

          <SelectField
            label="Branches to Reassign"
            options={branchOptions}
            value={branchIds}
            onChange={setBranchIds}
            isMulti
            isSearchable
            inlineMenu
            placeholder={
              expectedChildType
                ? `Select ${TYPE_LABEL[expectedChildType]} branches`
                : "Select parent first"
            }
            isDisabled={!expectedChildType}
            isRequired
          />

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
            {submitting ? "Reassigning..." : "Reassign Branches"}
          </Button>
        </div>
      </form>
    </div>
  );
}
