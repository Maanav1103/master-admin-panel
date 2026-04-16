import { DropdownOption } from "../types";

export const stautsDropdownOptions: DropdownOption[] = [
  // { value: "all", label: "All" },
  { value: "A", label: "Active" },
  { value: "D", label: "Inactive" },
];

export const reportStautsDropdownOptions: DropdownOption[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "solved", label: "Solved" },
  { value: "blocked", label: "Blocked" },
];

export const paginationDropdownOptions: DropdownOption[] = [
  { value: 15, label: "15" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
];

export const genderDropdownOptions: DropdownOption[] = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  // { value: "O", label: "Other" },
];

export const badgeTypeDropdown: DropdownOption[] = [
  { value: "points_based", label: "Points based" },
  { value: "custom", label: "Manual Badge" },
];

export const badgeSubTypeDropdown: DropdownOption[] = [
  { value: "total_points", label: "Total points based" },
  { value: "stats_points", label: "Category points based" },
];

export const statusDropdown = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];
