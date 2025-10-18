"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Client-side authorization check to prevent UI flashing
  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (status === "unauthenticated") {
      console.log(
        "🔐 Client-side: User not authenticated, redirecting to login"
      );
      router.push("/api/auth/signin");
      return;
    }

    if (session && !session.user?.isAdmin) {
      console.log("🚫 Client-side: User not admin, redirecting to dashboard", {
        email: session.user?.email,
        isAdmin: session.user?.isAdmin,
      });
      router.push("/dashboard?message=access_denied");
      return;
    }

    if (session?.user?.isAdmin) {
      console.log("✅ Client-side: Admin access confirmed", {
        email: session.user?.email,
        isAdmin: session.user?.isAdmin,
      });
      setIsAuthorized(true);
    }
  }, [session, status, router]);

  const handleSeed = async () => {
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/bulletins/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to seed data");
      }

      if (data.success) {
        setMessage(data.message || "Sample verileri başarıyla yüklendi!");
        setMessageType("success");
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      setMessage(error.message || "Veri yükleme sırasında bir hata oluştu");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  // Show loading state while checking authorization
  if (status === "loading" || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">
            {status === "loading" ? "Loading..." : "Checking authorization..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">FinAl Analytics yönetim paneli</p>
        </div>

        {/* Admin Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Veri Yönetimi
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                Sample Veriler
              </h3>
              <p className="text-gray-400 mb-4">
                Veritabanına örnek bulletin verilerini yüklemek için aşağıdaki
                butonu kullanın. Bu işlem mevcut verileri temizleyip yeni sample
                verilerle değiştirecektir.
              </p>

              <button
                onClick={handleSeed}
                disabled={isLoading}
                className={`
                  ${
                    isLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 active:bg-green-700"
                  } 
                  text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                  disabled:opacity-50
                `}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Yükleniyor...</span>
                  </div>
                ) : (
                  "Sample Verileri Yükle"
                )}
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`
                p-4 rounded-lg border-l-4 
                ${
                  messageType === "success"
                    ? "bg-green-900/30 border-green-500 text-green-200"
                    : "bg-red-900/30 border-red-500 text-red-200"
                }
              `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      {messageType === "success" ? (
                        <svg
                          className="w-5 h-5 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-red-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {messageType === "success" ? "Başarılı!" : "Hata!"}
                      </p>
                      <p className="text-sm mt-1">{message}</p>
                    </div>
                  </div>
                  <button
                    onClick={clearMessage}
                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-white transition-colors"
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
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Sistem Bilgileri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">
                API Endpoints
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>
                  •{" "}
                  <code className="bg-gray-600 px-2 py-1 rounded">
                    /api/bulletins
                  </code>{" "}
                  - Bulletin listesi
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-600 px-2 py-1 rounded">
                    /api/channels
                  </code>{" "}
                  - Kanal listesi
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-600 px-2 py-1 rounded">
                    /api/bulletins/seed
                  </code>{" "}
                  - Sample veri yükleme
                </li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">
                Veritabanı
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• MongoDB Atlas</li>
                <li>• Bulletin Collection</li>
                <li>• Timestamp Support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-200">Uyarı</h4>
              <p className="text-sm text-yellow-200/80 mt-1">
                Sample verileri yükleme işlemi mevcut tüm bulletin verilerini
                siler ve yeni örnek verilerle değiştirir. Bu işlem geri
                alınamaz, dikkatli kullanın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
