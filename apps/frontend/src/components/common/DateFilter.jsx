import React from "react";
import FilterDropdown from "../ui/FilterDropdown";

const OPTIONS = [
  { label: "All", value: "ALL" },
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
  return (
    <div className={className}>
      <FilterDropdown
        value={value}
        onChange={onChange}
        options={OPTIONS}
        placeholder="Filter by Date"
      />
    </div>
  );
}
