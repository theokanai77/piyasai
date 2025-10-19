"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const errorMessages = {
  Configuration:
    "Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.",
  AccessDenied: "Erişim reddedildi. Bu uygulamaya giriş izniniz bulunmuyor.",
  Verification:
    "E-posta doğrulama hatası. Lütfen e-posta adresinizi kontrol edin.",
  Default: "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.",
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-500">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Giriş Hatası
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Giriş yapılırken bir sorun oluştu
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="text-center">
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {errorMessage}
            </div>

            <div className="space-y-4">
              <Link
                href="/api/auth/signin"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Tekrar Giriş Yap
              </Link>

              <Link
                href="/"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Ana Sayfaya Dön
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Sorun devam ederse{" "}
                <a
                  href="mailto:support@piyasai.com"
                  className="text-orange-600 hover:text-orange-500"
                >
                  destek ekibimizle
                </a>{" "}
                iletişime geçin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
