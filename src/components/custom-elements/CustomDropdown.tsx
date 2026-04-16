import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { DropdownOption } from "@/utils/types";

interface SingleSelectProps {
  multiple?: false;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

interface MultiSelectProps {
  multiple: true;
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  maxSelections?: number;
  showSelectAll?: boolean;
}

type ConditionalProps = SingleSelectProps | MultiSelectProps;

interface BaseDropdownProps {
  label?: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  width?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

type CustomDropdownProps = BaseDropdownProps & ConditionalProps;

const CustomDropdown: React.FC<CustomDropdownProps> = (props) => {
  const {
    label,
    options = [],
    placeholder = "",
    disabled = false,
    width = "w-full",
    error = false,
    errorMessage = "",
    className,
    multiple = false,
    showClearButton = false,
    onClear,
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSingleSelect = (option: DropdownOption) => {
    if (!multiple) {
      (props as SingleSelectProps).onChange(option.value);
      setIsOpen(false);
    }
  };

  const handleMultiSelect = (option: DropdownOption) => {
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      const currentValues = multiProps.value || [];
      const isSelected = currentValues.includes(option.value);
      let newValue: (string | number)[];
      if (isSelected) {
        newValue = currentValues.filter((v) => v !== option.value);
      } else {
        if (multiProps.maxSelections && currentValues.length >= multiProps.maxSelections) return;
        newValue = [...currentValues, option.value];
      }
      multiProps.onChange(newValue);
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (multiple) handleMultiSelect(option);
    else handleSingleSelect(option);
  };

  const handleSelectAll = () => {
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      const currentValues = multiProps.value || [];
      if (currentValues.length === options.length) {
        multiProps.onChange([]);
      } else {
        const allValues = options.map((opt) => opt.value);
        const limitedValues = multiProps.maxSelections ? allValues.slice(0, multiProps.maxSelections) : allValues;
        multiProps.onChange(limitedValues);
      }
    }
  };

  const removeSelection = (valueToRemove: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      const currentValues = multiProps.value || [];
      multiProps.onChange(currentValues.filter((v) => v !== valueToRemove));
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      (props as MultiSelectProps).onChange([]);
    } else {
      (props as SingleSelectProps).onChange("");
    }
    onClear?.();
  };

  const getSelectedData = () => {
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      const currentValues = multiProps.value || [];
      return {
        selectedOptions: options.filter((opt) => currentValues.includes(opt.value)),
        selectedValues: currentValues,
        isAllSelected: currentValues.length === options.length && options.length > 0,
        selectedOption: undefined,
      };
    } else {
      const singleProps = props as SingleSelectProps;
      const selectedOption = options.find((opt) => opt.value === singleProps.value);
      return {
        selectedOption,
        selectedOptions: selectedOption ? [selectedOption] : [],
        selectedValues: selectedOption ? [selectedOption.value] : [],
        isAllSelected: false,
      };
    }
  };

  const { selectedOption, selectedOptions, selectedValues, isAllSelected } = getSelectedData();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showSelectAll = multiple && (props as MultiSelectProps).showSelectAll;
  const maxSelections = multiple ? (props as MultiSelectProps).maxSelections : undefined;
  const shouldShowClearButton = showClearButton && !disabled && (
    (multiple && selectedValues.length > 0) || (!multiple && selectedOption)
  );

  const renderSelectedValues = () => {
    if (multiple) {
      if (selectedOptions.length === 0) {
        return <span className="text-[14px] text-gray-500">{placeholder}</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800"
            >
              {option.label}
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => removeSelection(option.value, e)}
                onKeyDown={(e) => e.key === "Enter" && removeSelection(option.value, e as unknown as React.MouseEvent)}
                className="rounded-full p-0.5 hover:bg-indigo-200 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </span>
            </span>
          ))}
        </div>
      );
    }
    return (
      <span className={`block truncate text-[14px] ${!selectedOption ? "text-gray-500" : "text-gray-900"}`}>
        {selectedOption ? selectedOption.label : placeholder}
      </span>
    );
  };

  const isOptionSelected = (optionValue: string | number) => selectedValues.includes(optionValue);

  const isOptionDisabled = (optionValue: string | number) => {
    if (!multiple) return false;
    const multiProps = props as MultiSelectProps;
    const currentValues = multiProps.value || [];
    const isSelected = currentValues.includes(optionValue);
    return !isSelected && !!multiProps.maxSelections && currentValues.length >= multiProps.maxSelections;
  };

  return (
    <div className={`${width} ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-dark pb-1">{label}</label>
      )}

      <div className="relative pt-1">
        {/* Trigger — div instead of button to avoid nested button issue */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={toggleDropdown}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleDropdown(); }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`relative flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-1 ${
            multiple ? "min-h-[38px]" : ""
          } ${
            disabled
              ? "cursor-not-allowed border-gray-200 bg-gray-100 pointer-events-none"
              : error
                ? "border-red-500 focus:ring-red-500 cursor-pointer"
                : "border-gray-300 focus:border-primary focus:ring-primary cursor-pointer"
          }`}
        >
          <div className={multiple ? "min-w-0 flex-1" : "flex-1"}>
            {renderSelectedValues()}
          </div>

          <div className="flex items-center gap-1">
            {shouldShowClearButton && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
                className="rounded-full p-0.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 transform" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            <ul tabIndex={-1} role="listbox" className="py-1 overflow-auto max-h-60">
              {showSelectAll && options.length > 0 && (
                <li
                  className="relative cursor-pointer select-none border-b border-gray-200 py-2 pl-3 pr-9 hover:bg-gray-100"
                  onClick={handleSelectAll}
                >
                  <span className="block truncate font-medium text-gray-700">
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </span>
                </li>
              )}
              {options.map((option) => {
                const isSelected = isOptionSelected(option.value);
                const isDisabled = isOptionDisabled(option.value);
                return (
                  <li
                    key={option.value}
                    className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                      isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-indigo-100"
                    } ${isSelected ? "bg-indigo-50 text-indigo-900" : "text-gray-900"}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => !isDisabled && handleSelect(option)}
                  >
                    <span className="block truncate font-medium">{option.label}</span>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}

      {multiple && maxSelections && (
        <p className="mt-1 text-xs text-gray-500">
          {selectedValues.length}/{maxSelections} selected
        </p>
      )}
    </div>
  );
};

export default CustomDropdown;
