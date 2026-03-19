import React from "react";
import {
  X,
  Presentation,
  LayoutDashboard,
  Users,
  BarChart,
  Settings,
  Bell,
  MessageSquare,
  CreditCard,
  User,
  ShieldCheck,
  Check,
  Send,
  CalendarDays,
  Clock4,
  FileCheck,
  UploadCloud,
  Trash2,
} from "lucide-react";

const PAGE_ACCESS_OPTIONS = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    description: "Main dashboard with overview",
  },
  {
    id: "customers",
    name: "Customer Management",
    icon: Users,
    description: "View and manage customers",
  },
  {
    id: "loans",
    name: "Loan Processing",
    icon: CreditCard,
    description: "Process and track loans",
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    icon: BarChart,
    description: "Generate and view reports",
  },
  {
    id: "settings",
    name: "System Settings",
    icon: Settings,
    description: "Access system configuration",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    description: "View system notifications",
  },
  {
    id: "messages",
    name: "Messages",
    icon: MessageSquare,
    description: "Internal messaging system",
  },
  {
    id: "profile",
    name: "Employee Profile",
    icon: User,
    description: "View and edit own profile",
  },
  {
    id: "los",
    name: "Los",
    icon: User,
    description: "Manage applications and track turnaround time",
  },
];

export default function EmployeeAccessModal({
  isOpen,
  selectedEmployee,
  presentationForm,
  selectedEmployeePresentations,
  getEmployeePageAccess,
  onClose,
  onSavePageAccess,
  onPageAccessChange,
  onPresentationFormChange,
  onAttachmentChange,
  onAssignPresentation,
  onPresentationStatusChange,
  onDeletePresentation,
  getPriorityColor,
  getStatusColor,
}) {
  if (!isOpen || !selectedEmployee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Presentation size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Manage Employee Access
              </h2>
              <p className="text-sm text-gray-500">
                Managing: {selectedEmployee.fullName} (
                {selectedEmployee.employeeId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} /> Page Access Control
            </h3>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Select which pages this employee can access in the system. This
                controls their navigation menu and available features.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAGE_ACCESS_OPTIONS.map((page) => {
                  const Icon = page.icon;
                  const currentAccess = getEmployeePageAccess(
                    selectedEmployee.employeeId,
                  );
                  const isChecked = currentAccess[page.id] || false;

                  return (
                    <div
                      key={page.id}
                      className={`bg-white rounded-lg border p-4 transition-all ${isChecked ? "border-blue-300 bg-blue-50/50" : "border-gray-200"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <input
                            type="checkbox"
                            id={`page-${page.id}-${selectedEmployee.employeeId}`}
                            checked={isChecked}
                            onChange={(e) =>
                              onPageAccessChange(
                                selectedEmployee.employeeId,
                                page.id,
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`page-${page.id}-${selectedEmployee.employeeId}`}
                            className="flex items-center gap-2 text-sm font-medium text-gray-800 cursor-pointer"
                          >
                            <div className="text-blue-600">
                              <Icon size={16} />
                            </div>
                            {page.name}
                          </label>
                          <p className="text-xs text-gray-500 mt-1 ml-6">
                            {page.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-blue-200">
                <button
                  onClick={onSavePageAccess}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2 transition-all"
                >
                  <Check size={18} /> Save Page Access
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileCheck size={18} /> Task Assignments
            </h3>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Existing Tasks
              </h4>
              {selectedEmployeePresentations.length > 0 ? (
                <div className="space-y-3">
                  {selectedEmployeePresentations.map((presentation) => (
                    <div
                      key={presentation.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {presentation.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {presentation.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={presentation.status}
                            onChange={(e) =>
                              onPresentationStatusChange(
                                presentation.id,
                                e.target.value,
                              )
                            }
                            className="text-xs px-2 py-1 rounded border border-gray-300"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                          <button
                            onClick={() =>
                              onDeletePresentation(presentation.id)
                            }
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getPriorityColor(presentation.priority)}`}
                        >
                          {presentation.priority} Priority
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${getStatusColor(presentation.status)}`}
                        >
                          {presentation.status}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                          <CalendarDays size={12} className="inline mr-1" />
                          Deadline: {presentation.deadline}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                          <Clock4 size={12} className="inline mr-1" />
                          Assigned: {presentation.assignedDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Presentation
                    size={32}
                    className="mx-auto text-gray-400 mb-2"
                  />
                  <p className="text-gray-500">No tasks assigned yet</p>
                </div>
              )}
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Send size={18} /> Assign New Task
              </h4>
              <form onSubmit={onAssignPresentation}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={presentationForm.title}
                      onChange={onPresentationFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Monthly Sales Report"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={presentationForm.priority}
                      onChange={onPresentationFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={presentationForm.description}
                      onChange={onPresentationFormChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed description of the task..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Deadline *
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={presentationForm.deadline}
                      onChange={onPresentationFormChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                      <UploadCloud
                        size={24}
                        className="mx-auto text-gray-400 mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        Click to upload files
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={onAttachmentChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-200 flex items-center gap-2 transition-all"
                  >
                    <Send size={18} /> Assign Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
