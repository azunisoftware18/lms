import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Eye,
  FileText,
  ListChecks,
  RotateCcw,
  User,
} from "lucide-react";
import ActionMenu from "../../../components/common/ActionMenu";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import StatusCard from "../../../components/common/StatusCard";
import InfoCard from "../../../components/details/InfoCard";
import InfoItem from "../../../components/details/InfoItem";
import StatusOverviewCard from "../../../components/details/StatusOverviewCard";
import TabsNav from "../../../components/details/TabsNav";
import Button from "../../../components/ui/Button";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import InputField from "../../../components/ui/InputField";
import SearchField from "../../../components/ui/SearchField";
import SelectField from "../../../components/ui/SelectField";
import TextAreaField from "../../../components/ui/TextAreaField";
import ToastCard from "../../../components/ui/ToastCard";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import {
  ADMIN_PRESENTATION_AVAILABLE_PAGES,
  ADMIN_PRESENTATION_PRIORITY_OPTIONS,
} from "../../../lib/ReportsDummyData";
import { colorVariables } from "../../../lib/index";

export default function AdminPresentationPage() {
  const [presentation, setPresentation] = useState({
    title: "",
    description: "",
    employee: "",
    deadline: "",
    priority: "Medium",
    pages: {},
  });
  const [activeTab, setActiveTab] = useState("Basic Info");
  const [pageSearch, setPageSearch] = useState("");
  const [pageFilter, setPageFilter] = useState("all");
  const [requireRemark, setRequireRemark] = useState(false);
  const [dialogState, setDialogState] = useState({ open: false });
  const [toastState, setToastState] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const PAGE_FILTER_OPTIONS = [
    { value: "all", label: "All Pages" },
    { value: "selected", label: "Selected Pages" },
    { value: "unselected", label: "Unselected Pages" },
  ];

  const selectedPageCount = Object.values(presentation.pages).filter(
    Boolean,
  ).length;
  const completionCount = [
    presentation.title,
    presentation.employee,
    presentation.deadline,
    presentation.description,
  ].filter(Boolean).length;

  const filteredPages = useMemo(() => {
    return ADMIN_PRESENTATION_AVAILABLE_PAGES.filter((page) => {
      const searchMatch = page.label
        .toLowerCase()
        .includes(pageSearch.toLowerCase());
      const isSelected = !!presentation.pages[page.id];

      if (pageFilter === "selected") return searchMatch && isSelected;
      if (pageFilter === "unselected") return searchMatch && !isSelected;
      return searchMatch;
    });
  }, [pageSearch, pageFilter, presentation.pages]);

  // checkbox handle
  const handlePageToggle = (pageId) => {
    setPresentation((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageId]: prev.pages[pageId] ? null : { heading: "", content: "" },
      },
    }));
  };

  // page content handle
  const handlePageChange = (pageId, field, value) => {
    setPresentation((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageId]: {
          ...prev.pages[pageId],
          [field]: value,
        },
      },
    }));
  };

  const handleResetPageContent = (pageId) => {
    if (!presentation.pages[pageId]) return;
    handlePageChange(pageId, "heading", "");
    handlePageChange(pageId, "content", "");
  };

  const handleSubmit = (remark = "") => {
    console.log("Presentation Data:", { ...presentation, remark });
    setToastState({
      isOpen: true,
      type: "success",
      title: "Presentation Assigned",
      message: "Presentation assigned successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`bg-linear-to-r from-blue-600 to-indigo-600 p-2 rounded-xl ${colorVariables.BORDER_COLOR}`}
            >
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Create Presentation
              </h1>
              <p className="text-gray-600 mt-1">
                Assign structured presentation content to employees
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatusCard
            title="Total Pages"
            value={ADMIN_PRESENTATION_AVAILABLE_PAGES.length}
            icon={ListChecks}
            variant="blue"
            subtext="Template pages"
          />
          <StatusCard
            title="Selected"
            value={selectedPageCount}
            icon={CheckCircle}
            variant="green"
            subtext="Included in assignment"
          />
          <StatusCard
            title="Form Progress"
            value={`${completionCount}/4`}
            icon={FileText}
            variant="purple"
            subtext="Core fields completed"
          />
          <StatusCard
            title="Priority"
            value={presentation.priority}
            icon={AlertTriangle}
            variant="orange"
            subtext="Current urgency"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <TabsNav
            tabs={["Basic Info", "Pages", "Preview"]}
            active={activeTab}
            setActive={setActiveTab}
          />

          {activeTab === "Basic Info" && (
            <InfoCard title="Basic Information" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InputField
                  label="Presentation Title"
                  placeholder="Enter presentation title"
                  icon={FileText}
                  value={presentation.title}
                  onChange={(e) =>
                    setPresentation({ ...presentation, title: e.target.value })
                  }
                />
                <InputField
                  label="Assign To"
                  placeholder="Employee name"
                  icon={User}
                  value={presentation.employee}
                  onChange={(e) =>
                    setPresentation({
                      ...presentation,
                      employee: e.target.value,
                    })
                  }
                />
                <InputField
                  label="Deadline"
                  type="date"
                  icon={Calendar}
                  value={presentation.deadline}
                  onChange={(e) =>
                    setPresentation({
                      ...presentation,
                      deadline: e.target.value,
                    })
                  }
                />
                <SelectField
                  label="Priority"
                  value={presentation.priority}
                  onChange={(value) =>
                    setPresentation({ ...presentation, priority: value })
                  }
                  options={ADMIN_PRESENTATION_PRIORITY_OPTIONS.map(
                    (priority) => ({
                      label: priority,
                      value: priority,
                    }),
                  )}
                  placeholder="Select priority"
                />
              </div>

              <TextAreaField
                label="Overall Instructions"
                placeholder="Enter instructions for the employee"
                rows={4}
                value={presentation.description}
                onChange={(e) =>
                  setPresentation({
                    ...presentation,
                    description: e.target.value,
                  })
                }
              />

              <div className="mt-4 flex justify-end">
                <ToggleSwitch
                  checked={requireRemark}
                  onChange={setRequireRemark}
                  label="Require remark before submission"
                  size="sm"
                />
              </div>
            </InfoCard>
          )}

          {activeTab === "Pages" && (
            <>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <SearchField
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  onClear={() => setPageSearch("")}
                  placeholder="Search page by name"
                  showResults={false}
                />
                <FilterDropdown
                  value={pageFilter}
                  onChange={setPageFilter}
                  options={PAGE_FILTER_OPTIONS}
                  placeholder="Filter pages"
                />
              </div>

              <div className="space-y-3">
                {filteredPages.map((page) => (
                  <InfoCard key={page.id} title={page.label} icon={FileText}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <label className="flex items-center gap-3 font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={!!presentation.pages[page.id]}
                          onChange={() => handlePageToggle(page.id)}
                        />
                        Include this page
                      </label>

                      <ActionMenu
                        actions={[
                          {
                            label: presentation.pages[page.id]
                              ? "Remove from Presentation"
                              : "Add to Presentation",
                            icon: <CheckCircle />,
                            onClick: () => handlePageToggle(page.id),
                          },
                          {
                            label: "Reset Content",
                            icon: <RotateCcw />,
                            onClick: () => handleResetPageContent(page.id),
                            disabled: !presentation.pages[page.id],
                          },
                        ]}
                      />
                    </div>

                    {presentation.pages[page.id] && (
                      <div className="space-y-3">
                        <InputField
                          label="Page Heading"
                          placeholder={`${page.label} heading`}
                          value={presentation.pages[page.id]?.heading || ""}
                          onChange={(e) =>
                            handlePageChange(page.id, "heading", e.target.value)
                          }
                        />
                        <TextAreaField
                          label="Page Content"
                          placeholder={`${page.label} content`}
                          rows={4}
                          value={presentation.pages[page.id]?.content || ""}
                          onChange={(e) =>
                            handlePageChange(page.id, "content", e.target.value)
                          }
                        />
                      </div>
                    )}
                  </InfoCard>
                ))}
              </div>
            </>
          )}

          {activeTab === "Preview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InfoCard title="Assignment Summary" icon={Eye}>
                <div className="space-y-3">
                  <InfoItem label="Title" value={presentation.title} copyable />
                  <InfoItem
                    label="Assigned To"
                    value={presentation.employee}
                    copyable
                  />
                  <InfoItem label="Deadline" value={presentation.deadline} />
                  <InfoItem label="Priority" value={presentation.priority} />
                </div>
              </InfoCard>

              <StatusOverviewCard
                items={[
                  {
                    label: "Total Template Pages",
                    value: ADMIN_PRESENTATION_AVAILABLE_PAGES.length,
                  },
                  { label: "Selected Pages", value: selectedPageCount },
                  { label: "Progress", value: `${completionCount}/4` },
                  {
                    label: "Remark Required",
                    value: requireRemark ? "Yes" : "No",
                  },
                ]}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertTriangle size={16} className="text-amber-500" />
            Review selected pages before assigning.
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              onClick={() =>
                setPresentation({
                  title: "",
                  description: "",
                  employee: "",
                  deadline: "",
                  priority: "Medium",
                  pages: {},
                })
              }
            >
              <span className="text-blue-600 font-semibold">Reset Form</span>
            </Button>
            <Button
              onClick={() => setDialogState({ open: true })}
              className={colorVariables.PRIMARY_BUTTON_COLOR}
            >
              Assign Presentation
            </Button>
          </div>
        </div>

        <ConfirmationDialog
          open={dialogState.open}
          title="Assign Presentation"
          description="Do you want to assign this presentation to the selected employee?"
          confirmText="Assign"
          onConfirm={(remark) => {
            setDialogState({ open: false });
            handleSubmit(remark);
          }}
          onCancel={() => setDialogState({ open: false })}
          showRemark={requireRemark}
          variant="info"
          isPopup
        />

        <ToastCard
          isOpen={toastState.isOpen}
          onClose={() => setToastState((prev) => ({ ...prev, isOpen: false }))}
          type={toastState.type}
          title={toastState.title}
          message={toastState.message}
          showDeliveryTime={false}
          buttonText="OK"
          onButtonClick={() =>
            setToastState((prev) => ({ ...prev, isOpen: false }))
          }
        />
      </div>
    </div>
  );
}
