"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";

export interface MultiSelectOption {
  id: string | number;
  name: string;
}

export interface SelectedOption {
  id: string | number;
  value: string;
}

interface MultiSelectDropdownProps {
  label?: string;
  options: MultiSelectOption[];
  selectedOptions: SelectedOption[];
  onChange: (selectedOptions: SelectedOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  showAnyOption?: boolean;
  searchPlaceholder?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options = [],
  selectedOptions = [],
  onChange,
  placeholder = "Select options...",
  disabled = false,
  showAnyOption = false,
  searchPlaceholder = "Search...",
  className = "",
  error = false,
  errorMessage = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const ANY_OPTION_ID = "__any__";

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOptionSelected = (optionId: string | number) =>
    selectedOptions.some((sel) => sel.id === optionId);

  const isAnySelected = selectedOptions.some((sel) => sel.id === ANY_OPTION_ID);

  const handleOptionSelect = (option: MultiSelectOption) => {
    if (isAnySelected) return;
    const isSelected = isOptionSelected(option.id);
    const newSelected = isSelected
      ? selectedOptions.filter((sel) => sel.id !== option.id)
      : [...selectedOptions, { id: option.id, value: option.name }];
    onChange(newSelected);
  };

  const handleAnySelect = () => {
    if (isAnySelected) {
      onChange(selectedOptions.filter((sel) => sel.id !== ANY_OPTION_ID));
    } else {
      onChange([{ id: ANY_OPTION_ID, value: "Any" }]);
    }
  };

  const handleRemoveOption = (id: string | number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange(selectedOptions.filter((sel) => sel.id !== id));
  };

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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-dark">
          {label}
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
            disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : "bg-white"
          } ${
            error
              ? "border-red-500 ring-1 ring-red-500"
              : isOpen
                ? "border-violet-500 ring-1 ring-violet-500"
                : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.id}
                  className="inline-flex items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                >
                  {option.value}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveOption(option.id, e)}
                    className="rounded-full p-0.5 hover:bg-indigo-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            <div className="border-b border-gray-200 p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white py-1.5 pl-8 pr-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnySelected}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      isAnySelected
                        ? "cursor-not-allowed opacity-40"
                        : isOptionSelected(option.id)
                          ? "bg-indigo-50 hover:bg-indigo-50"
                          : "hover:bg-indigo-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isOptionSelected(option.id)}
                      onChange={() => {}}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300"
                    />
                    <span>{option.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">No options found</div>
              )}

              {showAnyOption && (
                <>
                  {options.length > 0 && <div className="border-t border-gray-200" />}
                  <button
                    type="button"
                    onClick={handleAnySelect}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-indigo-50 ${
                      isAnySelected ? "bg-indigo-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAnySelected}
                      onChange={() => {}}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300"
                    />
                    <span className="font-medium text-indigo-700">Any</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
