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

  // Single select handler
  const handleSingleSelect = (option: DropdownOption) => {
    if (!multiple) {
      (props as SingleSelectProps).onChange(option.value);
      setIsOpen(false);
    }
  };

  // Multi select handler
  const handleMultiSelect = (option: DropdownOption) => {
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      const currentValues = multiProps.value || [];
      const isSelected = currentValues.includes(option.value);
      let newValue: (string | number)[];

      if (isSelected) {
        // Remove from selection
        newValue = currentValues.filter((v) => v !== option.value);
      } else {
        // Add to selection (check max limit)
        if (
          multiProps.maxSelections &&
          currentValues.length >= multiProps.maxSelections
        ) {
          return; // Don't add if max selections reached
        }
        newValue = [...currentValues, option.value];
      }

      multiProps.onChange(newValue);
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (multiple) {
      handleMultiSelect(option);
    } else {
      handleSingleSelect(option);
    }
  };

  const handleSelectAll = () => {
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      const currentValues = multiProps.value || [];

      if (currentValues.length === options.length) {
        // Deselect all
        multiProps.onChange([]);
      } else {
        // Select all (respecting max selections)
        const allValues = options.map((opt) => opt.value);
        const limitedValues = multiProps.maxSelections
          ? allValues.slice(0, multiProps.maxSelections)
          : allValues;
        multiProps.onChange(limitedValues);
      }
    }
  };

  const removeSelection = (
    valueToRemove: string | number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      const currentValues = multiProps.value || [];
      const newValue = currentValues.filter((v) => v !== valueToRemove);
      multiProps.onChange(newValue);
    }
  };

  // Clear all selections
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      multiProps.onChange([]);
    } else {
      const singleProps = props as SingleSelectProps;
      singleProps.onChange("");
    }
    
    // Call the custom onClear function if provided
    if (onClear) {
      onClear();
    }
  };

  // Get selected values based on mode
  const getSelectedData = () => {
    if (multiple) {
      const multiProps = props as MultiSelectProps;
      const currentValues = multiProps.value || [];
      return {
        selectedOptions: options.filter((opt) =>
          currentValues.includes(opt.value),
        ),
        selectedValues: currentValues,
        isAllSelected:
          currentValues.length === options.length && options.length > 0,
      };
    } else {
      const singleProps = props as SingleSelectProps;
      const selectedOption = options.find(
        (opt) => opt.value === singleProps.value,
      );
      return {
        selectedOption,
        selectedOptions: selectedOption ? [selectedOption] : [],
        selectedValues: selectedOption ? [selectedOption.value] : [],
        isAllSelected: false,
      };
    }
  };

  const { selectedOption, selectedOptions, selectedValues, isAllSelected } =
    getSelectedData();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <button
                type="button"
                onClick={(e) => removeSelection(option.value, e)}
                className="rounded-full p-0.5 hover:bg-indigo-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      );
    } else {
      // Single select display
      return (
        <span
          className={`block truncate text-[14px] ${
            !selectedOption ? "text-gray-500" : "text-gray-900"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      );
    }
  };

  const isOptionSelected = (optionValue: string | number) => {
    return selectedValues.includes(optionValue);
  };

  const isOptionDisabled = (optionValue: string | number) => {
    if (!multiple) return false;

    const multiProps = props as MultiSelectProps;
    const currentValues = multiProps.value || [];
    const isSelected = currentValues.includes(optionValue);

    return (
      !isSelected &&
      multiProps.maxSelections &&
      currentValues.length >= multiProps.maxSelections
    );
  };

  const showSelectAll = multiple && (props as MultiSelectProps).showSelectAll;
  const maxSelections = multiple
    ? (props as MultiSelectProps).maxSelections
    : undefined;

  // Check if clear button should be shown
  const shouldShowClearButton = showClearButton && !disabled && (
    (multiple && selectedValues.length > 0) ||
    (!multiple && selectedOption)
  );

  return (
    <div className={`${width} ${className}`} ref={dropdownRef}>
      {/* label of Dropdown */}
      {label && (
        <label className="block text-sm font-medium text-dark pb-1">{label}</label>
      )}

      <div className="relative pt-1">
        <button
          type="button"
          disabled={disabled}
          className={`relative flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-1 ${
            multiple ? "min-h-[38px]" : ""
          } ${
            disabled
              ? "cursor-not-allowed border-gray-200 bg-gray-100"
              : error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-violet-500 focus:ring-violet-500"
          }`}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className={multiple ? "min-w-0 flex-1" : "flex-1"}>
            {renderSelectedValues()}
          </div>
          
          <div className="flex items-center gap-1">
            {shouldShowClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full p-0.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 transform" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ul tabIndex={-1} role="listbox">
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
                      isDisabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-indigo-100"
                    } ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-900"
                        : "text-gray-900"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => !isDisabled && handleSelect(option)}
                  >
                    <span className="block truncate font-medium">
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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