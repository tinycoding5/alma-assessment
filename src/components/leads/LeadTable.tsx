"use client";

import { useState, useEffect, useMemo } from "react";
import StatusButton from "./StatusButton";
import { Lead, LeadStatus } from "@/types";

export default function LeadTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const response = await res.json();
          setLeads(response.data);
        } else {
          console.error("Failed to fetch leads");
        }
      } catch (error) {
        console.error("Failed to fetch leads", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  const handleStatusChange = (updatedLead: Lead) => {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
  };

  // Calculate pagination
  const currentLeads = useMemo(() => {
    const filteredLeads =
      statusFilter === "ALL"
        ? leads
        : leads.filter((lead) => lead.status === statusFilter);
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
    return {
      currentLeads: currentLeads,
      totalPages: totalPages,
    };
  }, [statusFilter, leads, currentPage]);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="w-64">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 border rounded-md text-black"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as LeadStatus | "ALL")
            }
            className="p-2 border rounded-md text-black"
          >
            <option value="ALL">Status</option>
            <option value="PENDING">Pending</option>
            <option value="REACHED_OUT">Reached Out</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-white border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Name
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Submitted
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Status
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Country
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.currentLeads.map((lead) => (
              <tr
                key={lead.id}
                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {`${lead.firstName} ${lead.lastName}`}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {lead.createdAt}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <StatusButton
                    lead={lead}
                    onStatusChange={handleStatusChange}
                  />
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {lead.country}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <nav className="inline-flex rounded-md shadow">
          {Array.from({ length: currentLeads.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                } text-sm font-medium border`}
              >
                {page}
              </button>
            )
          )}
        </nav>
      </div>
    </div>
  );
}
