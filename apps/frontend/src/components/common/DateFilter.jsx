import React from "react";
import FilterDropdown from "../ui/FilterDropdown";

const OPTIONS = [
  { label: "All", value: "" },
  { label: "Today", value: "TODAY" },
  { label: "This Week", value: "WEEK" },
  { label: "This Month", value: "MONTH" },
  { label: "Last 3 Months", value: "LAST_3_MONTHS" },
  { label: "Last 6 Months", value: "LAST_6_MONTHS" },
  { label: "This Year", value: "YEAR" },
];

export default function DateFilter({
  value = "ALL",
  onChange = () => {},
  className = "",
}) {
  // Show placeholder when parent value is 'ALL' by mapping to empty-string
  const displayValue = value === "ALL" ? "" : value;

  const handleChange = (v) => {
    onChange(v === "" ? "ALL" : v);
  };

  return (
    <div className={className}>
      <FilterDropdown
        value={displayValue}
        onChange={handleChange}
        options={OPTIONS}
        placeholder="Filter by Date"
      />
    </div>
  );
}
