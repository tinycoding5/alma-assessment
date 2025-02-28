export interface FileData {
  name: string;
  path: string;
}

export type VisaCategory = "EB-1A" | "EB-2 NIW" | "O-1" | "I don't know";

export enum LeadStatus {
  PENDING = "PENDING",
  REACHED_OUT = "REACHED_OUT",
}

export interface Lead {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedinProfile: string;
  visasOfInterest: string[];
  additionalInfo?: string;
  resume?: FileData;
  status: LeadStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadFormData {
  main?: {
    firstName: string;
    lastName: string;
    email: string;
    linkedinProfile: string;
    country: string;
  };
  visasOfInterest?: { [key: string]: boolean };
  additionalInfo?: {
    additionalInfo?: string;
  };
}
