import { ChangeEvent } from "react";
import { JsonSchema7 } from "@jsonforms/core";

export interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
}

export interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  error?: string;
  accept?: string;
  maxSize?: number; // in bytes
}

export interface MultiSelectFieldProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  error?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JsonFormsChangeEvent {
  data: any;
  errors: any[];
}

export interface FormSchema {
  schema: JsonSchema7;
  uiSchema: any;
}
