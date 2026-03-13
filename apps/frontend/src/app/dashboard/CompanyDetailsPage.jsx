import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  companyDefaultDetails,
  companyTabs,
  businessTypes,
  industries,
} from "../../lib/dashboardDummyData";

import { colorVariables } from "../../lib/index";
export default function CompanyDetailsPage() {
  const [companyDetails, setCompanyDetails] = useState(companyDefaultDetails);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const logoRef = useRef(null);
  const faviconRef = useRef(null);
  const [notification, setNotification] = useState(null);

  const handleInputChange = (field, value) => {
    setCompanyDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(field, reader.result);
        if (field === "logo") setLogoPreview(reader.result);
        if (field === "favicon") setFaviconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    showNotification("Company details saved successfully!", "success");
  };

  const resetForm = () => {
    setCompanyDetails(companyDefaultDetails);
    setLogoPreview(null);
    setFaviconPreview(null);
    showNotification("Form reset successfully", "info");
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <>
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          }`}
        >
          {notification.type === "success" ? (
            <Icons.CheckCircle className="w-5 h-5" />
          ) : (
            <Icons.AlertCircle className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header with Stats */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Icons.Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Company Details
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your company information, branding, and legal details
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">2 days ago</p>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-green-600 flex items-center gap-1">
                      <Icons.CheckCircle className="w-4 h-4" /> Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Company Age</p>
                    <p className="text-2xl font-bold text-gray-900">9 Years</p>
                  </div>
                  <Icons.Calendar className="w-8 h-8 text-blue-100 bg-blue-500 p-1.5 rounded-lg" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Business Type</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {companyDetails.businessType}
                    </p>
                  </div>
                  <Icons.FileText className="w-8 h-8 text-green-100 bg-green-500 p-1.5 rounded-lg" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Documents</p>
                    <p className="text-2xl font-bold text-gray-900">3/3</p>
                  </div>
                  <Icons.Shield className="w-8 h-8 text-purple-100 bg-purple-500 p-1.5 rounded-lg" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Verification</p>
                    <p className="text-2xl font-bold text-gray-900">Verified</p>
                  </div>
                  <Icons.CheckCircle className="w-8 h-8 text-green-100 bg-green-500 p-1.5 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {companyTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Basic Information
                      </h3>
                      <p className="text-gray-600">
                        Company name, description, and basic details
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      <Icons.AlertCircle className="w-4 h-4" />
                      Required fields are marked with *
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={companyDetails.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {businessTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() =>
                                handleInputChange("businessType", type)
                              }
                              className={`px-4 py-3 rounded-xl border transition-colors ${
                                companyDetails.businessType === type
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={companyDetails.industry}
                          onChange={(e) =>
                            handleInputChange("industry", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Registration Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={companyDetails.registrationDate}
                            onChange={(e) =>
                              handleInputChange(
                                "registrationDate",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                          <Icons.Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                      </label>
                      <textarea
                        value={companyDetails.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows="10"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                        placeholder="Describe your company's mission, vision, and services..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {companyDetails.description.length}/500 characters
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                        <Icons.Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Primary Email</p>
                          <p className="font-medium">{companyDetails.email}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={companyDetails.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="company@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={companyDetails.website}
                            onChange={(e) =>
                              handleInputChange("website", e.target.value)
                            }
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="www.example.com"
                          />
                          <Icons.Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={companyDetails.timezone}
                          onChange={(e) =>
                            handleInputChange("timezone", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          <option>IST (UTC+5:30)</option>
                          <option>PST (UTC-8)</option>
                          <option>EST (UTC-5)</option>
                          <option>GMT (UTC+0)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                        <Icons.Phone className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Primary Phone</p>
                          <p className="font-medium">{companyDetails.phone}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={companyDetails.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="+91 1234567890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={companyDetails.currency}
                          onChange={(e) =>
                            handleInputChange("currency", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          <option>INR (₹)</option>
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Address{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            value={companyDetails.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            rows="3"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="Enter full company address"
                          />
                          <Icons.MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Person Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Icons.User className="w-5 h-5" /> Contact Person
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={companyDetails.contactPerson}
                          onChange={(e) =>
                            handleInputChange("contactPerson", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={companyDetails.contactPersonPhone}
                          onChange={(e) =>
                            handleInputChange(
                              "contactPersonPhone",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={companyDetails.contactPersonEmail}
                          onChange={(e) =>
                            handleInputChange(
                              "contactPersonEmail",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Tab */}
              {activeTab === "legal" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Legal & Compliance
                  </h3>
                  <p className="text-gray-600">
                    Update your company's legal documents and registration
                    details
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="p-5 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icons.FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              PAN Card
                            </p>
                            <p className="text-sm text-gray-600">
                              Permanent Account Number
                            </p>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={companyDetails.panNumber}
                          onChange={(e) =>
                            handleInputChange("panNumber", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono"
                          placeholder="ABCDE1234F"
                        />
                      </div>

                      <div className="p-5 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Icons.Shield className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              CIN Number
                            </p>
                            <p className="text-sm text-gray-600">
                              Corporate Identity Number
                            </p>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={companyDetails.cinNumber}
                          onChange={(e) =>
                            handleInputChange("cinNumber", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono"
                          placeholder="U67190MH2010PLC199123"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-5 bg-linear-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Icons.FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              GST Number
                            </p>
                            <p className="text-sm text-gray-600">
                              Goods and Services Tax
                            </p>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={companyDetails.gstNumber}
                          onChange={(e) =>
                            handleInputChange("gstNumber", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono"
                          placeholder="22ABCDE1234F1Z5"
                        />
                      </div>

                      <div className="p-5 bg-linear-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Icons.Calendar className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Registration Date
                            </p>
                            <p className="text-sm text-gray-600">
                              Date of Incorporation
                            </p>
                          </div>
                        </div>
                        <input
                          type="date"
                          value={companyDetails.registrationDate}
                          onChange={(e) =>
                            handleInputChange(
                              "registrationDate",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Upload Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Document Upload
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        "PAN Card",
                        "GST Certificate",
                        "Certificate of Incorporation",
                      ].map((doc) => (
                        <div
                          key={doc}
                          className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Icons.FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{doc}</p>
                              <p className="text-sm text-gray-600">
                                Click to upload
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Branding Tab */}
              {activeTab === "branding" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Brand Identity
                  </h3>
                  <p className="text-gray-600">
                    Upload your company logo, favicon, and branding assets
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Logo Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Company Logo
                          </h4>
                          <p className="text-sm text-gray-600">
                            Primary logo displayed across the platform
                          </p>
                        </div>
                        <label className="cursor-pointer">
                          <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            <Icons.Upload className="w-4 h-4" />
                            Change Logo
                          </span>
                          <input
                            ref={logoRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload("logo", e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                      <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-48 h-48 border border-gray-300 rounded-lg bg-white p-4 mb-4 flex items-center justify-center overflow-hidden">
                            {companyDetails.logo || logoPreview ? (
                              <img
                                src={logoPreview || companyDetails.logo}
                                alt="Logo Preview"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="text-center">
                                <Icons.ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                  No logo uploaded
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 text-center">
                            Recommended: 300x300px • PNG, SVG, JPG • Max 2MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Favicon Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Favicon</h4>
                          <p className="text-sm text-gray-600">
                            Browser tab icon (16x16px to 32x32px)
                          </p>
                        </div>
                        <label className="cursor-pointer">
                          <span className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                            <Icons.Upload className="w-4 h-4" />
                            Change Favicon
                          </span>
                          <input
                            ref={faviconRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload("favicon", e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                      <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-32 h-32 border border-gray-300 rounded-lg bg-white p-4 mb-4 flex items-center justify-center overflow-hidden">
                            {companyDetails.favicon || faviconPreview ? (
                              <img
                                src={faviconPreview || companyDetails.favicon}
                                alt="Favicon Preview"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="text-center">
                                <Icons.ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">
                                  No favicon uploaded
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mb-4">
                            {[16, 32, 64].map((size) => (
                              <div key={size} className="text-center">
                                <div
                                  className={`w-${size / 4} h-${size / 4} border border-gray-300 rounded bg-white flex items-center justify-center mb-1 mx-auto`}
                                >
                                  <span className="text-xs text-gray-400">
                                    {size}x{size}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {size}px
                                </p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 text-center">
                            Recommended: 32x32px • ICO, PNG • Max 256KB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand Colors Preview */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Brand Colors
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          name: "Primary",
                          color: colorVariables.ACCENT_COLOR_BG,
                          value: "#2563eb",
                        },
                        {
                          name: "Secondary",
                          color: colorVariables.SECONDARY_COLOR.split(" ")[0],
                          value: "#2563eb",
                        },
                        {
                          name: "Executive",
                          color: colorVariables.EXECUTIVE_COLOR.split(" ")[1],
                          value: "#ef4444",
                        },
                        {
                          name: "Independent",
                          color: colorVariables.INDEPENDENT_COLOR.split(" ")[1],
                          value: "#22c55e",
                        },
                      ].map((color) => (
                        <div
                          key={color.name}
                          className="p-4 border border-gray-200 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 ${color.color} rounded-lg`}
                            ></div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {color.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {color.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-linear-to-r from-gray-50 to-blue-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    Ready to update company details?
                  </p>
                  <p className="text-sm text-gray-600">
                    Review all information before saving. Changes will be
                    reflected across the platform.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                  >
                    <Icons.RefreshCw className="w-4 h-4" />
                    Reset All
                  </button>
                  <button
                    onClick={saveSettings}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] ${
                      isSaving
                        ? "bg-linear-to-r from-blue-400 to-blue-500 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    } text-white`}
                  >
                    {isSaving ? (
                      <>
                        <Icons.RefreshCw className="w-4 h-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Icons.Save className="w-4 h-4" />
                        Save All Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="#"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Icons.Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Privacy Settings</p>
                  <p className="text-sm text-gray-600">Manage data privacy</p>
                </div>
              </div>
            </Link>
            <Link
              to="#"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-green-400 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Icons.FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Documentation</p>
                  <p className="text-sm text-gray-600">View company docs</p>
                </div>
              </div>
            </Link>
            <Link
              to="#"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-400 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Icons.User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Team Members</p>
                  <p className="text-sm text-gray-600">
                    Manage access controls
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
