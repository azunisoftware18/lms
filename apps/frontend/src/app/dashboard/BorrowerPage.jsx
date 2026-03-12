import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Briefcase,
  UserPlus,
  Save,
  X,
  Users,
} from "lucide-react";
import {
  borrowersData,
  branches,
  statusOptions,
} from "../../lib/dashboardDummyData";

import ActionMenu from "../../components/common/ActionMenu";
import Button from "../../components/ui/Button";
import { colorVariables } from "../../lib/index";

export default function BorrowerPage() {
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [borrowers, setBorrowers] = useState(borrowersData);
  const [newBorrower, setNewBorrower] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    branch: "",
    employment: "",
    monthlyIncome: "",
    aadhar: "",
    pan: "",
    reference: "",
  });

  // Get Status Color
  const getStatusColor = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
  };

  // Filtered Borrowers
  const filteredBorrowers = borrowers.filter((borrower) => {
    const matchesSearch =
      borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.phone.includes(searchTerm) ||
      borrower.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.branch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || borrower.status === statusFilter;
    const matchesBranch =
      branchFilter === "all" || borrower.branch === branchFilter;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Statistics
  const stats = {
    total: borrowers.length,
    active: borrowers.filter((b) => b.status === "active").length,
    overdue: borrowers.filter((b) => b.status === "overdue").length,
    pending: borrowers.filter((b) => b.status === "pending").length,
    blocked: borrowers.filter((b) => b.status === "blocked").length,
    kycPending: borrowers.filter((b) => b.kycStatus === "pending").length,
    totalAmount: borrowers.reduce((sum, b) => sum + b.totalAmount, 0),
    overdueAmount: borrowers.reduce((sum, b) => sum + b.overdueAmount, 0),
  };

  // Handle Add Borrower
  const handleAddBorrower = (e) => {
    e.preventDefault();
    const newId =
      borrowers.length > 0 ? Math.max(...borrowers.map((b) => b.id)) + 1 : 1;

    const borrower = {
      id: newId,
      name: newBorrower.name,
      phone: newBorrower.phone,
      email: newBorrower.email,
      address: newBorrower.address,
      branch: newBorrower.branch,
      joinedDate: new Date().toISOString().split("T")[0],
      totalLoans: 0,
      activeLoans: 0,
      totalAmount: 0,
      pendingEMI: 0,
      overdueAmount: 0,
      creditScore: 600,
      kycStatus: "pending",
      employment: newBorrower.employment,
      monthlyIncome: parseInt(newBorrower.monthlyIncome),
      status: "pending",
      tags: ["New"],
      lastPayment: null,
      nextPayment: null,
      documents: {
        aadhar: false,
        pan: false,
        photo: false,
        addressProof: false,
        incomeProof: false,
      },
    };

    setBorrowers([...borrowers, borrower]);
    setShowAddForm(false);
    setNewBorrower({
      name: "",
      phone: "",
      email: "",
      address: "",
      branch: "",
      employment: "",
      monthlyIncome: "",
      aadhar: "",
      pan: "",
      reference: "",
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Phone",
      "Email",
      "Branch",
      "Status",
      "Total Loans",
      "Active Loans",
      "Total Amount",
      "Overdue Amount",
    ];
    const csvData = borrowers.map((b) =>
      [
        b.name,
        b.phone,
        b.email,
        b.branch,
        b.status,
        b.totalLoans,
        b.activeLoans,
        b.totalAmount,
        b.overdueAmount,
      ].join(","),
    );

    const csv = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "borrowers.csv";
    a.click();
  };

  // KYC Status Component
  const KYCStatus = ({ status }) => {
    const getKYCDetails = () => {
      switch (status) {
        case "verified":
          return {
            text: "Verified",
            color: "bg-green-100 text-green-800",
            icon: CheckCircle,
          };
        case "pending":
          return {
            text: "Pending",
            color: "bg-yellow-100 text-yellow-800",
            icon: Clock,
          };
        case "rejected":
          return {
            text: "Rejected",
            color: "bg-red-100 text-red-800",
            icon: XCircle,
          };
        default:
          return {
            text: "Not Started",
            color: "bg-gray-100 text-gray-800",
            icon: FileText,
          };
      }
    };

    const details = getKYCDetails();
    const Icon = details.icon;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${details.color}`}
      >
        <Icon size={12} />
        {details.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className={`w-8 h-8 ${colorVariables.PRIMARY_COLOR}`} />
                Borrower Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all customer accounts, KYC verification, and loan history
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={exportToCSV}
                className={`flex items-center gap-2 ${colorVariables.PRIMARY_BUTTON_COLOR} text-white`}
              >
                <Download className="w-5 h-5" />
                Export
              </Button>
              <Button
                onClick={() => setShowAddForm(true)}
                className={colorVariables.PRIMARY_BUTTON_COLOR}
              >
                <UserPlus className="w-5 h-5" />
                Add New Borrower
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Total Borrowers</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="rounded-xl p-3 border border-green-200 bg-green-50">
              <p className="text-xs text-green-600">Active</p>
              <p className="text-xl font-bold text-green-700">{stats.active}</p>
            </div>
            <div className="rounded-xl p-3 border border-orange-200 bg-orange-50">
              <p className="text-xs text-orange-600">Overdue</p>
              <p className="text-xl font-bold text-orange-700">
                {stats.overdue}
              </p>
            </div>
            <div className="rounded-xl p-3 border border-yellow-200 bg-yellow-50">
              <p className="text-xs text-yellow-600">Pending KYC</p>
              <p className="text-xl font-bold text-yellow-700">
                {stats.kycPending}
              </p>
            </div>
            <div className="rounded-xl p-3 border border-blue-200 bg-blue-50">
              <p className="text-xs text-blue-600">Total Amount</p>
              <p className="text-xl font-bold text-blue-700">
                ₹{(stats.totalAmount / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="rounded-xl p-3 border border-red-200 bg-red-50">
              <p className="text-xs text-red-600">Overdue Amount</p>
              <p className="text-xl font-bold text-red-700">
                ₹{(stats.overdueAmount / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="rounded-xl p-3 border border-purple-200 bg-purple-50">
              <p className="text-xs text-purple-600">Blocked</p>
              <p className="text-xl font-bold text-purple-700">
                {stats.blocked}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, email, or branch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                Filters
                {showFilters ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="all">All Status</option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch
                    </label>
                    <select
                      value={branchFilter}
                      onChange={(e) => setBranchFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="all">All Branches</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      KYC Status
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                      <option value="all">All KYC Status</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    onClick={() => {
                      setStatusFilter("all");
                      setBranchFilter("all");
                      setSearchTerm("");
                    }}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Clear All
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Borrowers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower Details
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial Info
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBorrowers.map((borrower) => (
                  <tr
                    key={borrower.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Borrower Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {borrower.name}
                            </h3>
                            {borrower.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {borrower.employment}
                            </span>
                            <span>
                              ₹{borrower.monthlyIncome.toLocaleString()}/month
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <KYCStatus status={borrower.kycStatus} />
                            <span className="text-xs text-gray-500">
                              Credit Score:{" "}
                              <span className="font-semibold">
                                {borrower.creditScore}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {borrower.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 truncate">
                            {borrower.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 text-sm truncate">
                            {borrower.branch}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Financial Info */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Loans:
                          </span>
                          <span className="font-semibold">
                            {borrower.totalLoans}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Active Loans:
                          </span>
                          <span className="font-semibold text-blue-600">
                            {borrower.activeLoans}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Amount:
                          </span>
                          <span className="font-semibold">
                            ₹{borrower.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        {borrower.overdueAmount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Overdue:
                            </span>
                            <span className="font-semibold text-red-600">
                              ₹{borrower.overdueAmount.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(borrower.status)}`}
                          >
                            {borrower.status.charAt(0).toUpperCase() +
                              borrower.status.slice(1)}
                          </span>
                        </div>
                        {borrower.nextPayment && (
                          <div className="text-xs text-gray-600">
                            Next Payment: {borrower.nextPayment}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions - Now only Three Dots Menu */}
                    <td className="py-4 px-6">
                      <ActionMenu
                        actions={[
                          {
                            label: "View",
                            onClick: () => console.log("View", borrower.id),
                          },
                          {
                            label: "Edit",
                            onClick: () => console.log("Edit", borrower.id),
                          },
                          {
                            divider: true,
                          },
                          {
                            label: "Delete",
                            isDanger: true,
                            onClick: () => console.log("Delete", borrower.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBorrowers.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No borrowers found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between"></div>
        </div>
      </div>

      {/* Add Borrower Modal */}
      {showAddForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add New Borrower
                  </h2>
                </div>
                <Button
                  onClick={() => setShowAddForm(false)}
                  className="bg-white text-gray-700 hover:bg-gray-100 shadow-none"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleAddBorrower}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBorrower.name}
                      onChange={(e) =>
                        setNewBorrower({ ...newBorrower, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newBorrower.phone}
                      onChange={(e) =>
                        setNewBorrower({
                          ...newBorrower,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter Mobile Number"
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newBorrower.email}
                      onChange={(e) =>
                        setNewBorrower({
                          ...newBorrower,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch *
                    </label>
                    <select
                      required
                      value={newBorrower.branch}
                      onChange={(e) =>
                        setNewBorrower({
                          ...newBorrower,
                          branch: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      value={newBorrower.aadhar}
                      onChange={(e) =>
                        setNewBorrower({
                          ...newBorrower,
                          aadhar: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="XXXX XXXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={newBorrower.pan}
                      onChange={(e) =>
                        setNewBorrower({ ...newBorrower, pan: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="ABCDE1234F"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBorrower.employment}
                      onChange={(e) =>
                        setNewBorrower({
                          ...newBorrower,
                          employment: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Income *
                    </label>
                    <input
                      type="number"
                      required
                      value={newBorrower.monthlyIncome}
                      onChange={(e) =>
                        setNewBorrower({
                          ...newBorrower,
                          monthlyIncome: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="50000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      required
                      value={newBorrower.address}
                      onChange={(e) =>
                        setNewBorrower({
                          ...newBorrower,
                          address: e.target.value,
                        })
                      }
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Complete address with PIN code"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference/Notes
                    </label>
                    <textarea
                      value={newBorrower.reference}
                      onChange={(e) =>
                        setNewBorrower({
                          ...newBorrower,
                          reference: e.target.value,
                        })
                      }
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Any reference or additional notes..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 justify-center">
                    <Save className="w-5 h-5" />
                    Create Borrower
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
