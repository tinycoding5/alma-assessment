"use client";
import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonSchema7 } from "@jsonforms/core";
import { ConfirmationMessage } from "./ConfirmationMessage";
import { FileUpload } from "../common/FileUpload";
import { Button } from "../common/Button";
import { JsonFormsChangeEvent, Lead, LeadFormData, LeadStatus } from "@/types";

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<LeadFormData>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schema: JsonSchema7 = {
    type: "object",
    properties: {
      main: {
        type: "object",
        title: "test",
        properties: {
          firstName: { type: "string", title: "First Name" },
          lastName: { type: "string", title: "Last Name" },
          email: {
            type: "string",
            title: "Email",
            format: "email",
          },
          linkedinProfile: {
            type: "string",
            title: "LinkedIn Profile",
          },
          country: {
            type: "string",
            title: "Country",
            enum: ["Canada", "United Kingdom", "United States"],
          },
        },
        required: [
          "firstName",
          "lastName",
          "email",
          "linkedinProfile",
          "cuontry",
        ],
      },
      visasOfInterest: {
        type: "object",
        title: "Visa categories of interest?",
        properties: {
          "EB-1A": {
            type: "boolean",
          },
          "EB-2 NIW": {
            type: "boolean",
          },
          "O-1": {
            type: "boolean",
          },
          "I don't know": {
            type: "boolean",
          },
        },
      },
      additionalInfo: {
        type: "object",
        title: "How can we help you?",
        properties: {
          additionalInfo: {
            type: "string",
          },
        },
      },
    },
    required: [
      "firstName",
      "lastName",
      "email",
      "cuontry",
      "linkedinProfile",
      "visasOfInterest",
    ],
  };

  const uiSchema = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Group",
        elements: [
          {
            type: "Control",
            scope: "#/properties/main/properties/firstName",
            options: {
              classNames: ["mb-4"],
            },
          },
          {
            type: "Control",
            scope: "#/properties/main/properties/lastName",
            options: {
              classNames: ["mb-4"],
            },
          },
          {
            type: "Control",
            scope: "#/properties/main/properties/email",
            options: {
              classNames: ["mb-4"],
            },
          },
          {
            type: "Control",
            scope: "#/properties/main/properties/country",
            options: {
              classNames: ["mb-4"],
            },
          },
          {
            type: "Control",
            scope: "#/properties/main/properties/linkedinProfile",
            options: {
              classNames: ["mb-4"],
            },
          },
        ],
      },
      {
        type: "Control",
        scope: "#/properties/visasOfInterest",
        options: {
          format: "checkbox",
          classNames: ["mb-4"],
          enum: ["EB-1A", "EB-2 NIW", "O-1", "I don't know"],
        },
      },
      {
        type: "Control",
        scope: "#/properties/additionalInfo",
        options: {
          multi: true,
          classNames: ["mb-4"],
        },
      },
    ],
  };

  const validate = (newFormData: Lead): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newFormData.firstName) newErrors.firstName = "First name is required";
    if (!newFormData.lastName) newErrors.lastName = "Last name is required";
    if (!newFormData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newFormData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!newFormData.linkedinProfile)
      newErrors.linkedinProfile = "LinkedIn profile is required";
    if (
      !newFormData.visasOfInterest ||
      Object.keys(newFormData.visasOfInterest).length === 0
    ) {
      newErrors.visasOfInterest = "Please select at least one visa category";
    }
    if (!file) newErrors.resume = "Please upload your resume";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFormData: Lead = {
      firstName: formData.main?.firstName ?? "",
      lastName: formData.main?.lastName ?? "",
      email: formData.main?.email ?? "",
      linkedinProfile: formData.main?.linkedinProfile ?? "",
      country: formData.main?.country ?? "",
      visasOfInterest: formData.visasOfInterest
        ? Object.keys(formData.visasOfInterest).filter(
            (key: string) => formData.visasOfInterest?.[key]
          )
        : [],
      additionalInfo: formData.additionalInfo?.additionalInfo ?? "",
      status: LeadStatus.PENDING,
    };

    if (!validate(newFormData)) return;

    try {
      // Create FormData object to handle file upload
      const submitData = new FormData();

      // Append form data
      Object.entries(newFormData).forEach(([key, value]) => {
        if (key === "visasOfInterest" && Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          submitData.append(key, String(value));
        }
      });

      // Append file
      if (file) {
        submitData.append("resume", file);
      }

      // Submit form data
      const response = await fetch("/api/leads", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle submission error
    }
  };

  const handleFileChange = (uploadedFile: File | null) => {
    setFile(uploadedFile);
    if (errors.resume) {
      setErrors((prev) => ({
        ...prev,
        resume: "",
      }));
    }
  };

  const handleChange = ({ data }: JsonFormsChangeEvent) => {
    setFormData(data);

    // Clear errors for fields that now have values
    const newErrors = { ...errors };
    Object.entries(data).forEach(([key, value]) => {
      if (value && newErrors[key]) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  if (isSubmitted) {
    return <ConfirmationMessage />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#EAEFD7] p-8 rounded-lg mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            Get An Assessment
          </h1>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">
            Of Your Immigration Case
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-600 text-center">
            Want to understand your visa options?
          </h3>
          <p className="text-sm text-gray-600 text-center">
            Submit the form below and our team of experienced attorneys will
            quickly evaluate and inform you about the best immigration pathway
            based on your case details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <JsonForms
            schema={schema}
            uischema={uiSchema}
            data={formData}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={handleChange}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume/CV Upload
            </label>
            <FileUpload
              onFileChange={handleFileChange}
              error={errors.resume}
              accept=".pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024} // 10MB
            />
            {errors.resume && (
              <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
