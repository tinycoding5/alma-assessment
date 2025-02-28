import Link from "next/link";
import React from "react";

export const ConfirmationMessage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <svg
          className="w-16 h-16 text-green-500 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">Thank You</h2>
      <p className="text-gray-600 mb-6">
        Your information was submitted to our team of immigration attorneys.
        Expect an email from help@example.ai.
      </p>
      <Link
        href="/"
        className="inline-block bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition"
      >
        Go back to homepage
      </Link>
    </div>
  );
};
