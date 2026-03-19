import React, { useEffect, useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import AddEmployeeFormModal from "../../../components/modals/AddEmployeeFormModal";
import EmployeeDetailsModal from "../../../components/modals/EmployeeDetailsModal";
import EmployeeAccessModal from "../../../components/modals/EmployeeAccessModal";
import Button from "../../../components/ui/Button";
import SearchField from "../../../components/ui/SearchField";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import EmployeeAddTable from "../../../components/tables/EmployeeAddTable";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import Pagination from "../../../components/common/Pagination";
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "../../../hooks/useEmployee";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../lib/utils/toastService";

const INITIAL_FORM_STATE = {
  fullName: "",
  email: "",
  phone: "",
  altPhone: "",
  dob: "",
  gender: "Male",
  maritalStatus: "Single",
  address: "",
  city: "",
  state: "",
  pincode: "",
  emergencyContact: "",
  emergencyRelation: "Father",
  employeeId: "",
  department: "Sales",
  designation: "Executive",
  dateOfJoining: "",
  experience: "",
  reportingManager: "",
  workLocation: "Office",
  aadhaarNo: "",
  panNo: "",
  bankAccountNo: "",
  aadhaarFrontImg: null,
  aadhaarBackImg: null,
  panImg: null,
  profilePhoto: null,
  resume: null,
  accountHolder: "",
  bankName: "",
  ifsc: "",
  upiId: "",
  username: "",
  password: "",
  salaryType: "Monthly",
  basicSalary: "",
  hra: "",
  conveyance: "",
  medicalAllowance: "",
  otherAllowances: "",
  pfDeduction: "",
  taxDeduction: "",
  status: "Active",
  leaveBalance: "12",
  permissions: {
    addCustomer: false,
    viewCustomer: false,
    processLoan: false,
    manageLeads: false,
    generateReports: false,
  },
};

const INITIAL_PRESENTATION_FORM = {
  title: "",
  description: "",
  deadline: "",
  priority: "Medium",
  attachments: null,
};

const DEPARTMENTS = [
  "All",
  "Sales",
  "Marketing",
  "Operations",
  "HR",
  "Finance",
  "IT",
  "Customer Service",
  "Management",
];

const STATUS_OPTIONS = ["All", "Active", "Inactive", "On Leave", "Probation"];

export default function EmployeeAddPage() {
  const [view] = useState("list");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // --- VIEW MODAL STATE ---
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  // --- PRESENTATION MODAL STATE ---
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [presentations, setPresentations] = useState([]);

  // --- SEARCH & FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Presentation Form State
  const [presentationForm, setPresentationForm] = useState(
    INITIAL_PRESENTATION_FORM,
  );

  // Page Access State for each employee
  const [employeePageAccess, setEmployeePageAccess] = useState({});

  const {
    employees: employeeList = [],
    meta,
    loading: employeesLoading,
    isFetching: employeesFetching,
    refetch,
  } = useEmployees({
    page: currentPage,
    limit: rowsPerPage,
    q: debouncedSearchQuery || undefined,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const employees = useMemo(() => {
    if (!Array.isArray(employeeList)) return [];

    return employeeList.map((employee) => ({
      ...employee,
      id: employee.id,
      employeeId: employee.employeeId,
      fullName: employee.fullName ?? employee.user?.fullName ?? "",
      email: employee.email ?? employee.user?.email ?? "",
      phone:
        employee.phone ??
        employee.contactNumber ??
        employee.user?.contactNumber ??
        "",
      contactNumber:
        employee.contactNumber ??
        employee.user?.contactNumber ??
        employee.phone ??
        "",
      username:
        employee.username ?? employee.userName ?? employee.user?.userName ?? "",
      status:
        employee.status ??
        (typeof employee.isActive === "boolean"
          ? employee.isActive
            ? "Active"
            : "Inactive"
          : employee.user?.isActive
            ? "Active"
            : "Inactive"),
      branchId: employee.branchId ?? employee.user?.branchId ?? "",
      permissions: employee.permissions ?? {},
    }));
  }, [employeeList]);

  const defaultPageAccessByEmployee = useMemo(() => {
    return employees.reduce((acc, employee) => {
      acc[employee.employeeId] = {
        dashboard: true,
        customers: employee.permissions?.viewCustomer || false,
        loans: employee.permissions?.processLoan || false,
        reports: employee.permissions?.generateReports || false,
        settings: employee.department === "Management" || false,
        notifications: true,
        messages: true,
        profile: true,
      };
      return acc;
    }, {});
  }, [employees]);

  // --- FILTERED DATA LOGIC ---
  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) => {
        const q = searchQuery.toLowerCase();
        const matchDepartment =
          filterDepartment === "All" ||
          employee.department === filterDepartment;
        const matchStatus =
          filterStatus === "All" || employee.status === filterStatus;
        const matchSearch =
          employee.fullName?.toLowerCase().includes(q) ||
          employee.email?.toLowerCase().includes(q) ||
          employee.phone?.includes(searchQuery) ||
          employee.employeeId?.toLowerCase().includes(q) ||
          employee.department?.toLowerCase().includes(q);

        return matchSearch && matchDepartment && matchStatus;
      })
    : [];

  const totalPages = Math.max(1, Number(meta?.totalPages || meta?.pages || 1));

  const selectedEmployeePresentations = useMemo(() => {
    if (!selectedEmployee?.employeeId) return [];
    return presentations.filter(
      (p) => p.employeeId === selectedEmployee.employeeId,
    );
  }, [presentations, selectedEmployee]);

  // Get page access for selected employee
  const getEmployeePageAccess = (employeeId) => {
    return {
      ...(defaultPageAccessByEmployee[employeeId] || {}),
      ...(employeePageAccess[employeeId] || {}),
    };
  };

  // --- EXPORT HANDLER (CSV for Excel) ---
  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Employee ID,Name,Email,Phone,Department,Designation,Salary,Status,Leave Balance\n";

    filteredEmployees.forEach((emp) => {
      const row = `${emp.employeeId},"${emp.fullName}","${emp.email}","${emp.phone}","${emp.department}","${emp.designation}","${emp.totalSalary}","${emp.status}","${emp.leaveBalance}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Employees exported successfully");
  };

  // --- VIEW HANDLER ---
  const handleView = (employee) => {
    setViewData(employee);
    setShowViewModal(true);
  };

  // --- PRESENTATION HANDLERS ---
  const handlePresentationClick = (employee) => {
    setSelectedEmployee(employee);
    setShowPresentationModal(true);
  };

  const handleClosePresentationModal = () => {
    setShowPresentationModal(false);
    setSelectedEmployee(null);
    setPresentationForm(INITIAL_PRESENTATION_FORM);
  };

  const handlePresentationFormChange = (e) => {
    const { name, value } = e.target;
    setPresentationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresentationAttachmentChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPresentationForm((prev) => ({
      ...prev,
      attachments: file,
    }));
  };

  const handlePageAccessChange = (employeeId, pageId, checked) => {
    setEmployeePageAccess((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [pageId]: checked,
      },
    }));
  };

  const handleAssignPresentation = (e) => {
    e.preventDefault();

    if (
      !presentationForm.title ||
      !presentationForm.description ||
      !presentationForm.deadline
    ) {
      showError("Please fill all required fields");
      return;
    }

    const newPresentation = {
      id: presentations.length + 1,
      employeeId: selectedEmployee.employeeId,
      employeeName: selectedEmployee.fullName,
      title: presentationForm.title,
      description: presentationForm.description,
      deadline: presentationForm.deadline,
      priority: presentationForm.priority,
      status: "Pending",
      assignedDate: new Date().toISOString().split("T")[0],
      assignedBy: "Admin",
      attachments: presentationForm.attachments ? 1 : 0,
    };

    setPresentations((prev) => [...prev, newPresentation]);

    showSuccess(
      `Presentation assigned to ${selectedEmployee.fullName} successfully!`,
    );
    handleClosePresentationModal();
  };

  const handleSavePageAccess = () => {
    if (selectedEmployee) {
      showSuccess(
        `Page access updated for ${selectedEmployee.fullName} successfully!`,
      );
      handleClosePresentationModal();
    }
  };

  const handlePresentationStatusChange = (presentationId, newStatus) => {
    setPresentations((prev) =>
      prev.map((p) =>
        p.id === presentationId ? { ...p, status: newStatus } : p,
      ),
    );
  };

  const handleDeletePresentation = (presentationId) => {
    if (window.confirm("Are you sure you want to delete this presentation?")) {
      setPresentations((prev) => prev.filter((p) => p.id !== presentationId));
      showInfo("Task deleted successfully");
    }
  };

  // --- DOWNLOAD SINGLE PROFILE (CSV for Excel) ---
  const handleDownloadProfile = () => {
    if (!viewData) return;

    const rows = [
      ["Field", "Value"],
      ["Employee ID", viewData.employeeId],
      ["Full Name", viewData.fullName],
      ["Email", viewData.email],
      ["Phone", viewData.phone],
      ["Alt Phone", viewData.altPhone || "N/A"],
      ["Department", viewData.department],
      ["Designation", viewData.designation],
      ["Status", viewData.status],
      ["DOB", viewData.dob || "N/A"],
      ["Gender", viewData.gender],
      ["Marital Status", viewData.maritalStatus],
      [
        "Address",
        `"${viewData.address}, ${viewData.city}, ${viewData.state} - ${viewData.pincode}"`,
      ],
      ["Date of Joining", viewData.dateOfJoining],
      ["Experience", viewData.experience],
      ["Reporting Manager", viewData.reportingManager],
      ["Work Location", viewData.workLocation],
      ["Emergency Contact", viewData.emergencyContact || "N/A"],
      ["Emergency Relation", viewData.emergencyRelation],
      ["Aadhaar No", `'${viewData.aadhaarNo}`],
      ["PAN No", viewData.panNo],
      ["Bank Name", viewData.bankName],
      ["Account No", `'${viewData.bankAccountNo}`],
      ["IFSC Code", viewData.ifsc],
      ["UPI ID", viewData.upiId || "N/A"],
      ["Basic Salary", viewData.basicSalary],
      ["HRA", viewData.hra],
      ["Conveyance", viewData.conveyance],
      ["Total Salary", viewData.totalSalary],
      ["Leave Balance", viewData.leaveBalance],
      ["Username", viewData.username],
      ["Password", viewData.password],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach((rowArray) => {
      const row = rowArray.join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `${viewData.fullName}_Employee_Profile.csv`;
    link.click();
    showSuccess("Employee profile exported successfully");
  };

  // --- FORM HANDLERS ---

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsEditing(false);
    setEditId(null);
    setShowEmployeeModal(false);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData(INITIAL_FORM_STATE);
    setShowEmployeeModal(true);
  };

  const handleEdit = (employee) => {
    setFormData({
      fullName: employee.fullName || "",
      email: employee.email || "",
      contactNumber: employee.phone || employee.contactNumber || "",
      atlMobileNumber: employee.altPhone || "",
      dob: employee.dob || "",
      gender: (employee.gender || "MALE").toUpperCase(),
      maritalStatus: (employee.maritalStatus || "SINGLE").toUpperCase(),
      userName: employee.username || employee.userName || "",
      password: employee.password || "",
      address: employee.address || "",
      city: employee.city || "",
      state: employee.state || "",
      pinCode: employee.pincode || employee.pinCode || "",
      emergencyContact: employee.emergencyContact || "",
      emergencyRelationship: (
        employee.emergencyRelation ||
        employee.emergencyRelationship ||
        "FATHER"
      ).toUpperCase(),
      department: employee.department || "Sales",
      designation: employee.designation || "",
      dateOfJoining: employee.dateOfJoining || "",
      experience: employee.experience || "",
      workLocation: (employee.workLocation || "OFFICE").toUpperCase(),
      aadhaarNo: employee.aadhaarNo || "",
      panNo: employee.panNo || "",
      accountHolder: employee.accountHolder || "",
      bankName: employee.bankName || "",
      bankAccountNo: employee.bankAccountNo || "",
      ifsc: employee.ifsc || "",
      upiId: employee.upiId || "",
      basicSalary: employee.basicSalary
        ? String(employee.basicSalary).replace(/[^0-9]/g, "")
        : "",
      hra: employee.hra ? String(employee.hra).replace(/[^0-9]/g, "") : "",
      conveyance: employee.conveyance
        ? String(employee.conveyance).replace(/[^0-9]/g, "")
        : "",
      medicalAllowance: employee.medicalAllowance
        ? String(employee.medicalAllowance).replace(/[^0-9]/g, "")
        : "",
      otherAllowances: employee.otherAllowances
        ? String(employee.otherAllowances).replace(/[^0-9]/g, "")
        : "",
      pfDeduction: employee.pfDeduction
        ? String(employee.pfDeduction).replace(/[^0-9]/g, "")
        : "",
      taxDeduction: employee.taxDeduction
        ? String(employee.taxDeduction).replace(/[^0-9]/g, "")
        : "",
      status: employee.status || "Active",
      permissions: {
        canAddCustomer:
          employee.permissions?.canAddCustomer ||
          employee.permissions?.addCustomer ||
          false,
        canViewAllCustomers:
          employee.permissions?.canViewAllCustomers ||
          employee.permissions?.viewCustomer ||
          false,
        canProcessLoans:
          employee.permissions?.canProcessLoans ||
          employee.permissions?.processLoan ||
          false,
        canManageLeads:
          employee.permissions?.canManageLeads ||
          employee.permissions?.manageLeads ||
          false,
        canGenerateReports:
          employee.permissions?.canGenerateReports ||
          employee.permissions?.generateReports ||
          false,
      },
      employeeId: employee.employeeId,
      leaveBalance: employee.leaveBalance || "12",
      salaryType: "Monthly",
    });

    setEditId(employee.id);
    setIsEditing(true);
    setShowEmployeeModal(true);
  };

  const handleEmployeeFormSuccess = async (payload) => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : {};

    const branchId =
      payload.branchId || user?.branchId || user?.employee?.branchId;
    const defaultEmployeeRoleId =
      payload.employeeRoleId ||
      user?.employeeRoleId ||
      user?.employee?.employeeRoleId;

    if (!defaultEmployeeRoleId) {
      showError("Employee role is required before saving employee");
      return;
    }

    const commonPayload = {
      ...payload,
      role: "EMPLOYEE",
      employeeRoleId: defaultEmployeeRoleId,
    };

    try {
      if (isEditing && editId) {
        const updatePayload = {
          ...commonPayload,
        };
        delete updatePayload.branchId;

        await updateEmployeeMutation.mutateAsync({
          id: editId,
          data: updatePayload,
        });
      } else {
        if (!branchId) {
          showError("Branch assignment is required for employee");
          return;
        }

        await createEmployeeMutation.mutateAsync({
          ...commonPayload,
          branchId,
        });
      }

      await refetch();
      resetForm();
    } catch (error) {
      const message = error?.message || "Failed to save employee";
      showError(message);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;

    try {
      await deleteEmployeeMutation.mutateAsync(deleteCandidate.id);
      setDeleteCandidate(null);
      await refetch();
      showInfo("Employee deleted successfully");
    } catch (error) {
      showError(error?.message || "Failed to delete employee");
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 relative">
      <EmployeeDetailsModal
        isOpen={showViewModal}
        employee={viewData}
        onClose={() => setShowViewModal(false)}
        onDownloadProfile={handleDownloadProfile}
      />

      <EmployeeAccessModal
        isOpen={showPresentationModal}
        selectedEmployee={selectedEmployee}
        presentationForm={presentationForm}
        selectedEmployeePresentations={selectedEmployeePresentations}
        getEmployeePageAccess={getEmployeePageAccess}
        onClose={handleClosePresentationModal}
        onSavePageAccess={handleSavePageAccess}
        onPageAccessChange={handlePageAccessChange}
        onPresentationFormChange={handlePresentationFormChange}
        onAttachmentChange={handlePresentationAttachmentChange}
        onAssignPresentation={handleAssignPresentation}
        onPresentationStatusChange={handlePresentationStatusChange}
        onDeletePresentation={handleDeletePresentation}
        getPriorityColor={getPriorityColor}
        getStatusColor={getStatusColor}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage employee records, payroll, and access permissions.
          </p>
        </div>

        {view === "list" ? (
          <Button onClick={handleAddNew} className="px-6 py-2.5">
            <Plus size={20} /> Add New Employee
          </Button>
        ) : (
          <Button
            onClick={resetForm}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5"
          >
            Cancel & View List
          </Button>
        )}
      </div>

      <AddEmployeeFormModal
        isOpen={showEmployeeModal}
        onClose={resetForm}
        isEditing={isEditing}
        editId={editId}
        initialFormState={formData}
        onSuccess={handleEmployeeFormSuccess}
      />

      {/* --- VIEW: EMPLOYEE LIST --- */}
      {view === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div className="w-full sm:w-96">
              <SearchField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                showResults={false}
                placeholder="Search by name, employee ID, or department..."
              />
            </div>

            <div className="flex gap-2 relative flex-wrap justify-end w-full sm:w-auto">
              <FilterDropdown
                value={filterDepartment}
                onChange={(value) => {
                  setFilterDepartment(value);
                  setCurrentPage(1);
                }}
                placeholder="Department"
                options={DEPARTMENTS.map((dept) => ({
                  value: dept,
                  label: dept === "All" ? "All Departments" : dept,
                }))}
                className="min-w-45"
              />

              <FilterDropdown
                value={filterStatus}
                onChange={(value) => {
                  setFilterStatus(value);
                  setCurrentPage(1);
                }}
                placeholder="Filter Status"
                options={STATUS_OPTIONS.map((status) => ({
                  value: status,
                  label: status,
                }))}
                className="min-w-42.5"
              />

              <Button
                onClick={handleExport}
                className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
              >
                <Download size={16} /> Export
              </Button>
            </div>
          </div>

          <EmployeeAddTable
            employees={filteredEmployees}
            presentations={presentations}
            onPermission={handlePresentationClick}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={setDeleteCandidate}
          />

          <div className="border-t border-gray-100 px-4 sm:px-6 py-3 bg-gray-50/70">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            {(employeesLoading || employeesFetching) && (
              <p className="text-xs text-slate-500 text-center mt-1">
                Loading employees...
              </p>
            )}
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={Boolean(deleteCandidate)}
        title="Delete employee"
        description={`Are you sure you want to delete ${deleteCandidate?.fullName || "this employee"}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isPopup
        onConfirm={handleDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
