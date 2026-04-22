import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddPartnerForm from "../../../components/forms/AddPartnerForm";
import { useBranches } from "../../../hooks/useBranches";
import Button from "../../../components/ui/Button";

export default function PartnerCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const partnerId = location.state?.partnerId || "";

  const initialFormState = partnerId ? { partnerId } : undefined;

  const { branches } = useBranches({});
  const branchOptions = (branches || []).map((b) => ({
    value: b.id,
    label: b.name ? `${b.name}${b.code ? ` (${b.code})` : ""}` : b.code,
  }));

  const handleCancel = () => navigate(-1);

  const handleSuccess = () => {
    // After successful creation, navigate back to partner list
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Add New Partner</h2>
          <Button onClick={handleCancel} variant="secondary">
            Back
          </Button>
        </div>

        <AddPartnerForm
          initialFormState={initialFormState}
          isEditing={false}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          branchOptions={branchOptions}
        />
      </div>
    </div>
  );
}
