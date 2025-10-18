"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DashboardWrapper({ children }) {
  const searchParams = useSearchParams();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "access_denied") {
      setShowAccessDenied(true);
      // Auto-hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowAccessDenied(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <>
      {showAccessDenied && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg border border-red-400">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Access Denied</h4>
                <p className="text-sm mt-1 opacity-90">
                  You don&apos;t have admin privileges to access that page.
                </p>
              </div>
              <button
                onClick={() => setShowAccessDenied(false)}
                className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
