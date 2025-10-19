"use client";

import Link from "next/link";

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-500">
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
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            E-posta Gönderildi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Giriş bağlantısı e-posta adresinize gönderildi
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="text-center">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                E-posta kutunuzu kontrol edin ve giriş yapmak için bağlantıya
                tıklayın.
              </p>
              <p className="text-sm text-gray-500">
                E-posta gelmediyse spam klasörünüzü kontrol edin.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/api/auth/signin"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Farklı E-posta ile Dene
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
