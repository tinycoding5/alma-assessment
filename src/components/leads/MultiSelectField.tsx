import React from "react";
import { MultiSelectFieldProps } from "@/types";

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  error,
}) => {
  const handleChange = (option: string) => {
    let newValues: string[];

    if (selectedValues.includes(option)) {
      newValues = selectedValues.filter((val) => val !== option);
    } else {
      newValues = [...selectedValues, option];
    }

    onChange(newValues);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={`option-${option}`}
              checked={selectedValues.includes(option)}
              onChange={() => handleChange(option)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor={`option-${option}`}
              className="ml-2 text-sm text-gray-700"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
