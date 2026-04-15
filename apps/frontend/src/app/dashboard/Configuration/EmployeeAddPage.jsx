import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import AddEmployeeForm from "../../../components/forms/AddEmployeeForm";
import EmployeeDetailsModal from "../../../components/modals/EmployeeDetailsModal";
import EmployeeAccessModal from "../../../components/modals/EmployeeAccessModal";
import Button from "../../../components/ui/Button";
import EmployeeAddTable from "../../../components/tables/EmployeeAddTable";
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
} from "../../../hooks/useEmployee";
import { useEmployee } from "../../../hooks/useEmployee";
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
  roleTitle: "",
  employeeRoleId: "",
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
  permissions: {},
};

const INITIAL_PRESENTATION_FORM = {
  title: "",
  description: "",
  deadline: "",
  priority: "Medium",
  attachments: null,
};

export default function EmployeeAddPage() {
  const [view, setView] = useState("list");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [presentations, setPresentations] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [filterStatus, setFilterStatus] = useState("All");

  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  // queryClient no longer needed here (using `useEmployee` hook instead)
  const [fetchId, setFetchId] = useState(null);
  const [fetchMode, setFetchMode] = useState(null); // 'view' | 'edit' | null
  const {
    data: fetchedEmployeeRaw,
    error: fetchedEmployeeError,
    isLoading: fetchedEmployeeLoading,
  } = useEmployee(fetchId || undefined);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [presentationForm, setPresentationForm] = useState(
    INITIAL_PRESENTATION_FORM,
  );

  const [employeePageAccess, setEmployeePageAccess] = useState({});

  const {
    employees: employeeList = [],
    loading: employeesLoading,
    isFetching: employeesFetching,
    refetch,
    rawResponse,
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
    const sourceEmployees =
      Array.isArray(employeeList) && employeeList.length > 0
        ? employeeList
        : Array.isArray(employeeList?.data?.data)
          ? employeeList.data.data
          : Array.isArray(employeeList?.data)
            ? employeeList.data
            : // fallback to rawResponse from query (axios response)
              Array.isArray(rawResponse?.data?.data)
              ? rawResponse.data.data
              : Array.isArray(rawResponse?.data)
                ? rawResponse.data
                : [];

    return sourceEmployees.map((employee) => ({
      ...employee,
      id: employee.id,
      employeeId: employee.employeeId,
      fullName: employee.fullName ?? employee.user?.fullName ?? "",
      email: employee.email ?? employee.Email ?? employee.user?.email ?? "",
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
  }, [employeeList, rawResponse]);

  // debug logs removed

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

  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) => {
        const q = searchQuery.toLowerCase();
        const matchStatus =
          filterStatus === "All" || employee.status === filterStatus;
        const matchSearch =
          employee.fullName?.toLowerCase().includes(q) ||
          employee.email?.toLowerCase().includes(q) ||
          employee.phone?.includes(searchQuery) ||
          employee.employeeId?.toLowerCase().includes(q) ||
          employee.department?.toLowerCase().includes(q);

        return matchSearch && matchStatus;
      })
    : [];

  // totalPages is now computed inside EmployeeAddTable

  const selectedEmployeePresentations = useMemo(() => {
    if (!selectedEmployee?.employeeId) return [];
    return presentations.filter(
      (p) => p.employeeId === selectedEmployee.employeeId,
    );
  }, [presentations, selectedEmployee]);

  const getEmployeePageAccess = (employeeId) => ({
    ...(defaultPageAccessByEmployee[employeeId] || {}),
    ...(employeePageAccess[employeeId] || {}),
  });

  const toDateInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const toNum = (value) => {
    if (value == null || value === "") return 0;
    const num = Number(String(value).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(num) ? num : 0;
  };

  const buildTotalSalary = (salaryDetails = {}) => {
    const basicSalary = toNum(salaryDetails.basicSalary);
    const conveyance = toNum(salaryDetails.conveyance);
    const medicalAllowance = toNum(salaryDetails.medicalAllowance);
    const otherAllowances = toNum(salaryDetails.otherAllowances);
    const pfDeduction = toNum(salaryDetails.pfDeduction);
    const taxDeduction = toNum(salaryDetails.taxDeduction);

    return (
      basicSalary +
      conveyance +
      medicalAllowance +
      otherAllowances -
      pfDeduction -
      taxDeduction
    );
  };

  const normalizeEmployeeDetail = (payload) => {
    const source = payload?.employee ? payload.employee : payload;
    const user = payload?.user || source?.user || {};
    const employeeRole = source?.employeeRole || payload?.employeeRole || null;
    const employeeAddress = source?.address || payload?.address || null;

    const documents = payload?.documents || source?.documents || [];
    const docValue = (type) =>
      Array.isArray(documents)
        ? documents.find((d) => d?.documentType === type)?.documentPath
        : undefined;

    const accountDetails = payload?.accountDetails || {
      accountHolder: docValue("EMP_ACCOUNT_HOLDER") || "",
      bankName: docValue("EMP_BANK_NAME") || "",
      bankAccountNo: docValue("EMP_BANK_ACCOUNT_NO") || "",
      ifsc: docValue("EMP_IFSC") || "",
      upiId: docValue("EMP_UPI_ID") || "",
    };

    const salaryDetails = payload?.salaryDetails || {
      basicSalary: toNum(docValue("EMP_SALARY_BASIC")),
      conveyance: toNum(docValue("EMP_SALARY_CONVEYANCE")),
      medicalAllowance: toNum(docValue("EMP_SALARY_MEDICAL_ALLOWANCE")),
      otherAllowances: toNum(docValue("EMP_SALARY_OTHER_ALLOWANCES")),
      pfDeduction: toNum(docValue("EMP_SALARY_PF_DEDUCTION")),
      taxDeduction: toNum(docValue("EMP_SALARY_TAX_DEDUCTION")),
    };

    const totalSalary = buildTotalSalary(salaryDetails);

    return {
      ...source,
      user,
      employeeRole,
      addressDetail: employeeAddress,
      branch: source?.branch || payload?.branch || null,
      documents,
      accountDetails,
      salaryDetails,
      id: source?.id,
      employeeId: source?.employeeId,
      fullName: source?.fullName || user?.fullName || "",
      email: source?.Email || source?.email || user?.email || "",
      phone: source?.contactNumber || user?.contactNumber || "",
      contactNumber: source?.contactNumber || user?.contactNumber || "",
      altPhone: source?.atlMobileNumber || "",
      userName: user?.userName || source?.userName || "",
      username: user?.userName || source?.userName || "",
      dob: toDateInput(source?.dob),
      dateOfJoining: toDateInput(source?.dateOfJoining),
      gender: source?.gender || "MALE",
      maritalStatus: source?.maritalStatus || "SINGLE",
      designation: source?.designation || "",
      department: source?.department || employeeRole?.roleTitle || "",
      roleTitle: employeeRole?.roleTitle || source?.roleTitle || "",
      roleName: employeeRole?.roleName || source?.roleName || "",
      roleFor: employeeRole?.roleFor || source?.roleFor || "",
      employeeRoleId: source?.employeeRoleId || employeeRole?.id || "",
      reportingManager:
        source?.reportingManagerId || source?.reportingManager || "",
      reportingManagerId:
        source?.reportingManagerId || source?.reportingManager || "",
      workLocation: source?.workLocation || "OFFICE",
      city: employeeAddress?.city || source?.city || "",
      state: employeeAddress?.state || source?.state || "",
      pinCode: employeeAddress?.pinCode || source?.pinCode || "",
      pincode: employeeAddress?.pinCode || source?.pinCode || "",
      addressLine1: employeeAddress?.addressLine1 || "",
      addressLine2: employeeAddress?.addressLine2 || "",
      address:
        [employeeAddress?.addressLine1, employeeAddress?.addressLine2]
          .filter(Boolean)
          .join(", ") ||
        source?.address ||
        "",
      emergencyContact: source?.emergencyContact || "",
      emergencyRelationship: source?.emergencyRelationship || "",
      emergencyRelation: source?.emergencyRelationship || "",
      aadhaarNo:
        docValue("AADHAAR_FRONT") ||
        docValue("AADHAAR_BACK") ||
        docValue("AADHAR_FRONT") ||
        docValue("AADHAR_BACK") ||
        source?.aadhaarNo ||
        "",
      panNo: docValue("PAN_FILE") || source?.panNo || "",
      branchId: source?.branchId || user?.branchId || "",
      branchCode:
        source?.branch?.code ||
        payload?.branch?.code ||
        source?.branchCode ||
        "",
      branchName:
        source?.branch?.name ||
        payload?.branch?.name ||
        source?.branchName ||
        "",
      status:
        source?.status ||
        (typeof user?.isActive === "boolean"
          ? user.isActive
            ? "Active"
            : "Inactive"
          : "Active"),
      accountHolder: accountDetails?.accountHolder || "",
      bankName: accountDetails?.bankName || "",
      bankAccountNo: accountDetails?.bankAccountNo || "",
      ifsc: accountDetails?.ifsc || "",
      upiId: accountDetails?.upiId || "",
      basicSalary: toNum(salaryDetails?.basicSalary),
      conveyance: toNum(salaryDetails?.conveyance),
      medicalAllowance: toNum(salaryDetails?.medicalAllowance),
      otherAllowances: toNum(salaryDetails?.otherAllowances),
      pfDeduction: toNum(salaryDetails?.pfDeduction),
      taxDeduction: toNum(salaryDetails?.taxDeduction),
      totalSalary: `Rs ${totalSalary.toLocaleString()}`,
    };
  };

  const mapEmployeeToForm = (employee) => ({
    fullName: employee.fullName || employee.user?.fullName || "",
    email: employee.email || employee.Email || employee.user?.email || "",
    contactNumber:
      employee.phone ||
      employee.contactNumber ||
      employee.user?.contactNumber ||
      "",
    atlMobileNumber: employee.atlMobileNumber || employee.altPhone || "",
    dob: toDateInput(employee.dob),
    gender: (employee.gender || "MALE").toUpperCase(),
    maritalStatus: (employee.maritalStatus || "SINGLE").toUpperCase(),
    userName: employee.userName || employee.user?.userName || "",
    password: "",
    address: employee.address || employee.addressLine1 || "",
    city: employee.city || employee.addressDetail?.city || "",
    state: employee.state || employee.addressDetail?.state || "",
    pinCode:
      employee.pinCode ||
      employee.pincode ||
      employee.addressDetail?.pinCode ||
      "",
    emergencyContact: employee.emergencyContact || "",
    emergencyRelationship: (
      employee.emergencyRelation ||
      employee.emergencyRelationship ||
      "FATHER"
    ).toUpperCase(),
    department: employee.department || employee.roleTitle || "",
    designation: employee.designation || "",
    roleTitle: employee.employeeRole?.roleTitle || employee.roleTitle || "",
    employeeRoleId: employee.employeeRoleId || employee.employeeRole?.id || "",
    reportingManager:
      employee.reportingManager || employee.reportingManagerId || "",
    branchCode: employee.branchCode || employee.branch?.code || "",
    dateOfJoining: toDateInput(employee.dateOfJoining),
    experience: employee.experience || "",
    workLocation: (employee.workLocation || "OFFICE").toUpperCase(),
    aadhaarNo: employee.aadhaarNo || "",
    panNo: employee.panNo || "",
    accountHolder:
      employee.accountHolder || employee.accountDetails?.accountHolder || "",
    bankName: employee.bankName || employee.accountDetails?.bankName || "",
    bankAccountNo:
      employee.bankAccountNo || employee.accountDetails?.bankAccountNo || "",
    ifsc: employee.ifsc || employee.accountDetails?.ifsc || "",
    upiId: employee.upiId || employee.accountDetails?.upiId || "",
    basicSalary:
      (employee.basicSalary ?? employee.salaryDetails?.basicSalary) != null
        ? String(
            employee.basicSalary ?? employee.salaryDetails?.basicSalary,
          ).replace(/[^0-9]/g, "")
        : "",
    hra: employee.hra ? String(employee.hra).replace(/[^0-9]/g, "") : "",
    conveyance:
      (employee.conveyance ?? employee.salaryDetails?.conveyance) != null
        ? String(
            employee.conveyance ?? employee.salaryDetails?.conveyance,
          ).replace(/[^0-9]/g, "")
        : "",
    medicalAllowance:
      (employee.medicalAllowance ?? employee.salaryDetails?.medicalAllowance) !=
      null
        ? String(
            employee.medicalAllowance ??
              employee.salaryDetails?.medicalAllowance,
          ).replace(/[^0-9]/g, "")
        : "",
    otherAllowances:
      (employee.otherAllowances ?? employee.salaryDetails?.otherAllowances) !=
      null
        ? String(
            employee.otherAllowances ?? employee.salaryDetails?.otherAllowances,
          ).replace(/[^0-9]/g, "")
        : "",
    pfDeduction:
      (employee.pfDeduction ?? employee.salaryDetails?.pfDeduction) != null
        ? String(
            employee.pfDeduction ?? employee.salaryDetails?.pfDeduction,
          ).replace(/[^0-9]/g, "")
        : "",
    taxDeduction:
      (employee.taxDeduction ?? employee.salaryDetails?.taxDeduction) != null
        ? String(
            employee.taxDeduction ?? employee.salaryDetails?.taxDeduction,
          ).replace(/[^0-9]/g, "")
        : "",
    status: employee.status || (employee.isActive ? "Active" : "Inactive"),
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
    documents: employee.documents || [],
  });

  useEffect(() => {
    if (!fetchId) return;
    if (fetchedEmployeeLoading) return;
    if (fetchedEmployeeError) {
      showError(
        fetchedEmployeeError?.message || "Failed to load employee details",
      );
      setFetchId(null);
      setFetchMode(null);
      return;
    }

    const payload = fetchedEmployeeRaw?.data ?? fetchedEmployeeRaw;
    const employee = normalizeEmployeeDetail(payload);

    if (fetchMode === "view") {
      setViewData(employee);
      setShowViewModal(true);
    } else if (fetchMode === "edit") {
      setFormData(mapEmployeeToForm(employee));
      setEditId(employee.id);
      setIsEditing(true);
      setView("form");
    }

    setFetchId(null);
    setFetchMode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchedEmployeeRaw,
    fetchedEmployeeError,
    fetchedEmployeeLoading,
    fetchId,
    fetchMode,
  ]);

  const handleView = (employeeOrId) => {
    if (typeof employeeOrId === "string") {
      setFetchMode("view");
      setFetchId(employeeOrId);
      return;
    }

    setViewData(employeeOrId);
    setShowViewModal(true);
  };

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
    setPresentationForm((prev) => ({ ...prev, attachments: file }));
  };

  const handlePageAccessChange = (employeeId, pageId, checked) => {
    setEmployeePageAccess((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], [pageId]: checked },
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

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsEditing(false);
    setEditId(null);
    setView("list");
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData(INITIAL_FORM_STATE);
    setView("form");
  };

  const handleEdit = (employeeOrId) => {
    if (typeof employeeOrId === "string") {
      setFetchMode("edit");
      setFetchId(employeeOrId);
      return;
    }

    setFormData(mapEmployeeToForm(employeeOrId));
    setEditId(employeeOrId.id);
    setIsEditing(true);
    setView("form");
  };

  const handleEmployeeFormSuccess = async (payload, extras = {}) => {
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
      ...extras,
      role: "EMPLOYEE",
      employeeRoleId: defaultEmployeeRoleId,
    };

    try {
      if (isEditing && editId) {
        const updatePayload = { ...commonPayload };
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
          >
            Cancel & View List
          </Button>
        )}
      </div>

      {view === "list" && (
        <EmployeeAddTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          employees={filteredEmployees}
          presentations={presentations}
          onPermission={handlePresentationClick}
          onView={handleView}
          onEdit={handleEdit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          employeesLoading={employeesLoading}
          employeesFetching={employeesFetching}
          rowsPerPage={rowsPerPage}
        />
      )}

      {view === "form" && (
        <div className="bg-white rounded-2xl shadow-sm border-none  overflow-hidden animate-in fade-in duration-300">
          <AddEmployeeForm
            initialFormState={isEditing ? formData : undefined}
            isEditing={isEditing}
            editId={editId}
            onCancel={resetForm}
            onSuccess={handleEmployeeFormSuccess}
          />
        </div>
      )}
    </div>
  );
}
