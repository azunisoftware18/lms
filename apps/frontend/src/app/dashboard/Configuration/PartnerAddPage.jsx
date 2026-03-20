import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import Button from "../../../components/ui/Button";
import AddPartnerTable from "../../../components/tables/AddPartnerTable";
import AddPartnerModal from "../../../components/modals/AddPartnerModal";
import AddPartnerForm from "../../../components/forms/AddPartnerForm";

export default function PartnerAddPage() {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [partners, setPartners] = useState([]);

  // --- FORM STATE ---
  const initialFormState = {
    companyName: "",
    partnerName: "",
    email: "",
    phone: "",
    altPhone: "",
    website: "",
    establishedYear: "",
    partnerType: "Individual",
    businessNature: "",

    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    contactPerson: "",
    contactPersonDesignation: "",

    partnerId: "",
    businessCategory: "Finance",
    specialization: "",
    totalEmployees: "",
    annualTurnover: "",
    registrationNo: "",
    gstNo: "",
    panNo: "",

    companyLogo: null,
    panDoc: null,
    gstDoc: null,
    licenseDoc: null,
    agreementDoc: null,

    accountHolder: "",
    bankName: "",
    accountNo: "",
    ifsc: "",
    upiId: "",

    commissionType: "Percentage",
    commissionValue: "",
    paymentCycle: "Monthly",
    minimumPayout: "",
    taxDeduction: "",

    monthlyTarget: "",
    quarterlyTarget: "",
    annualTarget: "",
    performanceRating: "3",

    status: "Active",
    partnershipDate: "",
    renewalDate: "",
    permissions: {
      viewLeads: false,
      addCustomers: false,
      viewReports: false,
      accessPortal: false,
      manageSubAgents: false,
    },

    username: "",
    password: "",
    portalAccess: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  useEffect(() => {
    let isCancelled = false;

    const loadPartners = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/partner/all`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!isCancelled) {
          setPartners(res.data.data || res.data.partners || []);
        }
      } catch (error) {
        console.error("Failed to fetch partners", error);
      }
    };

    loadPartners();

    return () => {
      isCancelled = true;
    };
  }, []);

  const performanceOptions = [
    { value: "1", label: "Poor", color: "bg-red-100 text-red-800" },
    {
      value: "2",
      label: "Below Average",
      color: "bg-orange-100 text-orange-800",
    },
    { value: "3", label: "Average", color: "bg-yellow-100 text-yellow-800" },
    { value: "4", label: "Good", color: "bg-green-100 text-green-800" },
    { value: "5", label: "Excellent", color: "bg-blue-100 text-blue-800" },
  ];

  // --- FORM HANDLERS ---
  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsEditing(false);
    setEditId(null);
  };

  const handleAddNew = () => {
    resetForm();
    const newId = `PTR${String(partners.length + 101).padStart(3, "0")}`;
    setFormData((prev) => ({ ...prev, partnerId: newId }));
    setShowPartnerModal(true);
  };

  const handleEdit = (partner) => {
    setFormData({
      ...initialFormState,
      ...partner,
      companyName: partner.companyName || "",
      partnerName: partner.partnerName || partner.contactPerson || "",
      email: partner.email || "",
      phone: partner.phone || "",
      partnerType: partner.partnerType || "Individual",
      city: partner.city || "",
      contactPerson: partner.contactPerson || partner.partnerName || "",
      contactPersonDesignation: partner.contactPersonDesignation || "",
      partnerId: partner.partnerId || partner.id || "",
      businessCategory: partner.businessCategory || "Finance",
      specialization: partner.specialization || "",
      totalEmployees: partner.totalEmployees || "",
      annualTurnover: partner.annualTurnover
        ? partner.annualTurnover
            .replace("₹", "")
            .replace(" Cr", "")
            .replace(" Lakhs", "")
        : "",
      registrationNo: partner.registrationNo || "",
      gstNo: partner.gstNo || "",
      panNo: partner.panNo || "",
      accountHolder: partner.accountHolder || "",
      bankName: partner.bankName || "",
      accountNo: partner.accountNo || "",
      ifsc: partner.ifsc || "",
      upiId: partner.upiId || "",
      commissionType: partner.commissionType || "Percentage",
      commissionValue: partner.commissionValue
        ? partner.commissionValue.replace("%", "").replace("₹", "")
        : "",
      paymentCycle: partner.paymentCycle || "Monthly",
      minimumPayout: partner.minimumPayout
        ? partner.minimumPayout.replace("₹", "").replace(",", "")
        : "",
      monthlyTarget: partner.monthlyTarget
        ? partner.monthlyTarget.replace("₹", "").replace(",", "")
        : "",
      quarterlyTarget: partner.quarterlyTarget
        ? partner.quarterlyTarget
            .replace("₹", "")
            .replace(",", "")
            .replace(" Cr", "0000000")
            .replace(" Lakhs", "00000")
        : "",
      annualTarget: partner.annualTarget
        ? partner.annualTarget
            .replace("₹", "")
            .replace(",", "")
            .replace(" Cr", "0000000")
            .replace(" Lakhs", "00000")
        : "",
      performanceRating: String(partner.performanceRating || "3"),
      status: partner.status || "Active",
      partnershipDate: partner.partnershipDate || "",
      renewalDate: partner.renewalDate || "",
      portalAccess: partner.portalAccess || false,
      username: partner.username || "",
      permissions: partner.permissions || {
        viewLeads: false,
        addCustomers: false,
        viewReports: false,
        accessPortal: false,
        manageSubAgents: false,
      },
    });

    setEditId(partner.id);
    setIsEditing(true);
    setShowPartnerModal(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this partner? This action cannot be undone.",
      )
    ) {
      setPartners(partners.filter((partner) => partner.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (name === "phone" || name === "altPhone")
      newValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    if (name === "pincode") newValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    if (name === "gstNo") newValue = value.toUpperCase().slice(0, 15);
    if (name === "panNo") newValue = value.toUpperCase().slice(0, 10);
    if (
      name === "annualTurnover" ||
      name === "monthlyTarget" ||
      name === "quarterlyTarget" ||
      name === "annualTarget" ||
      name === "minimumPayout" ||
      name === "commissionValue"
    ) {
      newValue = value.replace(/[^0-9.]/g, "");
    }

    if (type === "checkbox") {
      if (name === "portalAccess") {
        setFormData((prev) => ({ ...prev, portalAccess: checked }));
      } else if (name.startsWith("perm_")) {
        const key = name.replace("perm_", "");
        setFormData((prev) => ({
          ...prev,
          permissions: { ...prev.permissions, [key]: checked },
        }));
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: newValue });
      if (errors[name]) setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.companyName)
      newErrors.companyName = "Company Name is required";
    if (!formData.partnerName)
      newErrors.partnerName = "Contact Person is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone || formData.phone.length < 10)
      newErrors.phone = "Valid Phone is required";
    if (!formData.partnerId) newErrors.partnerId = "Partner ID is required";
    if (!formData.commissionValue)
      newErrors.commissionValue = "Commission Value is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const partnerPayload = {
      id: isEditing ? editId : formData.partnerId,
      ...formData,
      annualTurnover: formData.annualTurnover
        ? `₹${parseFloat(formData.annualTurnover).toLocaleString("en-IN")}`
        : "",
      monthlyTarget: formData.monthlyTarget
        ? `₹${parseFloat(formData.monthlyTarget).toLocaleString("en-IN")}`
        : "",
      quarterlyTarget: formData.quarterlyTarget
        ? `₹${(parseFloat(formData.quarterlyTarget) / 1000000).toFixed(1)} Cr`
        : "",
      annualTarget: formData.annualTarget
        ? `₹${(parseFloat(formData.annualTarget) / 1000000).toFixed(1)} Cr`
        : "",
      minimumPayout: formData.minimumPayout
        ? `₹${parseFloat(formData.minimumPayout).toLocaleString("en-IN")}`
        : "",
      commissionValue:
        formData.commissionType === "Percentage"
          ? `${formData.commissionValue}%`
          : `₹${parseFloat(formData.commissionValue).toLocaleString("en-IN")}`,
    };

    if (isEditing) {
      setPartners(
        partners.map((partner) =>
          partner.id === editId ? partnerPayload : partner,
        ),
      );
      alert("Partner Updated Successfully!");
    } else {
      setPartners([...partners, partnerPayload]);
      alert("Partner Added Successfully!");
    }
    setShowPartnerModal(false);
    resetForm();
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

        <Button onClick={handleAddNew} className="px-6 py-2.5">
          <Plus size={20} /> Add New Partner
        </Button>
      </div>

      <AddPartnerTable
        partners={partners}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddPartnerModal
        isOpen={showPartnerModal}
        onClose={closeModal}
        title={isEditing ? "Edit Partner" : "Add New Partner"}
      >
        <AddPartnerForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          onCancel={closeModal}
          isEditing={isEditing}
          performanceOptions={performanceOptions}
        />
      </AddPartnerModal>
    </div>
  );
}
