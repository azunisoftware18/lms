import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
// apiGet fallback removed; `usePartners` handles fetching
import Button from "../../../components/ui/Button";
import AddPartnerTable from "../../../components/tables/AddPartnerTable";
import AddPartnerForm from "../../../components/forms/AddPartnerForm";
import { useBranches } from "../../../hooks/useBranches";
import {
  useCreatePartner,
  useUpdatePartner,
  usePartners,
  useUploadPartnerDocuments,
} from "../../../hooks/usePartner";
import { useDispatch } from "react-redux";
import { setPartners } from "../../../store/slices/partnerSlice";
import toast from "react-hot-toast";

export default function PartnerAddPage() {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const { partners, refetch } = usePartners();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { branches } = useBranches();

  // Ensure partners are loaded on mount
  useEffect(() => {
    void refetch();
  }, [refetch]);

  // Fallback: if store empty after refetch, fetch directly and inject
  // No inline fallback here — `usePartners` performs fetching and normalization.

  const initialFormState = {
    companyName: "",
    partnerName: "",
    email: "",
    phone: "",
    partnerId: "",
    commissionValue: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsEditing(false);
    setEditId(null);
  };

  const handleAddNew = () => {
    resetForm();
    const newId = `PTR${String((partners?.length || 0) + 101).padStart(3, "0")}`;
    setFormData((prev) => ({ ...prev, partnerId: newId }));
    navigate("/admin/partner/add", { state: { partnerId: newId } });
  };

  const handleEdit = (partner) => {
    setFormData({ ...initialFormState, ...partner });
    setEditId(partner.id);
    setIsEditing(true);
    setShowPartnerModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        const remaining = (partners || []).filter((p) => p.id !== id);
        dispatch(setPartners(remaining));
      } catch (e) {
        toast.error(`Failed to delete partner: ${e.message}`);
      }
    }
  };

  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const uploadDocuments = useUploadPartnerDocuments();

  const handleSubmit = async (submittedData) => {
    if (submittedData?.partnerData) {
      // If the backend already returned uploaded documents, do not upload again.
      try {
        const partner = submittedData.partnerData;
        const uploadedDocuments = submittedData.uploadedDocuments || [];
        const documents = submittedData.documents || [];
        const documentTypes = submittedData.documentTypes || [];

        if (
          partner?.id &&
          documents.length > 0 &&
          uploadedDocuments.length === 0
        ) {
          const form = new FormData();
          documents.forEach((file) => form.append("documents", file));
          if (documentTypes && documentTypes.length > 0) {
            form.append("documentTypes", JSON.stringify(documentTypes));
          }

          await uploadDocuments.mutateAsync({
            partnerId: partner.id,
            formData: form,
          });
        }

        await refetch();
        setShowPartnerModal(false);
        resetForm();
      } catch (e) {
        // show error but continue
        console.error("Document upload failed:", e);
        await refetch();
        setShowPartnerModal(false);
        resetForm();
      }

      return;
    }

    const payload = { ...formData, ...(submittedData || {}) };
    try {
      if (isEditing) {
        await updatePartner.mutateAsync({ id: editId, data: payload });
      } else {
        await createPartner.mutateAsync(payload);
      }
      await refetch();
      setShowPartnerModal(false);
      resetForm();
    } catch (err) {
      setErrors({ form: err?.message || "Submission failed" });
    }
  };

  const closeModal = () => {
    setShowPartnerModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Partner Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage partners, commissions, targets, and agreements.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <Button onClick={handleAddNew} className="px-6 py-2.5">
            <Plus size={20} /> Add New Partner
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-slate-600">
          Partners in store:{" "}
          <strong>{Array.isArray(partners) ? partners.length : 0}</strong>
        </div>
      </div>

      <AddPartnerTable
        partners={partners}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showPartnerModal && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? "Edit Partner" : "Add New Partner"}
            </h2>
            <Button onClick={closeModal} variant="secondary">
              Close
            </Button>
          </div>

          <AddPartnerForm
            initialFormState={isEditing ? formData : undefined}
            isEditing={isEditing}
            onCancel={closeModal}
            onSuccess={handleSubmit}
            errors={errors}
            branchOptions={(branches || []).map((b) => ({
              value: b.id,
              label: b.name
                ? `${b.name}${b.code ? ` (${b.code})` : ""}`
                : b.code,
            }))}
          />
        </div>
      )}
    </div>
  );
}
