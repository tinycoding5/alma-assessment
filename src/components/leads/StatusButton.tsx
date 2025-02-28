"use client";

import { Lead, LeadStatus } from "@/types";
import { useState } from "react";

interface StatusButtonProps {
  lead: Lead;
  onStatusChange: (lead: Lead) => void;
}

export default function StatusButton({
  lead,
  onStatusChange,
}: StatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async () => {
    if (isLoading || lead.status !== "PENDING") return;

    setIsLoading(true);
    try {
      const newStatus: LeadStatus = LeadStatus.REACHED_OUT;
      const res = await fetch(`/api/leads/${lead.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedLead = { ...lead, status: newStatus };
        onStatusChange(updatedLead);
      } else {
        console.error("Failed to update lead status");
      }
    } catch (error) {
      console.error("Failed to update lead status", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (lead.status === "REACHED_OUT") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
        Reached Out
      </span>
    );
  }

  return (
    <button
      onClick={handleStatusChange}
      disabled={isLoading}
      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200"
    >
      {isLoading ? "Updating..." : "Pending"}
    </button>
  );
}
