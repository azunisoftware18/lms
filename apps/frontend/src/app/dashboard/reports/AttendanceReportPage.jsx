import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Download,
  RefreshCw,
  TrendingUp,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import StatusCard from "../../../components/common/StatusCard";
import TabsNav from "../../../components/details/TabsNav";
import Button from "../../../components/ui/Button";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import InputField from "../../../components/ui/InputField";
import SearchField from "../../../components/ui/SearchField";
import SelectField from "../../../components/ui/SelectField";
import ToastCard from "../../../components/ui/ToastCard";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import {
  ATTENDANCE_REPORT_DUMMY_DATA,
  ATTENDANCE_REPORT_FILTER_OPTIONS,
} from "../../../lib/ReportsDummyData";
import { colorVariables } from "../../../lib/index";

const ITEMS_PER_PAGE = 6;

const getStatusChip = (status) => {
  if (status === "present") return "bg-green-100 text-green-700";
  if (status === "late") return "bg-yellow-100 text-yellow-700";
  if (status === "absent") return "bg-red-100 text-red-700";
  return "bg-blue-100 text-blue-700";
};

const formatStatus = (status) => {
  if (status === "present") return "Present";
  if (status === "late") return "Late";
  if (status === "absent") return "Absent";
  return "On Leave";
};

export default function AttendanceReportPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2026-03-12");
  const [showOvertimeOnly, setShowOvertimeOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastState, setToastState] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const filteredData = useMemo(() => {
    return ATTENDANCE_REPORT_DUMMY_DATA.filter((record) => {
      const searchMatches =
        record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.role.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMatches =
        statusFilter === "all" ? true : record.status === statusFilter;

      const branchMatches =
        branchFilter === "all" ? true : record.branch === branchFilter;

      const dateMatches = selectedDate ? record.date === selectedDate : true;

      const overtimeMatches = showOvertimeOnly
        ? record.overtimeHours > 0
        : true;

      return (
        searchMatches &&
        statusMatches &&
        branchMatches &&
        dateMatches &&
        overtimeMatches
      );
    });
  }, [searchQuery, statusFilter, branchFilter, selectedDate, showOvertimeOnly]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE),
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const attendanceSummary = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter(
      (row) => row.status === "present",
    ).length;
    const late = filteredData.filter((row) => row.status === "late").length;
    const absent = filteredData.filter((row) => row.status === "absent").length;
    const leaves = filteredData.filter((row) => row.status === "leave").length;
    const totalOvertime = filteredData.reduce(
      (sum, row) => sum + row.overtimeHours,
      0,
    );
    const avgWorkHours =
      total > 0
        ? (
            filteredData.reduce((sum, row) => sum + row.workHours, 0) / total
          ).toFixed(1)
        : "0.0";

    const attendanceRate =
      total > 0 ? (((present + late) / total) * 100).toFixed(1) : "0.0";

    return {
      total,
      present,
      late,
      absent,
      leaves,
      totalOvertime: totalOvertime.toFixed(1),
      avgWorkHours,
      attendanceRate,
    };
  }, [filteredData]);

  const handleExport = (type) => {
    setToastState({
      isOpen: true,
      type: "success",
      title: `${type} Ready`,
      message: `Attendance ${type.toLowerCase()} generated successfully.`,
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setBranchFilter("all");
    setSelectedDate("2026-03-12");
    setShowOvertimeOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl">
                <CalendarDays className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Attendance Report
                </h1>
                <p className="text-gray-600 mt-1">
                  Daily attendance, punctuality, and work-hours overview
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={resetFilters}
                className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              >
                <span className="text-blue-800 flex-2 items-center gap-1 inline-flex">
                  <RefreshCw size={16} /> Reset
                </span>
              </Button>
              <Button
                onClick={() => handleExport("Excel")}
                className={colorVariables.PRIMARY_BUTTON_COLOR}
              >
                <Download size={16} /> Export Excel
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3">
              <SearchField
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                placeholder="Search employee, ID, role..."
                showResults={false}
              />

              <FilterDropdown
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={ATTENDANCE_REPORT_FILTER_OPTIONS.status}
                placeholder="Status"
                className="w-full"
              />

              <SelectField
                value={branchFilter}
                onChange={(value) => {
                  setBranchFilter(value);
                  setCurrentPage(1);
                }}
                options={ATTENDANCE_REPORT_FILTER_OPTIONS.branch}
                placeholder="Branch"
                className="w-full"
              />

              <InputField
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                icon={CalendarDays}
              />
            </div>

            <div className="flex justify-end">
              <ToggleSwitch
                checked={showOvertimeOnly}
                onChange={(value) => {
                  setShowOvertimeOnly(value);
                  setCurrentPage(1);
                }}
                label="Overtime only"
                size="sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatusCard
            title="Total Employees"
            value={attendanceSummary.total}
            icon={Users}
            variant="blue"
            subtext="Filtered records"
          />
          <StatusCard
            title="Present"
            value={attendanceSummary.present}
            icon={UserCheck}
            variant="green"
            subtext={`Late: ${attendanceSummary.late}`}
          />
          <StatusCard
            title="Absent"
            value={attendanceSummary.absent}
            icon={UserMinus}
            variant="red"
            subtext={`Leave: ${attendanceSummary.leaves}`}
          />
          <StatusCard
            title="Attendance Rate"
            value={`${attendanceSummary.attendanceRate}%`}
            icon={TrendingUp}
            variant="purple"
            subtext="Present + Late"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <TabsNav
            tabs={["Overview", "Attendance Log"]}
            active={activeTab}
            setActive={setActiveTab}
          />

          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-sm text-slate-500">Average Work Hours</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {attendanceSummary.avgWorkHours} hrs
                </h3>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-sm text-slate-500">Total Overtime</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {attendanceSummary.totalOvertime} hrs
                </h3>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <p className="text-sm text-slate-500">Selected Date</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {selectedDate || "All Dates"}
                </h3>
              </div>
            </div>
          )}

          {activeTab === "Attendance Log" && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-225">
                  <thead className="bg-slate-50 border-y border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                        Employee
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                        Role
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                        Branch
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                        Check In
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                        Check Out
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                        Work Hours
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                        Overtime
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">
                            {row.employeeName}
                          </p>
                          <p className="text-xs text-slate-500">{row.id}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {row.role}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {row.branch}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {row.checkIn}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {row.checkOut}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <div className="inline-flex items-center gap-1">
                            <Clock3 size={14} /> {row.workHours.toFixed(1)}h
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {row.overtimeHours.toFixed(1)}h
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusChip(row.status)}`}
                          >
                            {formatStatus(row.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          No attendance records found for selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>

        <ToastCard
          isOpen={toastState.isOpen}
          onClose={() => setToastState((prev) => ({ ...prev, isOpen: false }))}
          type={toastState.type}
          title={toastState.title}
          message={toastState.message}
          showDeliveryTime={false}
          onButtonClick={() =>
            setToastState((prev) => ({ ...prev, isOpen: false }))
          }
          buttonText="OK"
        />
      </div>
    </div>
  );
}
