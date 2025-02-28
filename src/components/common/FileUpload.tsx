'use client'
import React, { useRef, useState } from "react";
import { FileUploadProps } from "@/types";

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  error,
  accept = ".pdf,.doc,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [sizeError, setSizeError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSizeError("");

    if (file) {
      if (file.size > maxSize) {
        setSizeError(
          `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`
        );
        setFileName("");
        onFileChange(null);
        return;
      }

      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName("");
      onFileChange(null);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 ${
          error || sizeError ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            {fileName ? fileName : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, DOC, DOCX up to 10MB
          </p>
        </div>
      </div>
      {sizeError && <p className="mt-1 text-sm text-red-600">{sizeError}</p>}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept={accept}
      />
    </div>
  );
};
